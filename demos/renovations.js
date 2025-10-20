/* =========================================================
   Renova — Interactions (palette studio + projects carousel)
   ========================================================= */
const RV_EMAIL = "hello@elevategrowth.co"; // set yours

const rvForm  = document.getElementById("rvForm");
const rvCopy  = document.getElementById("rvCopy");
const rvYear  = document.getElementById("rvYear");
if (rvYear) rvYear.textContent = new Date().getFullYear();

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

/* ---------- Palette Studio ---------- */
const scene    = document.getElementById('palScene');
const caption  = document.getElementById('palCaption');
const comboBox = document.getElementById('palCombo');
const swatches = Array.from(document.querySelectorAll('.rv-swatch'));
const shuffle  = document.getElementById('palShuffle');
const clearBtn = document.getElementById('palClear');

let selected = []; // [{type:'image'|'color', name, img?, color?}]
const MAX = 3;

function renderCombo(){
  comboBox.innerHTML = "";
  selected.forEach(s => {
    const chip = document.createElement('span');
    chip.className = 'rv-chip';
    const dot  = document.createElement('span');
    dot.className = 'rv-dot';
    if (s.type === 'image') {
      const im = document.createElement('img');
      im.src = s.img; im.alt = s.name;
      dot.appendChild(im);
    } else {
      dot.style.background = s.color;
    }
    chip.appendChild(dot);
    chip.append(document.createTextNode(s.name));
    comboBox.appendChild(chip);
  });

  const names = selected.map(s => s.name).join(' • ') || 'Soft White • European Oak • Satin Brass';
  caption.textContent = `Open Concept Kitchen — ${names}`;

  // scene logic: prefer last selected image; tint with last selected color
  const lastImg = [...selected].reverse().find(s => s.type === 'image');
  if (lastImg) scene.src = lastImg.img;

  const lastColor = [...selected].reverse().find(s => s.type === 'color');
  const sceneWrap = scene.closest('.rv-pal-scene');
  if (sceneWrap){
    sceneWrap.style.setProperty('--tint', lastColor ? lastColor.color : 'transparent');
  }
}

function toggleSwatch(btn){
  const type = btn.dataset.type;
  const name = btn.dataset.name || btn.querySelector('span')?.textContent || 'Material';
  const entry = (type === 'image')
    ? {type, name, img: btn.dataset.img}
    : {type, name, color: btn.dataset.color};

  const idx = selected.findIndex(s => s.name === name);
  if (idx >= 0){
    selected.splice(idx, 1);
    btn.classList.remove('selected'); btn.setAttribute('aria-pressed','false');
  } else {
    if (selected.length >= MAX) selected.shift();
    selected.push(entry);
    btn.classList.add('selected'); btn.setAttribute('aria-pressed','true');
    if (entry.type === 'image') scene.src = entry.img;
    if (entry.type === 'color') scene.closest('.rv-pal-scene')?.style.setProperty('--tint', entry.color);
  }
  renderCombo();
}

swatches.forEach(btn=>{
  if(btn.classList.contains('rv-color')){
    // paint color chip background
    btn.style.setProperty('--swatch', btn.dataset.color || '#eee');
  }
  btn.setAttribute('aria-pressed','false');
  btn.addEventListener('click', ()=> toggleSwatch(btn));
});

shuffle?.addEventListener('click', ()=>{
  // a few pleasing combos
  const combos = [
    ['Soft White','European Oak','Satin Brass'],
    ['Soft White','Porcelain Tile','Matte Black'],
    ['Walnut Veneer','Graphite Stone','Satin Brass'],
    ['Textured Paint','European Oak','Matte Black']
  ];
  const pick = combos[Math.floor(Math.random()*combos.length)];
  // reset
  selected = [];
  swatches.forEach(b=>{ b.classList.remove('selected'); b.setAttribute('aria-pressed','false'); });

  // apply combo by clicking matching buttons programmatically
  pick.forEach(name=>{
    const btn = swatches.find(b => (b.dataset.name||'').toLowerCase() === name.toLowerCase());
    if (btn) toggleSwatch(btn);
  });
  renderCombo();
});

clearBtn?.addEventListener('click', ()=>{
  selected = [];
  swatches.forEach(b=>{ b.classList.remove('selected'); b.setAttribute('aria-pressed','false'); });
  // reset scene + tint
  scene.src = 'renovationassets/openkitchen.avif';
  scene.closest('.rv-pal-scene')?.style.setProperty('--tint', 'transparent');
  renderCombo();
});

// initial state
selected = [
  {type:'color', name:'Soft White', color:'#F5F2E9'},
  {type:'image', name:'European Oak', img:'renovationassets/europeanoak.jpg'},
  {type:'color', name:'Satin Brass', color:'#B99A5C'}
];
renderCombo();

/* ---------- Projects: 2‑up carousel with arrows ---------- */
const track   = document.getElementById('rvTrack');
const prevBtn = document.querySelector('.rv-prev');
const nextBtn = document.querySelector('.rv-next');

function cardStep(){
  const first = track?.querySelector('.rv-card');
  if(!first) return 0;
  const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "16");
  return first.getBoundingClientRect().width + gap;
}
function maxIndex(){
  const total = track.children.length;
  // 2 visible on desktop, 1 on mobile (CSS switches); compute from current layout
  const first = track.querySelector('.rv-card');
  if(!first) return 0;
  const visible = Math.round(track.clientWidth / first.getBoundingClientRect().width) || 1;
  return Math.max(0, total - visible);
}
function updateArrows(){
  const idx = Math.round(track.scrollLeft / Math.max(1, cardStep()));
  prevBtn.disabled = idx <= 0;
  nextBtn.disabled = idx >= maxIndex();
}

function scrollByCards(dir){
  const step = cardStep();
  const target = track.scrollLeft + dir * step;
  track.scrollTo({left: target, behavior:'smooth'});
  // small async to reflect new state
  setTimeout(updateArrows, 200);
}

prevBtn?.addEventListener('click', ()=> scrollByCards(-1));
nextBtn?.addEventListener('click', ()=> scrollByCards(1));
track?.addEventListener('scroll', updateArrows, {passive:true});
window.addEventListener('resize', updateArrows);
updateArrows();

/* ---------- Contact form (mailto) ---------- */
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
  const subject = encodeURIComponent(`Renovation quote — ${name}`);
  const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Notes:
${notes}

— Sent from Renova demo.`.trim());

  window.location.href = `mailto:${RV_EMAIL}?subject=${subject}&body=${body}`;
});

/* Copy details */
rvCopy?.addEventListener("click", () => {
  const data = new FormData(rvForm);
  const compiled =
`Renovation quote request
Name: ${(data.get("name")||"")}
Email: ${(data.get("email")||"")}
Phone: ${(data.get("phone")||"")}
Address: ${(data.get("address")||"")}

Notes:
${(data.get("notes")||"")}

— Renova demo`;
  navigator.clipboard?.writeText(compiled).then(()=>{
    rvCopy.textContent = "Copied ✓";
    setTimeout(()=> rvCopy.textContent = "Copy details", 1500);
  }).catch(()=> alert("Copy failed — select and copy manually."));
});