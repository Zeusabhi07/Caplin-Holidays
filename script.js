/* ============================================================
   WANDERLUST TRAVEL AGENCY — JAVASCRIPT
   ============================================================ */

'use strict';

// ============================================================
// NAVBAR — Scroll & Hamburger
// ============================================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
    toggleScrollTop();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  function updateActiveLink() {
    const sections = ['home', 'destinations', 'tours', 'features', 'testimonials', 'contact'];
    let current = '';
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section && window.scrollY >= section.offsetTop - 120) {
        current = id;
      }
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
})();

// ============================================================
// SCROLL TO TOP
// ============================================================
const scrollTopBtn = document.getElementById('scrollTopBtn');
function toggleScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ============================================================
// COUNTER ANIMATION (Hero Stats)
// ============================================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(animateCounter);
    }
  });
}, { threshold: 0.3 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);

// ============================================================
// SEARCH BUTTON
// ============================================================
document.getElementById('searchBtn').addEventListener('click', () => {
  const dest = document.getElementById('searchDestination').value.trim();
  const date = document.getElementById('searchDate').value;
  const travelers = document.getElementById('searchTravelers').value;
  if (!dest) {
    showToast('✈ Please enter a destination to search!');
    return;
  }
  showToast(`🔍 Searching packages for ${dest} · ${travelers} ${travelers === '1' ? 'person' : 'people'}…`);
  setTimeout(() => {
    document.getElementById('tours').scrollIntoView({ behavior: 'smooth' });
  }, 1200);
});

// Enter key on search
document.getElementById('searchDestination').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('searchBtn').click();
});

// ============================================================
// TOUR FILTERS
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const tourCards = document.querySelectorAll('.tour-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    tourCards.forEach((card, i) => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
        card.style.opacity = '1';
        card.style.animation = `fadeInUp 0.4s ease ${i * 0.08}s both`;
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ============================================================
// WISHLIST TOGGLE
// ============================================================
document.querySelectorAll('.tour-wishlist').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    const msg = btn.classList.contains('active')
      ? '❤ Added to wishlist!'
      : '💔 Removed from wishlist.';
    showToast(msg);
  });
});

// ============================================================
// TESTIMONIAL SLIDER
// ============================================================
(function initSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoInterval;

  // CRITICAL: explicitly set to slide 0 immediately
  track.style.transition = 'none';
  track.style.transform = 'translateX(0%)';
  // Make all cards fully visible (no opacity 0 from observer)
  cards.forEach(card => {
    card.style.opacity = '1';
    card.style.animation = 'none';
  });

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  document.getElementById('prevBtn').addEventListener('click', () => {
    goTo(current - 1);
    resetAuto();
  });
  document.getElementById('nextBtn').addEventListener('click', () => {
    goTo(current + 1);
    resetAuto();
  });

  function startAuto() {
    // Start autoplay after 5 seconds so user sees slide 1 first
    autoInterval = setInterval(() => goTo(current + 1), 5000);
  }
  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }
  // Delay first autoplay by 5 seconds
  setTimeout(startAuto, 5000);
})();

// ============================================================
// NEWSLETTER FORM
// ============================================================
function handleNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  showToast(`📩 Subscribed! Welcome to Caplin Holidays, ${email.split('@')[0]}!`);
  document.getElementById('newsletterForm').reset();
  return false;
}

// ============================================================
// CONTACT FORM
// ============================================================
function handleContact(e) {
  e.preventDefault();
  const btn = document.getElementById('submitContactBtn');
  const success = document.getElementById('formSuccess');
  btn.innerHTML = '<span>Sending...</span>';
  btn.style.opacity = '0.8';
  setTimeout(() => {
    btn.innerHTML = '<span>Send My Inquiry</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m22 2-7 20-4-9-9-4 20-7z"></path></svg>';
    btn.style.opacity = '1';
    success.classList.add('show');
    document.getElementById('contactForm').reset();
    setTimeout(() => success.classList.remove('show'), 6000);
  }, 1800);
  return false;
}

