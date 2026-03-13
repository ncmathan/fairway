/* ============================================================
   FAIRWAY FIRST — Main JavaScript
   ============================================================ */

// ── Navbar scroll effect ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile hamburger ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── FAQ accordion ─────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer   = btn.nextElementSibling;
    const expanded = btn.getAttribute('aria-expanded') === 'true';

    // Close all others
    document.querySelectorAll('.faq-question').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.classList.remove('open');
      }
    });

    btn.setAttribute('aria-expanded', String(!expanded));
    answer.classList.toggle('open', !expanded);
  });
});

// ── Toast notification ────────────────────────────────────────
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

function showToast(message, duration = 4000) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Form validation helper ────────────────────────────────────
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const empty = !field.value.trim();
    const emailInvalid = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    if (empty || emailInvalid) {
      field.classList.add('error');
      valid = false;
    } else {
      field.classList.remove('error');
    }
  });
  return valid;
}

// Remove error class on input
document.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('error'));
});

// ── Join / Waitlist form ──────────────────────────────────────
const joinForm   = document.getElementById('joinForm');
const submitBtn  = document.getElementById('submitBtn');

joinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm(joinForm)) {
    showToast('Please fill in all required fields.', 3000);
    return;
  }

  // Simulate submission
  submitBtn.disabled = true;
  submitBtn.textContent = 'Reserving your spot…';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Reserve My Spot';
    joinForm.reset();
    showToast("You're in! We'll WhatsApp you within 48 hours to confirm your spot.", 5000);
  }, 1400);
});

// ── Contact form ──────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm(contactForm)) {
    showToast('Please fill in all required fields.', 3000);
    return;
  }

  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Send Message';
    contactForm.reset();
    showToast('Message sent! We\'ll get back to you soon.', 4000);
  }, 1200);
});

// ── Smooth scroll offset (account for sticky nav) ─────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Intersection Observer — fade-in on scroll ─────────────────
const observerOptions = {
  root: null,
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-in class to elements, then observe
const animatedEls = document.querySelectorAll(
  '.problem-card, .journey-step, .extra-card, .pricing-card, .testimonial-card, .loop-step, .faq-item'
);

animatedEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
  observer.observe(el);
});

// Inject visible class via JS
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// ── Pricing card hover highlight ─────────────────────────────
document.querySelectorAll('.pricing-card:not(.pricing-featured)').forEach(card => {
  card.addEventListener('mouseenter', () => {
    document.querySelectorAll('.pricing-card').forEach(c => c.style.opacity = '0.7');
    card.style.opacity = '1';
  });
  card.addEventListener('mouseleave', () => {
    document.querySelectorAll('.pricing-card').forEach(c => c.style.opacity = '1');
  });
});

// ── Cohort countdown (mock) ───────────────────────────────────
(function setCohortDate() {
  const launchDate = new Date('2026-04-07T09:00:00+08:00');
  const urgency = document.querySelector('.join-hl span + strong');
  if (!urgency) return;

  const now = new Date();
  const diff = launchDate - now;
  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const text = days === 0 ? 'Today!' : days === 1 ? 'Tomorrow' : `${days} days`;
  // update the first join highlight dynamically
  const hls = document.querySelectorAll('.join-hl');
  if (hls[0]) {
    hls[0].innerHTML = `<span>📅</span> Next cohort starts in <strong>${text}</strong>`;
  }
})();
