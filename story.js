// One scroll owner: native scroll determines the reveal, with no wheel interception.
(() => {
 const story = document.querySelector('#beauty-story');
 const stage = story?.querySelector('.story-stage');
 if (!stage) return;
 const cover = story.querySelector('.story-cover');
 const header = document.querySelector('.site-header');
 const coverPhoto = cover.querySelector('img');
 const scenes = [...story.querySelectorAll('.story-scene')];
 const links = [...story.querySelectorAll('[data-story-link]')];
 const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
 const frames = [{start:.06,end:.21,hold:.30},{start:.37,end:.52,hold:.61},{start:.68,end:.83,hold:.92}];
 const clamp = v => Math.min(1, Math.max(0, v));
 let scheduled = false, active = -99, ready = false, failed = false, pendingScene = null;
 const headerHeight = () => parseFloat(getComputedStyle(stage).top) || 0;
 function restoreStatic() {
  document.documentElement.classList.remove('story-ready');
  story.classList.remove('in-services');
  header.classList.remove('over-service');
  header.classList.toggle('on-paper', cover.getBoundingClientRect().bottom < 104);
  cover.inert = false; cover.removeAttribute('aria-hidden'); coverPhoto.style.transform = '';
  for (const scene of scenes) { scene.inert = true; scene.setAttribute('aria-hidden','true'); }
  links.forEach(link => link.removeAttribute('aria-current'));
 }
 function render() {
  scheduled = false;
  header.classList.toggle('on-content', story.getBoundingClientRect().bottom <= 110);
  if (!ready || reduceMotion.matches) { restoreStatic(); return; }
  document.documentElement.classList.add('story-ready');
  const top = story.getBoundingClientRect().top;
  const progress = clamp((headerHeight() - top) / Math.max(1, story.offsetHeight - stage.offsetHeight));
  story.classList.toggle('in-services', progress > .035);
  header.classList.toggle('on-paper', progress >= .825);
  header.classList.toggle('over-service', progress >= .205);
  let next = -1, incomingIndex = 0;
  scenes.forEach((scene, i) => {
   const f = frames[i], reveal = clamp((progress - f.start) / (f.end - f.start));
   scene.classList.toggle('is-present', reveal > 0);
   scene.style.transform = `translateY(${(1-reveal)*100}%)`;
   const imageScale = 1.08;
   scene.querySelector('img').style.transform = `translateY(${(1-reveal)*3}%) scale(${imageScale})`;
   scene.querySelector('.scene-copy').style.transform = `translateY(${(1-reveal)*-32}px)`;
   if (reveal > 0 && reveal < .98) { next = -2; incomingIndex = i; }
   else if (reveal >= .98) next = i;
  });
  coverPhoto.style.transform = `scale(${1+Math.min(progress,.21)*.15})`;
  if (next !== active) {
   const oldScope = active === -1 ? cover : scenes[active];
   const hadFocus = oldScope?.contains(document.activeElement);
   active = next;
   cover.inert = active !== -1; cover.setAttribute('aria-hidden',String(active !== -1));
   scenes.forEach((scene,i) => {
    const isActive = active === i;
    scene.classList.toggle('is-active',isActive); scene.inert = !isActive;
    scene.setAttribute('aria-hidden',String(!isActive));
   });
   links.forEach((link,i) => active === i ? link.setAttribute('aria-current','true') : link.removeAttribute('aria-current'));
   if (hadFocus) (active === -1 ? cover.querySelector('a') : links[active === -2 ? incomingIndex : active]).focus({preventScroll:true});
  }
 }
 function queue() { if (!scheduled) { scheduled = true; requestAnimationFrame(render); } }
 function goToScene(index) {
  if (!ready && !failed && !reduceMotion.matches) { pendingScene = index; return; }
  if (!ready || reduceMotion.matches) {
   document.querySelector(`#tab-${scenes[index].dataset.scene}`)?.click();
   document.querySelector('#services').scrollIntoView({behavior:'auto'}); return;
  }
  const target = story.getBoundingClientRect().top + scrollY - headerHeight() + frames[index].hold*(story.offsetHeight-stage.offsetHeight);
  window.scrollTo({top:target,behavior:'auto'}); queue();
 }
 links.forEach((link,index) => link.addEventListener('click',event => { event.preventDefault(); goToScene(index); }));
 cover.querySelector('a').addEventListener('click',event => { event.preventDefault(); goToScene(0); });
 // Preload only these three frames. On failure the usable cover stays in ordinary flow.
 scenes.forEach(scene => { scene.inert=true; scene.setAttribute('aria-hidden','true'); scene.querySelector('img').loading='eager'; });
 Promise.all(scenes.map(scene => scene.querySelector('img').decode())).then(() => {
  ready=true; active=-99; render();
  if (pendingScene !== null) { goToScene(pendingScene); pendingScene = null; }
  else if (location.hash && location.hash !== '#top') {
   const target = document.getElementById(location.hash.slice(1));
   if (target && !story.contains(target)) target.scrollIntoView({behavior:'auto'});
  }
 }).catch(() => { failed=true; restoreStatic(); if(pendingScene !== null) goToScene(pendingScene); });
 addEventListener('scroll',queue,{passive:true}); addEventListener('resize',queue,{passive:true});
 reduceMotion.addEventListener('change',() => { active=-99; queue(); });
 // Home/anchor navigation remains native; motion follows its resulting scroll position.
 queue();
})();
