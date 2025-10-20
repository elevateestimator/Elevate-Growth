/* Renova – interactions focused on the Projects carousel (2-up), lightbox, and form */
const RV_EMAIL = "hello@elevategrowth.co"; // set your real inbox

/* Smooth scroll for same-page anchors */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const t = document.getElementById(id);
    if(!t) return;
    e.preventDefault();
    t.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* Mobile menu */
const rvMenu = document.querySelector('.rv-menu');
const rvNav  = document.querySelector('.rv-nav');
function rvCloseMenu(){ rvMenu?.setAttribute('aria-expanded','false'); rvNav?.classList.remove('open'); document.body.classList.remove('rv-no-scroll'); }
function rvOpenMenu(){  rvMenu?.setAttribute('aria-expanded','true');  rvNav?.classList.add('open');    document.body.classList.add('rv-no-scroll'); }
rvMenu?.addEventListener('click', ()=> {
  const open = rvMenu.getAttribute('aria-expanded') === 'true';
  open ? rvCloseMenu() : rvOpenMenu();
});
rvNav?.querySelectorAll('a').forEach(a=> a.addEventListener('click', rvCloseMenu));
window.addEventListener('keydown', e => { if(e.key === 'Escape') rvCloseMenu(); });

/* ===== 2‑up Projects carousel (scrollLeft paging) ===== */
(function initCarousel(){
  const carousels = document.querySelectorAll('.rv-carousel');
  carousels.forEach(carousel=>{
    const viewport = carousel.querySelector('.rv-viewport');
    const prev = carousel.querySelector('.rv-prev');
    const next = carousel.querySelector('.rv-next');
    if(!viewport || !prev || !next) return;

    const step = () => viewport.clientWidth; // page width == 2 cards (or 1 on mobile)

    function go(dir){
      viewport.scrollBy({ left: dir * step(), behavior:'smooth' });
    }
    function update(){
      const max = viewport.scrollWidth - viewport.clientWidth - 1;
      prev.disabled = viewport.scrollLeft <= 1;
      next.disabled = viewport.scrollLeft >= max;
    }

    // Buttons
    prev.addEventListener('click', ()=> go(-1));
    next.addEventListener('click', ()=> go(1));

    // Keep arrows correct while scrolling / resizing
    let raf = 0;
    viewport.addEventListener('scroll', ()=> {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    });
    window.addEventListener('resize', update);

    // Keyboard support when viewport is in view
    viewport.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowRight'){ e.preventDefault(); go(1); }
      if(e.key === 'ArrowLeft'){  e.preventDefault(); go(-1); }
    });
    // Start state
    update();
  });
})();

/* Lightbox for project images */
const lb = document.getElementById('rvLightbox');
const lbImg = document.getElementById('rvLightboxImg');
document.querySelectorAll('.rv-enlarge').forEach(img=>{
  img.addEventListener('click', ()=>{
    lb.hidden = false;
    lbImg.src = img.getAttribute('src');
  });
});
document.querySelector('.rv-lightbox-close')?.addEventListener('click', ()=> lb.hidden = true);
lb?.addEventListener('click', e => { if(e.target === lb) lb.hidden = true; });
window.addEventListener('keydown', e => { if(e.key === 'Escape' && !lb.hidden) lb.hidden = true; });

/* Simple form -> mailto */
const rvForm = document.getElementById('rvForm');
const rvCopy = document.getElementById('rvCopy');
rvForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = new FormData(rvForm);
  const name = (data.get('name')||'').toString().trim();
  const email = (data.get('email')||'').toString().trim();
  const phone = (data.get('phone')||'').toString().trim();
  const notes = (data.get('notes')||'').toString().trim();
  if(!name || !email){ alert('Please add your name and email.'); return; }
  const subject = encodeURIComponent(`Renovation quote — ${name}`);
  const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Phone: ${phone}

Notes:
${notes}

— Sent from Renova demo.`.trim());
  window.location.href = `mailto:${RV_EMAIL}?subject=${subject}&body=${body}`;
});
rvCopy?.addEventListener('click', ()=>{
  const data = new FormData(rvForm);
  const name = (data.get('name')||'').toString().trim();
  const email = (data.get('email')||'').toString().trim();
  const phone = (data.get('phone')||'').toString().trim();
  const notes = (data.get('notes')||'').toString().trim();
  const compiled =
`Renovation quote request
Name: ${name}
Email: ${email}
Phone: ${phone}

Notes:
${notes}

— Renova demo`;
  navigator.clipboard?.writeText(compiled).then(()=>{
    rvCopy.textContent = 'Copied ✓';
    setTimeout(()=> rvCopy.textContent = 'Copy details', 1400);
  });
});