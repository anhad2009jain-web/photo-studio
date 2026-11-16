document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  mobileMenu.hidden = true;
}

menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  mobileMenu.hidden = !opening;
});

mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) {
    closeMenu();
    menuButton.focus();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px' });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const heroImage = document.querySelector('.hero-image');
let ticking = false;
function updateParallax() {
  if (!reduceMotion && window.scrollY < window.innerHeight) {
    heroImage.style.transform = `translate3d(0, ${window.scrollY * 0.14}px, 0)`;
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const end = Number(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    if (reduceMotion) {
      element.textContent = `${end}${suffix}`;
    } else {
      const startTime = performance.now();
      const duration = 1100;
      const draw = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = end * (1 - Math.pow(1 - progress, 3));
        element.textContent = `${element.dataset.decimal ? value.toFixed(1) : Math.round(value)}${suffix}`;
        if (progress < 1) requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    }
    counterObserver.unobserve(element);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(counter => counterObserver.observe(counter));

const testimonials = [...document.querySelectorAll('.testimonial')];
const dots = [...document.querySelectorAll('.slider-dots button')];
let currentReview = 0;
function showReview(index) {
  currentReview = (index + testimonials.length) % testimonials.length;
  testimonials.forEach((review, i) => review.classList.toggle('active', i === currentReview));
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentReview);
    dot.setAttribute('aria-pressed', String(i === currentReview));
  });
}
document.querySelector('.slider-arrow.prev').addEventListener('click', () => showReview(currentReview - 1));
document.querySelector('.slider-arrow.next').addEventListener('click', () => showReview(currentReview + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => showReview(index)));

const galleryItems = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
let currentImage = 0;
function showImage(index) {
  currentImage = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentImage];
  lightboxImage.src = item.dataset.image;
  lightboxImage.alt = item.querySelector('img').alt;
  lightboxCaption.textContent = item.dataset.caption;
}
galleryItems.forEach((item, index) => item.addEventListener('click', () => {
  showImage(index);
  lightbox.showModal();
}));
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentImage - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentImage + 1));
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') showImage(currentImage - 1);
  if (event.key === 'ArrowRight') showImage(currentImage + 1);
});