// ============================================================
// INTERSECTION OBSERVER — Scroll Animations
// ============================================================
// Scroll animation — exclude testimonial cards (slider handles their visibility)
const animateElements = document.querySelectorAll(
  '.dest-card, .tour-card, .feature-card, .contact-item, .footer-links-col'
);

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeInUp 0.6s ease ${i * 0.05}s both`;
      // After animation completes, lock in opacity so filters don't break
      setTimeout(() => { entry.target.style.opacity = '1'; }, 700);
      animObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

animateElements.forEach(el => {
  el.style.opacity = '0';
  animObserver.observe(el);
});

// ============================================================
// THREE.JS — HERO GLOBE (Top-right floating particles globe)
// ============================================================
(function initHeroGlobe() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.clientWidth || canvas.parentElement.clientWidth * 0.5;
  const H = canvas.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
  camera.position.set(0, 0, 2.8);

  // Earth sphere
  const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
  const sphereMat = new THREE.MeshPhongMaterial({
    color: 0x1a3a6b,
    emissive: 0x0a1a3b,
    specular: 0x2a7de1,
    shininess: 80,
    transparent: true,
    opacity: 0.85,
    wireframe: false,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere);

  // Wireframe overlay
  const wireGeo = new THREE.SphereGeometry(1.01, 24, 24);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x2a7de1,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  scene.add(new THREE.Mesh(wireGeo, wireMat));

  // Glowing atmosphere ring
  const ringGeo = new THREE.TorusGeometry(1.05, 0.015, 16, 120);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xe8581a, transparent: true, opacity: 0.5 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI * 0.25;
  scene.add(ring);

  // Gold dots (cities)
  const dotGeo = new THREE.SphereGeometry(0.022, 8, 8);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0xe8581a });
  const cityPositions = [
    [0, 1, 0], [0.7, 0.5, 0.5], [-0.5, 0.6, 0.6], [0.6, -0.3, 0.7],
    [-0.8, 0.2, 0.5], [0.3, 0.7, -0.7], [-0.4, -0.5, 0.7], [0.5, 0.5, -0.7],
    [0.9, 0.3, 0.3], [-0.3, 0.9, -0.3], [0.1, -0.8, 0.6], [-0.6, 0.1, -0.8],
  ];
  cityPositions.forEach(pos => {
    const v = new THREE.Vector3(...pos).normalize();
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.copy(v);
    scene.add(dot);
  });

  // Ambient + Directional Light
  scene.add(new THREE.AmbientLight(0x334466, 1.2));
  const dLight = new THREE.DirectionalLight(0xe8581a, 1.5);
  dLight.position.set(3, 2, 3);
  scene.add(dLight);
  const dLight2 = new THREE.DirectionalLight(0x1a4fa0, 0.8);
  dLight2.position.set(-3, -1, -3);
  scene.add(dLight2);

  // Stars particle field
  const starCount = 500;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 20;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.6 });
  scene.add(new THREE.Points(starGeo, starMat));

  let mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;
    sphere.rotation.y += 0.002;
    sphere.rotation.x += 0.0003;
    ring.rotation.z += 0.003;

    // Subtle mouse tracking
    sphere.rotation.y += mouse.x * 0.015;
    sphere.rotation.x += mouse.y * 0.01;

    // Pulse ring opacity
    ringMat.opacity = 0.4 + Math.sin(frame * 0.03) * 0.15;

    renderer.render(scene, camera);
  }
  animate();
})();

// ============================================================
// THREE.JS — INTERACTIVE GLOBE (Globe Section)
// ============================================================
(function initInteractiveGlobe() {
  const canvas = document.getElementById('globe3d');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.parentElement.clientWidth || 500;
  const H = W;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 2.5;

  // Main Globe
  const geoMain = new THREE.SphereGeometry(1, 80, 80);
  const matMain = new THREE.MeshPhongMaterial({
    color: 0x0d2255,
    emissive: 0x071128,
    specular: 0x4499ff,
    shininess: 120,
    transparent: true,
    opacity: 0.92,
  });
  const globeMesh = new THREE.Mesh(geoMain, matMain);
  scene.add(globeMesh);

  // Wireframe
  const geoWire = new THREE.SphereGeometry(1.005, 32, 32);
  const matWire = new THREE.MeshBasicMaterial({ color: 0x3366cc, wireframe: true, transparent: true, opacity: 0.18 });
  scene.add(new THREE.Mesh(geoWire, matWire));

  // Latitude/longitude grid lines
  for (let i = 0; i < 12; i++) {
    const lat = (i / 12) * Math.PI * 2;
    const latGeo = new THREE.TorusGeometry(1.003, 0.002, 8, 120, Math.PI * 2);
    const latMat = new THREE.MeshBasicMaterial({ color: 0x1a4488, transparent: true, opacity: 0.4 });
    const latMesh = new THREE.Mesh(latGeo, latMat);
    latMesh.rotation.x = lat;
    scene.add(latMesh);
  }

  // Gold location pins
  const pinGeo = new THREE.SphereGeometry(0.03, 8, 8);
  const pinMat = new THREE.MeshBasicMaterial({ color: 0xe8581a });
  const locations = [
    { lat: 8.3405, lng: 115.092 },   // Bali
    { lat: 48.8566, lng: 2.3522 },   // Paris
    { lat: 4.1755, lng: 73.5093 },   // Maldives
    { lat: 35.6762, lng: 139.6503 }, // Japan
    { lat: 46.8182, lng: 8.2275 },   // Switzerland
    { lat: 25.2048, lng: 55.2708 },  // Dubai
  ];

  locations.forEach(loc => {
    const phi = (90 - loc.lat) * (Math.PI / 180);
    const theta = (loc.lng + 180) * (Math.PI / 180);
    const x = -(1.04 * Math.sin(phi) * Math.cos(theta));
    const y = (1.04 * Math.cos(phi));
    const z = (1.04 * Math.sin(phi) * Math.sin(theta));

    const pin = new THREE.Mesh(pinGeo, pinMat.clone());
    pin.position.set(x, y, z);
    scene.add(pin);

    // Halo ring around pin
    const haloGeo = new THREE.TorusGeometry(0.04, 0.008, 8, 32);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xe8581a, transparent: true, opacity: 0.7 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(x, y, z);
    halo.lookAt(0, 0, 0);
    scene.add(halo);
  });

  // Atmosphere glow (second sphere)
  const atmGeo = new THREE.SphereGeometry(1.12, 32, 32);
  const atmMat = new THREE.MeshBasicMaterial({
    color: 0x2244aa,
    transparent: true,
    opacity: 0.07,
    side: THREE.FrontSide,
  });
  scene.add(new THREE.Mesh(atmGeo, atmMat));

  // Lights
  scene.add(new THREE.AmbientLight(0x224488, 1.0));
  const sunLight = new THREE.DirectionalLight(0xe8581a, 2.0);
  sunLight.position.set(4, 2, 3);
  scene.add(sunLight);
  const fillLight = new THREE.DirectionalLight(0x1a4fa0, 0.6);
  fillLight.position.set(-4, -2, -3);
  scene.add(fillLight);

  // Drag interaction
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let velocity = { x: 0, y: 0 };

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
  });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    velocity.x = dy * 0.005;
    velocity.y = dx * 0.005;
    prevMouse = { x: e.clientX, y: e.clientY };
  });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });
  canvas.addEventListener('touchend', () => { isDragging = false; });
  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - prevMouse.x;
    const dy = e.touches[0].clientY - prevMouse.y;
    velocity.x = dy * 0.005;
    velocity.y = dx * 0.005;
    prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    if (!isDragging) {
      velocity.x *= 0.95;
      velocity.y *= 0.95;
      globeMesh.rotation.y += 0.003 + velocity.y;
      globeMesh.rotation.x += velocity.x;
    } else {
      globeMesh.rotation.y += velocity.y;
      globeMesh.rotation.x += velocity.x;
    }

    // Pulse atmosphere
    atmMat.opacity = 0.07 + Math.sin(t) * 0.03;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = canvas.parentElement.clientWidth;
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    renderer.setSize(w, w);
  });
})();

// ============================================================
// THREE.JS — FLOATING PARTICLES (Features background)
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.parentElement.clientWidth || window.innerWidth;
  const H = canvas.parentElement.clientHeight || 600;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 100);
  camera.position.z = 5;

  const count = 300;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    velocities[i * 3] = (Math.random() - 0.5) * 0.008;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
    velocities[i * 3 + 2] = 0;
  }

  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(positions, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posAttr);

  const mat = new THREE.PointsMaterial({
    color: 0xe8581a,
    size: 0.06,
    transparent: true,
    opacity: 0.7,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  function animate() {
    requestAnimationFrame(animate);
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      if (positions[i * 3] > 10) positions[i * 3] = -10;
      if (positions[i * 3] < -10) positions[i * 3] = 10;
      if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = -10;
      if (positions[i * 3 + 1] < -10) positions[i * 3 + 1] = 10;
    }
    posAttr.needsUpdate = true;
    points.rotation.z += 0.0005;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();

// ============================================================
// DESTINATION CARD CLICK
// ============================================================
document.querySelectorAll('.dest-card').forEach(card => {
  card.addEventListener('click', () => {
    const dest = card.dataset.dest;
    if (dest) {
      showToast(`✈ Exploring ${dest}… Scroll to see tour packages!`);
      setTimeout(() => {
        document.getElementById('tours').scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    }
  });
});

// ============================================================
// FOOTER RIPPLE ANIMATION
// ============================================================
document.querySelectorAll('.social-link, .btn-primary, .btn-outline, .btn-nav').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;width:100px;height:100px;
      border-radius:50%;background:rgba(255,255,255,0.3);
      transform:translate(-50%,-50%) scale(0);
      animation:rippleAnim 0.6s ease-out;
      pointer-events:none;
      left:${e.offsetX}px;top:${e.offsetY}px;
    `;
    if (getComputedStyle(this).position === 'static') {
      this.style.position = 'relative';
    }
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `@keyframes rippleAnim { to { transform:translate(-50%,-50%) scale(3);opacity:0; } }`;
document.head.appendChild(style);

// ============================================================
// LAZY LOADING PLACEHOLDER
// ============================================================
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.style.transition = 'opacity 0.5s ease';
  img.style.opacity = '0';
  if (img.complete) {
    img.style.opacity = '1';
  } else {
    img.addEventListener('load', () => { img.style.opacity = '1'; });
  }
});

// ============================================================
// ON LOAD
// ============================================================
window.addEventListener('load', () => {
  // Start counter if hero visible
  const heroVis = heroSection && heroSection.getBoundingClientRect().top < window.innerHeight;
  if (heroVis && !countersStarted) {
    countersStarted = true;
    counters.forEach(animateCounter);
  }
});
