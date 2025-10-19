/* =========================================================
   Renovations — Modern Refined (interactions)
   ========================================================= */
const RV_EMAIL = "hello@elevategrowth.co"; // TODO: set your email

// Year
const rvYear = document.getElementById("rvYear");
if (rvYear) rvYear.textContent = new Date().getFullYear();

/* Smooth scrolling for in-page links */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href").slice(1);
    const t = document.getElementById(id);
    if(!t) return;
    e.preventDefault();
    t.scrollIntoView({behavior:"smooth", block:"start"});
  });
});

/* Mobile menu overlay */
const rvMenu = document.querySelector('.rv-menu');
const rvNav  = document.getElementById('rvNav');
function closeMenu(){ rvMenu?.setAttribute('aria-expanded','false'); rvNav?.classList.remove('open'); document.body.classList.remove('rv-no-scroll'); }
function openMenu(){  rvMenu?.setAttribute('aria-expanded','true');  rvNav?.classList.add('open');    document.body.classList.add('rv-no-scroll'); }
rvMenu?.addEventListener('click', ()=>{
  const open = rvMenu.getAttribute('aria-expanded') === 'true';
  open ? closeMenu() : openMenu();
});
rvNav?.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeMenu));
window.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

/* Image fallbacks (clean placeholder if missing) */
function rvAttachFallbacks(scope=document){
  scope.querySelectorAll("img.rv-asset").forEach(img => {
    img.addEventListener("error", () => {
      const ph = document.createElement("div");
      ph.className = "rv-ph-inline";
      ph.setAttribute("role","img");
      ph.setAttribute("aria-label", img.alt || "Preview");
      img.replaceWith(ph);
    }, {once:true});
  });
}
rvAttachFallbacks();

/* Lightbox */
const lb = document.getElementById("rvLightbox");
const lbImg = document.getElementById("rvLightboxImg");
const lbPh  = document.getElementById("rvLightboxPh");
const lbCap = document.getElementById("rvLightboxCaption");
document.querySelectorAll(".rv-open").forEach(img => {
  img.addEventListener("click", () => {
    const src = img.getAttribute("src");
    const cap = img.getAttribute("data-caption") || img.getAttribute("alt") || "Preview";
    lbCap.textContent = cap;
    lb.hidden = false; document.body.classList.add('rv-no-scroll');

    lbPh.hidden = true; lbImg.hidden = false;
    lbImg.onload = () => { lbPh.hidden = true; lbImg.hidden = false; };
    lbImg.onerror = () => { lbImg.hidden = true; lbPh.hidden = false; };
    lbImg.src = src;
  });
});
document.querySelector(".rv-x")?.addEventListener("click", () => {
  lb.hidden = true; document.body.classList.remove('rv-no-scroll');
});
lb?.addEventListener("click", (e) => { if(e.target === lb){ lb.hidden = true; document.body.classList.remove('rv-no-scroll'); }});
window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && !lb.hidden){ lb.hidden = true; document.body.classList.remove('rv-no-scroll'); }});

/* Reel arrows */
const track = document.querySelector('.rv-track');
const prev  = document.querySelector('.rv-prev');
const next  = document.querySelector('.rv-next');

function cardStep(){
  const card = track?.querySelector('.rv-slide');
  if(!card) return 320;
  const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
  return card.getBoundingClientRect().width + gap;
}
function updateArrows(){
  if(!track || !prev || !next) return;
  const max = track.scrollWidth - track.clientWidth - 2;
  prev.disabled = track.scrollLeft <= 0;
  next.disabled = track.scrollLeft >= max;
}
prev?.addEventListener('click', ()=> track.scrollBy({left: -cardStep(), behavior:'smooth'}));
next?.addEventListener('click', ()=> track.scrollBy({left:  cardStep(), behavior:'smooth'}));
track?.addEventListener('scroll', updateArrows);
window.addEventListener('resize', updateArrows);
updateArrows();

/// Drawer (contact)
const drawer   = document.getElementById('rvDrawer');
const openBtns = document.querySelectorAll('[data-open-drawer]');
const closeBtn = drawer?.querySelector('.rv-drawer-close');

function openDrawer(){
  if(!drawer) return;
  if (typeof closeMenu === 'function') closeMenu();  // ensure mobile nav is closed
  drawer.hidden = false;
  document.body.classList.add('rv-no-scroll');       // also hides sticky CTA via CSS
}

function closeDrawer(){
  if(!drawer) return;
  drawer.hidden = true;
  document.body.classList.remove('rv-no-scroll');
}

openBtns.forEach(btn => btn.addEventListener('click', openDrawer));
closeBtn?.addEventListener('click', closeDrawer);
drawer?.addEventListener('click', e => { if(e.target === drawer) closeDrawer(); });
window.addEventListener('keydown', e => { if(e.key === 'Escape') closeDrawer(); });

/* Form -> mailto */
const rvForm = document.getElementById("rvForm");
const rvCopy = document.getElementById("rvCopy");

rvForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(rvForm);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const phone = (data.get("phone") || "").toString().trim();
  const address = (data.get("address") || "").toString().trim();
  const notes = (data.get("notes") || "").toString().trim();

  if(!name || !email){
    alert("Please add your name and email so we can reply.");
    return;
  }
  const subject = encodeURIComponent(`Renovations — start project: ${name}`);
  const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Notes:
${notes}

— Sent from Renova Studio demo.`.trim());

  window.location.href = `mailto:${RV_EMAIL}?subject=${subject}&body=${body}`;
});

/* Copy details */
rvCopy?.addEventListener("click", () => {
  const data = new FormData(rvForm);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const phone = (data.get("phone") || "").toString().trim();
  const address = (data.get("address") || "").toString().trim();
  const notes = (data.get("notes") || "").toString().trim();

  const compiled =
`Start project — renovations
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Notes:
${notes}

— Renova Studio demo`;
  navigator.clipboard?.writeText(compiled).then(()=>{
    rvCopy.textContent = "Copied ✓";
    setTimeout(()=> rvCopy.textContent = "Copy details", 1500);
  }).catch(()=> alert("Copy failed — select & copy manually."));
});
