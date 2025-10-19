/* =========================================================
   Elevate Growth Sites™ — Interactions
   ========================================================= */
const CONTACT_EMAIL = "hello@elevategrowth.co"; // TODO: set to your real email

const form = document.getElementById("contactForm");
const copyBtn = document.getElementById("copyPreview");
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* Smooth anchor scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:"smooth", block:"start"});
  });
});

/* Replace missing images with a styled placeholder block */
function attachImageFallbacks(){
  document.querySelectorAll("img.asset").forEach(img => {
    img.addEventListener("error", () => {
      const ph = document.createElement("div");
      ph.className = "img-ph";
      ph.setAttribute("role","img");
      ph.setAttribute("aria-label", img.alt || "Preview");
      img.replaceWith(ph);
    }, {once:true});
  });
}
attachImageFallbacks();

/* Lightbox with placeholder fallback */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxPh  = document.getElementById("lightbox-ph");
const lightboxCaption = document.getElementById("lightbox-caption");

document.querySelectorAll(".open-lightbox").forEach(btn => {
  btn.addEventListener("click", () => {
    const src = btn.dataset.image;
    const title = btn.closest(".shot")?.dataset.title || "Preview";
    lightboxCaption.textContent = title;
    lightbox.hidden = false;

    // Show image, hide placeholder by default
    lightboxPh.hidden = true;
    lightboxImg.hidden = false;
    lightboxImg.onload = () => { lightboxPh.hidden = true; lightboxImg.hidden = false; };
    lightboxImg.onerror = () => { lightboxImg.hidden = true; lightboxPh.hidden = false; };
    lightboxImg.src = src;
  });
});

document.querySelector(".lightbox-close")?.addEventListener("click", () => {
  lightbox.hidden = true;
});
lightbox?.addEventListener("click", (e) => {
  if(e.target === lightbox) lightbox.hidden = true;
});

/* Form submit => open mailto draft */
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const phone = (data.get("phone") || "").toString().trim();
  const company = (data.get("company") || "").toString().trim();
  const message = (data.get("message") || "").toString().trim();

  if(!name || !email){
    alert("Please add your name and email so we can reply.");
    return;
  }
  const subject = encodeURIComponent(`Website quote — ${company || name}`);
  const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Phone: ${phone}
Business: ${company}
Project: ${message}

Sent from Elevate Growth Sites.`.trim());

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});

/* Copy message helper */
copyBtn?.addEventListener("click", () => {
  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const phone = (data.get("phone") || "").toString().trim();
  const company = (data.get("company") || "").toString().trim();
  const message = (data.get("message") || "").toString().trim();

  const compiled =
`Website quote request
Name: ${name}
Email: ${email}
Phone: ${phone}
Business: ${company}

Goals:
${message}

— Sent from Elevate Growth Sites`;

  navigator.clipboard?.writeText(compiled).then(() => {
    copyBtn.textContent = "Copied ✓";
    setTimeout(()=> copyBtn.textContent = "Copy message", 1500);
  }).catch(()=>{
    alert("Copy failed — select and copy manually.");
  });
});

/* Subtle scroll-reveal for extra pop (respects reduced motion) */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersReduced){
  const reveal = (els) => {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.animate(
            [{opacity:0, transform:'translateY(12px)'},
             {opacity:1, transform:'translateY(0)'}],
            {duration:500, easing:'cubic-bezier(.2,.7,.2,1)', fill:'forwards'}
          );
          io.unobserve(e.target);
        }
      })
    }, {threshold:.12});
    els.forEach(el=> io.observe(el));
  };
  reveal(document.querySelectorAll('.feature, .shot, .offer-card, .steps li, .contact-card'));
}
/* === Mobile menu toggle === */
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.getElementById('primaryNav');

function closeMenu(){
  if(!menuToggle || !primaryNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  primaryNav.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

function openMenu(){
  if(!menuToggle || !primaryNav) return;
  menuToggle.setAttribute('aria-expanded', 'true');
  primaryNav.classList.add('open');
  document.body.classList.add('no-scroll');
}

menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  expanded ? closeMenu() : openMenu();
});

primaryNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMenu); // close after navigating on mobile
});

window.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeMenu();
});