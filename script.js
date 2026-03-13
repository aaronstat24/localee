document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu toggle ---
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // --- Hero particles ---
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (4 + Math.random() * 8) + 's';
      p.style.animationDelay = Math.random() * 6 + 's';
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      p.style.opacity = 0.1 + Math.random() * 0.4;
      particlesContainer.appendChild(p);
    }
  }

  // --- Scroll-triggered animations (lightweight AOS replacement) ---
  const animateElements = document.querySelectorAll('[data-aos]');
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // --- Counter animation ---
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
          const current = eased * target;

          if (isDecimal) {
            el.textContent = current.toFixed(1);
          } else if (target >= 1000) {
            el.textContent = Math.floor(current).toLocaleString();
          } else {
            el.textContent = Math.floor(current);
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Earning bar animation ---
  const earningFill = document.querySelector('.earning-fill');
  if (earningFill) {
    const earningObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          earningFill.style.width = earningFill.style.width || '0%';
          setTimeout(() => { earningFill.style.width = '78%'; }, 300);
          earningObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    earningObserver.observe(earningFill);
  }

  // --- Active nav link highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
});
