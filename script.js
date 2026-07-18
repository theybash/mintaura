// =============================================
// LENIS — smooth scroll for the entire page
// =============================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


// =============================================
// HERO — entrance animation
// =============================================
gsap.set('.hero-content-full', { opacity: 0, y: 30 });
gsap.to('.hero-content-full', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 });


// =============================================
// COMBINED HERO ZOOM + VIDEO SCRUB
// One pinned section, one long timeline
// =============================================
(function () {
  if (window.innerWidth <= 768) return;
  const video = document.getElementById('scrollVideo');
  if (!video) return;

  let duration = 0;
  let ready = false;

  function floorDecimal(val) {
    return Math.floor(100 * Number(val).toFixed(3)) / 100;
  }

  function onReady() {
    duration = video.duration;
    video.play().then(function () {
      video.pause();
      ready = true;
      buildTimeline();
    }).catch(function () {
      video.pause();
      ready = true;
      buildTimeline();
    });
  }

  video.addEventListener('durationchange', onReady);
  if (video.duration) onReady();

  function buildTimeline() {
    var scrubObj = { progress: 0 };
    var textEls = document.querySelectorAll('.sv-text');

    // Total scroll: 500vh (hero zoom ~1.5vh worth, video scrub ~3.5vh worth)
    var navEl = document.getElementById('navbar');

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-video-section',
        start: 'top top',
        end: '+=500%',
        scrub: 1,
        pin: '.hero-video-pin',
        anticipatePin: 1,
        onUpdate: function (self) {
          var p = self.progress;
          if (p > 0.10 && p < 0.96) {
            navEl.classList.add('over-video');
          } else {
            navEl.classList.remove('over-video');
          }
        }
      }
    });

    // Phase 1: Hero zoom-through (0% - 20% of timeline)
    tl.to('.hero-scroll-indicator', { opacity: 0, duration: 0.02 }, 0)
      .to('.hero-title', {
        scale: 5, opacity: 0, transformOrigin: '50% 50%',
        duration: 0.15, ease: 'power1.in'
      }, 0.01)
      .to('.hero-subtitle', {
        scale: 3, opacity: 0, transformOrigin: '50% 50%',
        duration: 0.12, ease: 'power1.in'
      }, 0.02)
      .to('.hero-tag', {
        scale: 2, opacity: 0, duration: 0.1, ease: 'power1.in'
      }, 0.01)
      .to('.hero-actions', {
        scale: 2, opacity: 0, duration: 0.1, ease: 'power1.in'
      }, 0.03)
      .to('.hero-stats', {
        scale: 2, opacity: 0, duration: 0.08, ease: 'power1.in'
      }, 0.03)
      .to('.hv-hero-bg', {
        opacity: 0, duration: 0.08, ease: 'power2.in'
      }, 0.10)
      .to('.hero-bg-pattern', {
        opacity: 0, duration: 0.06, ease: 'power2.in'
      }, 0.10);

    // Phase 2: Video scrub (20% - 95% of timeline)
    tl.to(scrubObj, {
      progress: 1,
      duration: 0.75,
      ease: 'none',
      onUpdate: function () {
        if (ready) {
          video.currentTime = floorDecimal(duration * scrubObj.progress);
        }
      }
    }, 0.20);

    // Text overlays during video scrub phase
    // Map to the 0.20 - 0.95 range
    tl.to(textEls[0], { opacity: 1, duration: 0.04 }, 0.22)
      .to(textEls[0], { opacity: 0, duration: 0.04 }, 0.36)
      .to(textEls[1], { opacity: 1, duration: 0.04 }, 0.42)
      .to(textEls[1], { opacity: 0, duration: 0.04 }, 0.58)
      .to(textEls[2], { opacity: 1, duration: 0.04 }, 0.65)
      .to(textEls[2], { opacity: 0, duration: 0.04 }, 0.85);
  }
})();


// =============================================
// NAVBAR
// =============================================
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
  start: 20,
  onUpdate: (self) => {
    navbar.classList.toggle('scrolled', self.scroll() > 20);
  }
});


const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);


// =============================================
// FAQ accordion
// =============================================
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});


// =============================================
// Scroll reveal for other sections (GSAP-powered)
// =============================================
gsap.utils.toArray(
  '.section-header, .about-image, .about-content, .product-card, ' +
  '.dispenser-content, .dispenser-image, .step-card, .testimonial-card, ' +
  '.faq-header-side, .faq-list, .contact-info, .contact-form-wrapper'
).forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      once: true,
    }
  });
});


// =============================================
// Contact form — sends via Formspree
// =============================================
const contactFormEl = document.getElementById('contactForm');
if (contactFormEl) contactFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' },
  }).then(response => {
    if (response.ok) {
      btn.textContent = 'Message Sent!';
      btn.style.background = '#2d7a3a';
      form.reset();
    } else {
      btn.textContent = 'Failed — Try Again';
      btn.style.background = '#c0392b';
    }
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
    }, 3000);
  }).catch(() => {
    btn.textContent = 'Failed — Try Again';
    btn.style.background = '#c0392b';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
    }, 3000);
  });
});
