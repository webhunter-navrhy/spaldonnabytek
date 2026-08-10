// ===== WEBP SUPPORT & HERO IMAGE UPGRADE =====
(function() {
  var webp = new Image();
  webp.onload = webp.onerror = function() {
    var supportsWebP = webp.height === 1;
    if (supportsWebP) {
      document.querySelectorAll('.hero-bg, .cta-bg, .service-card-bg').forEach(function(el) {
        var bg = el.style.backgroundImage;
        if (bg) el.style.backgroundImage = bg.replace(/\.jpg/g, '.webp');
      });
    }
  };
  webp.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
})();

// ===== SCROLL PROGRESS BAR =====
(function() {
  function updateScrollProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var progress = docHeight > 0 ? scrollTop / docHeight : 0;
    document.documentElement.style.setProperty('--scroll-progress', progress.toString());
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();
})();

// ===== HEADER SCROLL =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAVIGATION =====
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== AUDIO PLAYER =====
document.querySelectorAll('.audio-player').forEach(player => {
  const audioSrc = player.dataset.audio;
  const audio = new Audio(audioSrc);
  const progressBar = player.querySelector('.audio-progress-bar');

  player.addEventListener('click', () => {
    // Pause all other players
    document.querySelectorAll('.audio-player').forEach(other => {
      if (other !== player && other.classList.contains('playing')) {
        other.classList.remove('playing');
        other._audio?.pause();
        other._audio && (other._audio.currentTime = 0);
      }
    });

    player._audio = audio;

    if (audio.paused) {
      audio.play();
      player.classList.add('playing');
    } else {
      audio.pause();
      player.classList.remove('playing');
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (progressBar && audio.duration) {
      progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
    }
  });

  audio.addEventListener('ended', () => {
    player.classList.remove('playing');
    if (progressBar) progressBar.style.width = '0%';
  });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
  observer.observe(el);
});

// ===== ANIMATED COUNTER FOR STATS =====
(function() {
  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var counters = entry.target.querySelectorAll('.counter');
        counters.forEach(function(counter) {
          var target = parseInt(counter.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          var duration = 2000; // 2 seconds
          var startTime = null;
          var startValue = 0;

          function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
          }

          function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easeOutQuart(progress);
            var currentValue = Math.round(startValue + (target - startValue) * easedProgress);
            counter.textContent = currentValue;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              counter.textContent = target;
            }
          }

          requestAnimationFrame(animate);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  var statsSection = document.querySelector('.stats');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }
})();

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightboxClose?.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ===== GALLERY FILTERING =====
const filterBtns = document.querySelectorAll('.gallery-cat-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.category;

    galleryItems.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = '';
        setTimeout(() => item.style.opacity = '1', 10);
      } else {
        item.style.opacity = '0';
        setTimeout(() => item.style.display = 'none', 300);
      }
    });
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');

    const mailtoBody = `Jmeno: ${name}%0D%0AEmail: ${email}%0D%0ATelefon: ${phone}%0D%0ASluzba: ${service}%0D%0A%0D%0A${message}`;
    window.location.href = `mailto:info@spaldon-nabytek.cz?subject=Poptavka z webu - ${name}&body=${mailtoBody}`;
  });
}
