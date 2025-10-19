/* =========================================================
   Roofing — Modern Inspiration (interactions)
   ========================================================= */
const RX_EMAIL = "hello@elevategrowth.co"; // TODO: set your email

const rxForm = document.getElementById("rxForm");
const rxCopy = document.getElementById("rxCopy");
const rxYear = document.getElementById("rxYear");
if (rxYear) rxYear.textContent = new Date().getFullYear();

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

/* Mobile menu */
const rxMenu = document.querySelector('.rx-menu');
const rxNav  = document.getElementById('rxNav');
function rxCloseMenu(){ rxMenu?.setAttribute('aria-expanded','false'); rxNav?.classList.remove('open'); document.body.classList.remove('rx-no-scroll'); }
function rxOpenMenu(){  rxMenu?.setAttribute('aria-expanded','true');  rxNav?.classList.add('open');    document.body.classList.add('rx-no-scroll'); }
rxMenu?.addEventListener('click', ()=>{
  const open = rxMenu.getAttribute('aria-expanded') === 'true';
  open ? rxCloseMenu() : rxOpenMenu();
});
rxNav?.querySelectorAll('a').forEach(a=> a.addEventListener('click', rxCloseMenu));
window.addEventListener('keydown', e => { if(e.key === 'Escape') rxCloseMenu(); });

/* Image fallbacks (replace broken images with a soft placeholder) */
function rxAttachFallbacks(scope=document){
  scope.querySelectorAll("img.rx-asset").forEach(img => {
    img.addEventListener("error", () => {
      const ph = document.createElement("div");
      ph.className = "rx-img-ph";
      ph.setAttribute("role","img");
      ph.setAttribute("aria-label", img.alt || "Preview");
      img.replaceWith(ph);
    }, {once:true});
  });
}
rxAttachFallbacks();

/* Lightbox */
const lb = document.getElementById("rxLightbox");
const lbImg = document.getElementById("rxLightboxImg");
const lbPh  = document.getElementById("rxLightboxPh");
const lbCap = document.getElementById("rxLightboxCaption");

document.querySelectorAll(".rx-open").forEach(img => {
  img.addEventListener("click", () => {
    const src = img.getAttribute("src");
    const cap = img.getAttribute("data-caption") || img.getAttribute("alt") || "Preview";
    lbCap.textContent = cap;
    lb.hidden = false; document.body.classList.add('rx-no-scroll');

    lbPh.hidden = true; lbImg.hidden = false;
    lbImg.onload = () => { lbPh.hidden = true; lbImg.hidden = false; };
    lbImg.onerror = () => { lbImg.hidden = true; lbPh.hidden = false; };
    lbImg.src = src;
  });
});
document.querySelector(".rx-lightbox-close")?.addEventListener("click", () => {
  lb.hidden = true; document.body.classList.remove('rx-no-scroll');
});
lb?.addEventListener("click", (e) => { if(e.target === lb){ lb.hidden = true; document.body.classList.remove('rx-no-scroll'); }});
window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && !lb.hidden){ lb.hidden = true; document.body.classList.remove('rx-no-scroll'); }});

/* Before/After slider */
const ba = document.querySelector('.rx-ba');
const range = document.querySelector('.rx-ba-range');
if(ba && range){
  const setPos = (v) => ba.style.setProperty('--pos', v + '%');
  range.addEventListener('input', ()=> setPos(range.value));
  setPos(range.value);
}

/* Form -> mailto */
rxForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(rxForm);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const phone = (data.get("phone") || "").toString().trim();
  const address = (data.get("address") || "").toString().trim();
  const notes = (data.get("notes") || "").toString().trim();

  if(!name || !email){
    alert("Please add your name and email so we can reply.");
    return;
  }
  const subject = encodeURIComponent(`Roof inspection request — ${name}`);
  const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Notes:
${notes}

— Sent from Roofing demo (modern).`.trim());

  window.location.href = `mailto:${RX_EMAIL}?subject=${subject}&body=${body}`;
});

/* Copy details */
rxCopy?.addEventListener("click", () => {
  const data = new FormData(rxForm);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const phone = (data.get("phone") || "").toString().trim();
  const address = (data.get("address") || "").toString().trim();
  const notes = (data.get("notes") || "").toString().trim();

  const compiled =
`Roof inspection request
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Notes:
${notes}

— Roofing demo (modern)`;
  navigator.clipboard?.writeText(compiled).then(()=>{
    rxCopy.textContent = "Copied ✓";
    setTimeout(()=> rxCopy.textContent = "Copy details", 1500);
  }).catch(()=> alert("Copy failed — select and copy manually."));
});