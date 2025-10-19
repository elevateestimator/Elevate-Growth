/* =========================================================
   Land & Leaf — Modern Landscaping Interactions
   ========================================================= */
const LX_EMAIL = "hello@elevategrowth.co"; // TODO: set your email

const lxForm  = document.getElementById("lxForm");
const lxCopy  = document.getElementById("lxCopy");
const lxYear  = document.getElementById("lxYear");
if (lxYear) lxYear.textContent = new Date().getFullYear();

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href").slice(1);
    const t = document.getElementById(id);
    if(!t) return;
    e.preventDefault();
    t.scrollIntoView({behavior:"smooth", block:"start"});
  });
});

/* Header solid on scroll */
const header = document.querySelector('.lx-header');
function onScrollHeader(){
  if(window.scrollY > 6) header?.classList.add('scrolled');
  else header?.classList.remove('scrolled');
}
onScrollHeader(); window.addEventListener('scroll', onScrollHeader);

/* Mobile menu */
const menu = document.querySelector('.lx-menu');
const nav  = document.getElementById('lxNav');
function closeMenu(){ menu?.setAttribute('aria-expanded','false'); nav?.classList.remove('open'); document.body.classList.remove('lx-no-scroll'); }
function openMenu(){  menu?.setAttribute('aria-expanded','true');  nav?.classList.add('open');    document.body.classList.add('lx-no-scroll'); }
menu?.addEventListener('click', ()=> {
  const open = menu.getAttribute('aria-expanded') === 'true';
  open ? closeMenu() : openMenu();
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
window.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

/* Chip scroll -> scroll to showcase */
document.querySelectorAll('.lx-chip').forEach(chip=>{
  chip.addEventListener('click', ()=> {
    document.getElementById('showcase')?.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* Image fallback (soft placeholder if missing) */
function attachFallbacks(scope=document){
  scope.querySelectorAll("img.lx-asset").forEach(img => {
    img.addEventListener("error", () => {
      const ph = document.createElement("div");
      ph.className = "lx-img-ph";
      ph.setAttribute("role","img");
      ph.setAttribute("aria-label", img.alt || "Preview");
      img.replaceWith(ph);
    }, {once:true});
  });
}
attachFallbacks();

/* Lightbox for gallery */
const lb = document.getElementById("lxLightbox");
const lbImg = document.getElementById("lxLightboxImg");
const lbPh  = document.getElementById("lxLightboxPh");
const lbCap = document.getElementById("lxLightboxCaption");

document.querySelectorAll(".lx-open").forEach(img => {
  img.addEventListener("click", () => {
    const src = img.getAttribute("src");
    const cap = img.getAttribute("data-caption") || img.getAttribute("alt") || "Preview";
    lbCap.textContent = cap;
    lb.hidden = false; document.body.classList.add('lx-no-scroll');

    lbPh.hidden = true; lbImg.hidden = false;
    lbImg.onload = () => { lbPh.hidden = true; lbImg.hidden = false; };
    lbImg.onerror = () => { lbImg.hidden = true; lbPh.hidden = false; };
    lbImg.src = src;
  });
});
document.querySelector(".lx-lightbox-close")?.addEventListener("click", () => {
  lb.hidden = true; document.body.classList.remove('lx-no-scroll');
});
lb?.addEventListener("click", (e) => { if(e.target === lb){ lb.hidden = true; document.body.classList.remove('lx-no-scroll'); }});
window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && !lb.hidden){ lb.hidden = true; document.body.classList.remove('lx-no-scroll'); }});

/* Before/After slider */
const ba = document.querySelector('.lx-ba');
const range = document.querySelector('.lx-ba-range');
if(ba && range){
  const setPos = (v) => ba.style.setProperty('--pos', v + '%');
  range.addEventListener('input', ()=> setPos(range.value));
  setPos(range.value);
}

/* Form -> mailto */
lxForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(lxForm);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const phone = (data.get("phone") || "").toString().trim();
  const address = (data.get("address") || "").toString().trim();
  const notes = (data.get("notes") || "").toString().trim();

  if(!name || !email){
    alert("Please add your name and email so we can reply.");
    return;
  }
  const subject = encodeURIComponent(`Landscaping quote — ${name}`);
  const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Notes:
${notes}

— Sent from Land & Leaf demo.`.trim());

  window.location.href = `mailto:${LX_EMAIL}?subject=${subject}&body=${body}`;
});

/* Copy details */
const lxCopyBtn = document.getElementById("lxCopy");
lxCopyBtn?.addEventListener("click", () => {
  const data = new FormData(lxForm);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const phone = (data.get("phone") || "").toString().trim();
  const address = (data.get("address") || "").toString().trim();
  const notes = (data.get("notes") || "").toString().trim();

  const compiled =
`Landscaping quote request
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Notes:
${notes}

— Land & Leaf demo`;
  navigator.clipboard?.writeText(compiled).then(()=>{
    lxCopyBtn.textContent = "Copied ✓";
    setTimeout(()=> lxCopyBtn.textContent = "Copy details", 1500);
  }).catch(()=> alert("Copy failed — select and copy manually."));
});