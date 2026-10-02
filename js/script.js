/**
 * =============================================
 * Anniversary Website - Main JavaScript
 * =============================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Body loaded
  document.body.classList.add('loaded');

  // Initialize AOS
  AOS.init({
    once: true,
    duration: 800,
    easing: 'ease-out-cubic',
    offset: 80,
  });

  // =============================================
  // 1. PARTICLE STARS BACKGROUND
  // =============================================
  function createStars() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = window.innerWidth < 768 ? 60 : 120;

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
      star.style.setProperty('--delay', `${Math.random() * 3}s`);
      star.style.width = `${1 + Math.random() * 2}px`;
      star.style.height = star.style.width;
      container.appendChild(star);
    }
  }
  createStars();

  // =============================================
  // 2. FLOATING HEARTS
  // =============================================
  function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;
    const hearts = ['💕', '💗', '💖', '♥', '💞', '✨', '🌸'];
    const count = window.innerWidth < 768 ? 10 : 18;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.setProperty('--size', `${12 + Math.random() * 20}px`);
      heart.style.setProperty('--float-duration', `${6 + Math.random() * 8}s`);
      heart.style.setProperty('--float-delay', `${Math.random() * 10}s`);
      container.appendChild(heart);
    }
  }
  createFloatingHearts();

  // =============================================
  // 3. DAY COUNTER (sejak 5 Oktober 2025)
  // =============================================
  const startDate = new Date('2025-10-05T00:00:00');

  function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const daysEl = document.getElementById('counterDays');
    const hoursEl = document.getElementById('counterHours');
    const minutesEl = document.getElementById('counterMinutes');

    if (daysEl) animateNumber(daysEl, days);
    if (hoursEl) animateNumber(hoursEl, hours);
    if (minutesEl) animateNumber(minutesEl, minutes);
  }

  function animateNumber(element, target) {
    const current = parseInt(element.textContent) || 0;
    if (current === target) return;

    const diff = target - current;
    const steps = Math.min(Math.abs(diff), 30);
    const stepTime = 50;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      element.textContent = Math.round(current + diff * eased);
      if (step >= steps) {
        element.textContent = target;
        clearInterval(timer);
      }
    }, stepTime);
  }

  // Update counter every minute
  updateCounter();
  setInterval(updateCounter, 60000);

  // =============================================
  // 4. START BUTTON (Music + Scroll)
  // =============================================
  const startBtn = document.getElementById('startBtn');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const scrollIndicator = document.getElementById('scrollIndicator');
  let isMusicPlaying = false;

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // Try to play music
      if (bgMusic) {
        bgMusic.volume = 0;
        bgMusic.play().then(() => {
          isMusicPlaying = true;
          fadeInAudio(bgMusic, 0.5, 2000);
          musicToggle.style.display = 'flex';
          musicToggle.classList.add('playing');
          updateMusicIcon();
        }).catch((e) => {
          console.log('Audio play failed:', e);
          musicToggle.style.display = 'flex';
        });
      }

      // Smooth scroll to journey intro
      const target = document.querySelector('#timeline');
      if (target) {
        // Small delay for dramatic effect
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }

      // Show scroll indicator
      if (scrollIndicator) {
        scrollIndicator.style.display = 'flex';
        setTimeout(() => {
          scrollIndicator.style.opacity = '1';
        }, 100);
      }
    });
  }

  // =============================================
  // 5. MUSIC CONTROL
  // =============================================
  function fadeInAudio(audio, targetVol, duration) {
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = targetVol / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, targetVol);
      if (currentStep >= steps) {
        audio.volume = targetVol;
        clearInterval(timer);
      }
    }, stepTime);
  }

  function updateMusicIcon() {
    const iconPlaying = document.getElementById('iconPlaying');
    const iconMuted = document.getElementById('iconMuted');
    if (isMusicPlaying) {
      iconPlaying.classList.remove('hidden');
      iconMuted.classList.add('hidden');
    } else {
      iconPlaying.classList.add('hidden');
      iconMuted.classList.remove('hidden');
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (!bgMusic) return;

      if (isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
        musicToggle.classList.remove('playing');
      } else {
        bgMusic.play().then(() => {
          isMusicPlaying = true;
          musicToggle.classList.add('playing');
          if (bgMusic.volume === 0) {
            fadeInAudio(bgMusic, 0.5, 1000);
          }
        }).catch(console.log);
      }
      updateMusicIcon();
    });
  }

  // =============================================
  // 6. LIGHTBOX GALLERY
  // =============================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let galleryImages = [];
  let currentImageIndex = 0;

  function initGallery() {
    const items = document.querySelectorAll('.gallery-item');
    galleryImages = [];

    items.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img && img.src && img.style.display !== 'none') {
        galleryImages.push({ src: img.src, alt: img.alt });
      }

      item.addEventListener('click', () => {
        const imgEl = item.querySelector('img');
        if (imgEl && imgEl.style.display !== 'none') {
          currentImageIndex = index;
          openLightbox(imgEl.src, imgEl.alt);
        }
      });
    });
  }

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    if (galleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    const img = galleryImages[currentImageIndex];
    if (img && lightboxImg) {
      lightboxImg.style.transform = `scale(0.9) translateX(${direction > 0 ? '20px' : '-20px'})`;
      setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.transform = 'scale(1) translateX(0)';
      }, 200);
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Touch swipe for lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        navigateLightbox(diff > 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  // Initialize gallery
  initGallery();

  // Also init gallery for timeline photos (make them clickable)
  document.querySelectorAll('.photo-card').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img && img.style.display !== 'none') {
        openLightbox(img.src, img.alt);
      }
    });
  });

  // =============================================
  // 7. CONFETTI BURST (on anniversary section)
  // =============================================
  let confettiFired = false;

  function createConfetti() {
    if (confettiFired) return;
    confettiFired = true;

    const canvas = document.createElement('canvas');
    canvas.id = 'confettiCanvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#e11d48', '#ec4899', '#f9a8d4', '#fda4af', '#d4a574', '#f5d5a0', '#fff'];
    const shapes = ['circle', 'rect', 'heart'];

    for (let i = 0; i < 100; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        speedX: (Math.random() - 0.5) * 4,
        speedY: 2 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    function drawHeart(ctx, x, y, size) {
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.5, x, y + size);
      ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.5, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.fill();
    }

    let frame = 0;
    const maxFrames = 180;

    function animateConfetti() {
      if (frame >= maxFrames) {
        canvas.remove();
        return;
      }
      frame++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiPieces.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.speedY += 0.05; // gravity
        if (frame > maxFrames * 0.6) {
          p.opacity -= 0.02;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          drawHeart(ctx, 0, 0, p.size);
        }

        ctx.restore();
      });

      requestAnimationFrame(animateConfetti);
    }

    animateConfetti();
  }

  // Trigger confetti when anniversary section comes into view
  const anniversarySection = document.querySelector('[data-aos="zoom-in"]');
  if (anniversarySection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(createConfetti, 500);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(anniversarySection);
  }

  // =============================================
  // 8. SMOOTH SCROLL REVEAL
  // =============================================
  function handleScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 100;
      if (elementTop < windowHeight - elementVisible) {
        el.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScrollReveal, { passive: true });
  handleScrollReveal();

  // =============================================
  // 9. PARALLAX EFFECT ON HERO
  // =============================================
  function handleParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.getElementById('hero');
    if (hero && scrolled < window.innerHeight) {
      const particles = document.getElementById('particles');
      const hearts = document.getElementById('floatingHearts');
      if (particles) particles.style.transform = `translateY(${scrolled * 0.3}px)`;
      if (hearts) hearts.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // =============================================
  // 10. RESPONSIVE - Handle window resize
  // =============================================
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      AOS.refresh();
    }, 250);
  });

  // =============================================
  // 11. PRELOAD IMAGES (optional enhancement)
  // =============================================
  function preloadImages() {
    const images = document.querySelectorAll('img[src]');
    images.forEach((img) => {
      const preload = new Image();
      preload.src = img.src;
    });
  }
  preloadImages();

  console.log('💕 Happy Anniversary! Made with love 💕');
});
