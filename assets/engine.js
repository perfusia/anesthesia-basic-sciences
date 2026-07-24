/* ANES 710/720 — shared quiz runtime
   First answer locks. Mechanism shown on lock. Misses copy to clipboard.
   Fill-in grading is lenient on case/punctuation, strict on order. */

(function(){
  const state = { total:0, correct:0, answered:0, misses:[] };

  function norm(s){
    return String(s).toLowerCase()
      .replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"')
      .replace(/[.,;:!?()]/g,' ')
      .replace(/\s+/g,' ').trim();
  }

  // strict on order: split candidate and key on ';' and match part-by-part
  function fibMatch(given, keys){
    const g = norm(given);
    for(const key of keys){
      const parts = String(key).split(';').map(norm).filter(Boolean);
      if(parts.length === 1){
        if(g === parts[0]) return true;
        continue;
      }
      // split the RAW string: norm() strips separators, so splitting after
      // normalising would collapse every multi-part answer into one token
      // and silently accept reversed order.
      const gParts = String(given).split(/\s*;\s*|\s+then\s+|\s*,\s*|\s*->\s*/)
                                  .map(norm).filter(Boolean);
      if(gParts.length !== parts.length) continue;
      let ok = true;
      for(let i=0;i<parts.length;i++){ if(gParts[i] !== parts[i]){ ok=false; break; } }
      if(ok) return true;
    }
    return false;
  }

  function record(qText, chosen, right, why, hit){
    state.answered++;
    if(hit) state.correct++;
    else state.misses.push({q:qText, chosen:chosen, right:right, why:why});
    updateScore();
  }

  function updateScore(){
    document.querySelectorAll('.score').forEach(el=>{
      el.textContent = state.correct + ' / ' + state.answered + ' answered  ·  ' + state.total + ' total';
    });
  }

  function lockMC(qEl){
    qEl.querySelectorAll('.opt').forEach(b=>b.disabled=true);
  }

  window.ANES = {
    init(){
      const qs = document.querySelectorAll('.q');
      state.total = qs.length;
      qs.forEach(qEl=>{
        const why = qEl.querySelector('.why');
        const qText = qEl.querySelector('.qtext').textContent.trim();

        // multiple choice / true-false
        qEl.querySelectorAll('.opt').forEach(btn=>{
          btn.addEventListener('click', ()=>{
            if(btn.disabled) return;
            const isRight = btn.dataset.correct === '1';
            lockMC(qEl);
            btn.classList.add(isRight ? 'correct' : 'wrong');
            if(!isRight){
              const rightBtn = qEl.querySelector('.opt[data-correct="1"]');
              if(rightBtn) rightBtn.classList.add('correct');
            }
            if(why) why.classList.add('show');
            const rightText = (qEl.querySelector('.opt[data-correct="1"]')||{}).textContent || '';
            record(qText, btn.textContent.trim(), rightText.trim(), why?why.dataset.plain:'', isRight);
          });
        });

        // fill in the blank
        const fib = qEl.querySelector('.fib');
        if(fib){
          const input = fib.querySelector('input');
          const go = fib.querySelector('button');
          const keys = JSON.parse(fib.dataset.answers);
          const submit = ()=>{
            if(input.disabled) return;
            const hit = fibMatch(input.value, keys);
            input.disabled = true; go.disabled = true;
            input.style.borderColor = hit ? 'var(--ok)' : 'var(--miss)';
            input.style.background = hit ? '#e8f2e9' : '#f7e9e6';
            if(why) why.classList.add('show');
            record(qText, input.value.trim()||'(blank)', keys[0], why?why.dataset.plain:'', hit);
          };
          go.addEventListener('click', submit);
          input.addEventListener('keydown', e=>{ if(e.key==='Enter') submit(); });
        }
      });
      updateScore();

      document.querySelectorAll('.copymiss').forEach(b=>{
        b.addEventListener('click', ()=>{
          if(!state.misses.length){ b.textContent='No misses yet'; setTimeout(()=>b.textContent='Copy my misses',1600); return; }
          const head = document.title;
          const txt = state.misses.map((m,i)=>
            `${i+1}. ${m.q}\n   I chose: ${m.chosen}\n   Correct: ${m.right}\n   Why: ${m.why}`
          ).join('\n\n');
          navigator.clipboard.writeText(`MISSES — ${head}\n\n${txt}`).then(()=>{
            b.textContent = `Copied ${state.misses.length}`;
            setTimeout(()=>b.textContent='Copy my misses',1600);
          });
        });
      });
    }
  };

  document.addEventListener('DOMContentLoaded', ()=>window.ANES.init());
})();
