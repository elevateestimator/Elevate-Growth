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

/* Lightbox (still available for any .open-lightbox buttons you may add) */
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

/* Subtle scroll-reveal (respects reduced motion) */
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
primaryNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
window.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeMenu(); });

/* ===== Demo modal (iframe) ===== */
const demoModal   = document.getElementById('demoModal');
const demoPanel   = demoModal?.querySelector('.demo-panel');
const demoFrame   = document.getElementById('demoFrame');
const demoLoading = document.getElementById('demoLoading');
const demoClose   = document.querySelector('.demo-close');
const demoNewTab  = document.getElementById('demoNewTab');

let lastFocusedEl = null;

function openDemo(src, titleText){
  if (!demoModal || !demoFrame) return;
  // If mobile nav is open, close it first
  if (typeof closeMenu === 'function') closeMenu();

  lastFocusedEl = document.activeElement;
  document.body.classList.add('no-scroll');
  demoModal.hidden = false;

  // Set title and "open in new tab" href
  const title = document.getElementById('demoTitle');
  if (title) title.textContent = titleText || 'Demo';
  if (demoNewTab) demoNewTab.href = src;

  // Show spinner until iframe loads
  demoLoading && (demoLoading.style.display = 'grid');
  demoFrame.hidden = true;
  demoFrame.onload = () => {
    demoFrame.hidden = false;
    if (demoLoading) demoLoading.style.display = 'none';
  };
  demoFrame.onerror = () => {
    if (demoLoading) demoLoading.style.display = 'none';
    alert('Could not load the demo. Opening in a new tab instead.');
    window.open(src, '_blank', 'noopener');
    closeDemo();
  };
  demoFrame.src = src;

  // Focus close for accessibility
  demoClose?.focus();
}

function closeDemo(){
  if (!demoModal) return;
  demoModal.hidden = true;
  document.body.classList.remove('no-scroll');
  if (demoFrame) demoFrame.src = 'about:blank'; // free resources
  if (lastFocusedEl) lastFocusedEl.focus?.();
}

// Open triggers (gallery "Open" buttons)
document.querySelectorAll('.open-demo').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const src   = btn.getAttribute('data-src');
    const title = btn.closest('.shot')?.dataset.title || 'Demo';
    if (!src) return;
    openDemo(src, title);
  });
});

// Close triggers
demoClose?.addEventListener('click', closeDemo);
demoModal?.addEventListener('click', (e)=>{ if(e.target === demoModal) closeDemo(); });
window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && !demoModal.hidden) closeDemo(); });

// Minimal focus trap inside modal
demoModal?.addEventListener('keydown', (e)=>{
  if (e.key !== 'Tab') return;
  const focusables = demoModal.querySelectorAll('a[href], button:not([disabled])');
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
});
/* ===== Hotfix: always open the iframe modal for gallery buttons ===== */
(function(){
  const modalExists = !!document.getElementById('demoModal');
  if (!modalExists) return; // nothing to do if the modal isn't on this page

  // Map old lightbox images to demo pages if needed
  const IMG_TO_DEMO = {
    'assets/mock1.png': 'demos/roofing.html',
    'assets/mock2.png': 'demos/landscaping.html',
    'assets/mock3.png': 'demos/renovations.html'
  };

  // Intercept BOTH .open-demo and .open-lightbox (capture = true runs before older handlers)
  document.querySelectorAll('.open-demo, .open-lightbox').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation(); // cancel any lightbox listener bound earlier

      const card  = btn.closest('.shot');
      const title = card?.dataset.title || 'Demo';
      let src = btn.getAttribute('data-src');

      if (!src) {
        const img = btn.getAttribute('data-image') || '';
        src = IMG_TO_DEMO[img] || '';
      }
      if (!src) return;

      // Use your existing openDemo() from this file
      if (typeof openDemo === 'function') {
        openDemo(src, title);
      }
    }, true);
  });
})();
/* ===== Force iframe modal for gallery buttons (beats old lightbox) ===== */
(function(){
  if (!document.getElementById('demoModal')) return;

  const IMG_TO_DEMO = {
    'assets/mock1.png': 'demos/roofing.html',
    'assets/mock2.png': 'demos/landscaping.html',
    'assets/mock3.png': 'demos/renovations.html'
  };

  document.querySelectorAll('.open-demo, .open-lightbox').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();  // cancel old lightbox listener
      const card  = btn.closest('.shot');
      const title = card?.dataset.title || 'Demo';
      const src   = btn.getAttribute('data-src') ||
                    IMG_TO_DEMO[btn.getAttribute('data-image')] || '';
      if (!src) return;

      if (typeof openDemo === 'function') openDemo(src, title);
    }, true); // capture phase so this runs first
  });
})();