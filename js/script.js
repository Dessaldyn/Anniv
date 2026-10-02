/**
 * =============================================
 * Anniversary Website — Click-Through Slideshow
 * =============================================
 * Flow:
 *   Hero → Click "Mulai" → Slideshow (tap/click to advance)
 *   → After last photo → Flying photos into envelope
 *   → Tap envelope → Love letter reveal
 * =============================================
 */

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');

  // =============================================
  // PHOTO LIST — only browser-supported formats
  // =============================================
  const PHOTOS = [
    'photos/26e64b23ac53b650d11164e18306c9cf_0.jpg',
    'photos/387f14a6-d15e-495d-9403-c3e3122e7ff8.png',
    'photos/IMG-20260403-WA0003.jpg',
    'photos/IMG-20260521-WA0005.jpg',
    'photos/FrameResult_0_2026_08_09__11_59_39.png',
    'photos/IMG-20260808-WA0001.jpg',
    'photos/c02fee81-c215-470f-8369-7d751fc64cf6.png',
    'photos/magicbooth-photo-1786258073752.png',
    'photos/magicbooth-photo-1786258079689.png',
    'photos/magicbooth-photo-1786258081503.png',
    'photos/de927dd6cedc61ea67f89f2b9b09e38c.png',
  ];

  // =============================================
  // ELEMENTS
  // =============================================
  const heroScene = document.getElementById('heroScene');
  const slideshowScene = document.getElementById('slideshowScene');
  const envelopeScene = document.getElementById('envelopeScene');
  const messageScene = document.getElementById('messageScene');
  const slideContainer = document.getElementById('slideContainer');
  const slideCounter = document.getElementById('slideCounter');
  const clickHint = document.getElementById('clickHint');
  const progressBar = document.getElementById('progressBar');
  const startBtn = document.getElementById('startBtn');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const envelopeSeal = document.getElementById('envelopeSeal');
  const messageContainer = document.getElementById('messageContainer');
  const confettiCanvas = document.getElementById('confettiCanvas');

  let currentSlide = -1;
  let isAnimating = false;
  let isMusicPlaying = false;
  let slideshowDone = false;

  // =============================================
  // 1. PARTICLE STARS
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
      const size = `${1 + Math.random() * 2}px`;
      star.style.width = size;
      star.style.height = size;
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
  // 3. DAY COUNTER
  // =============================================
  const startDate = new Date('2025-10-05T00:00:00');

  function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    animateNumber(document.getElementById('counterDays'), days);
    animateNumber(document.getElementById('counterHours'), hours);
    animateNumber(document.getElementById('counterMinutes'), minutes);
  }

  function animateNumber(el, target) {
    if (!el) return;
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;
    const diff = target - current;
    const steps = Math.min(Math.abs(diff), 30);
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      el.textContent = Math.round(current + diff * eased);
      if (step >= steps) { el.textContent = target; clearInterval(timer); }
    }, 50);
  }

  updateCounter();
  setInterval(updateCounter, 60000);

  // =============================================
  // 4. AUDIO HELPERS
  // =============================================
  function fadeInAudio(audio, targetVol, duration) {
    const steps = 20;
    const stepTime = duration / steps;
    const volStep = targetVol / steps;
    let cur = 0;
    const timer = setInterval(() => {
      cur++;
      audio.volume = Math.min(volStep * cur, targetVol);
      if (cur >= steps) { audio.volume = targetVol; clearInterval(timer); }
    }, stepTime);
  }

  function updateMusicIcon() {
    const iconPlaying = document.getElementById('iconPlaying');
    const iconMuted = document.getElementById('iconMuted');
    if (!iconPlaying || !iconMuted) return;
    iconPlaying.style.display = isMusicPlaying ? 'block' : 'none';
    iconMuted.style.display = isMusicPlaying ? 'none' : 'block';
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
          if (bgMusic.volume === 0) fadeInAudio(bgMusic, 0.5, 1000);
        }).catch(() => { });
      }
      updateMusicIcon();
    });
  }

  // =============================================
  // 5. SCENE MANAGEMENT
  // =============================================
  function switchScene(from, to, delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (from) from.classList.remove('active');
        if (to) to.classList.add('active');
        resolve();
      }, delay);
    });
  }

  // =============================================
  // 6. PRELOAD ALL PHOTOS
  // =============================================
  function preloadPhotos() {
    return Promise.all(PHOTOS.map(src => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      });
    }));
  }

  // =============================================
  // 7. SLIDESHOW — Random transition effects
  // =============================================

  // A pool of enter/exit transition classes
  const TRANSITIONS = [
    {
      name: 'fade-rotate',
      enterFrom: 'scale(0.85) rotate(-5deg)',
      enterTo: 'scale(1) rotate(0deg)',
      exitTo: 'scale(1.1) rotate(5deg)',
    },
    {
      name: 'slide-left',
      enterFrom: 'translateX(100%) scale(0.9)',
      enterTo: 'translateX(0) scale(1)',
      exitTo: 'translateX(-100%) scale(0.9)',
    },
    {
      name: 'slide-right',
      enterFrom: 'translateX(-100%) scale(0.9)',
      enterTo: 'translateX(0) scale(1)',
      exitTo: 'translateX(100%) scale(0.9)',
    },
    {
      name: 'zoom-in',
      enterFrom: 'scale(0.3)',
      enterTo: 'scale(1)',
      exitTo: 'scale(1.5)',
    },
    {
      name: 'slide-up',
      enterFrom: 'translateY(80%) scale(0.9)',
      enterTo: 'translateY(0) scale(1)',
      exitTo: 'translateY(-80%) scale(0.9)',
    },
    {
      name: 'flip',
      enterFrom: 'rotateY(90deg) scale(0.8)',
      enterTo: 'rotateY(0deg) scale(1)',
      exitTo: 'rotateY(-90deg) scale(0.8)',
    },
    {
      name: 'tilt-swing',
      enterFrom: 'rotate(-12deg) scale(0.7)',
      enterTo: 'rotate(0deg) scale(1)',
      exitTo: 'rotate(12deg) scale(0.7)',
    },
  ];

  function getRandomTransition() {
    return TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)];
  }

  function createSlidePhoto(src) {
    const img = document.createElement('img');
    img.className = 'slide-photo';
    img.src = src;
    img.alt = 'Kenangan kita';
    img.draggable = false;
    return img;
  }

  function showNextSlide() {
    if (isAnimating) return;
    if (slideshowDone) return;

    currentSlide++;

    // All photos done → fly into envelope
    if (currentSlide >= PHOTOS.length) {
      slideshowDone = true;
      startFlyingPhotosAnimation();
      return;
    }

    isAnimating = true;
    const transition = getRandomTransition();

    // Update counter
    if (slideCounter) {
      slideCounter.textContent = `${currentSlide + 1} / ${PHOTOS.length}`;
    }

    // Update progress bar
    if (progressBar) {
      const pct = ((currentSlide + 1) / PHOTOS.length) * 100;
      progressBar.style.width = `${pct}%`;
    }

    // Get current (old) photo
    const oldPhoto = slideContainer.querySelector('.slide-photo.active');

    // Create new photo
    const newPhoto = createSlidePhoto(PHOTOS[currentSlide]);
    newPhoto.style.opacity = '0';
    newPhoto.style.transform = transition.enterFrom;
    newPhoto.style.transition = 'none';
    slideContainer.appendChild(newPhoto);

    // Force reflow
    void newPhoto.offsetWidth;

    // Animate old photo out
    if (oldPhoto) {
      oldPhoto.classList.remove('active');
      oldPhoto.classList.add('exiting');
      oldPhoto.style.transform = transition.exitTo;
      oldPhoto.style.opacity = '0';
      // Remove old photo after animation
      setTimeout(() => { oldPhoto.remove(); }, 700);
    }

    // Animate new photo in
    requestAnimationFrame(() => {
      newPhoto.style.transition = 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)';
      newPhoto.style.opacity = '1';
      newPhoto.style.transform = transition.enterTo;
      newPhoto.classList.add('active');
    });

    // Add decorative sparkles
    createSparkles();

    // Done animating
    setTimeout(() => { isAnimating = false; }, 900);
  }

  function createSparkles() {
    if (!slideContainer) return;
    // Remove old sparkles
    slideContainer.querySelectorAll('.sparkle-dot').forEach(s => s.remove());

    const count = 6 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'sparkle-dot';
      const side = Math.floor(Math.random() * 4);
      switch (side) {
        case 0: dot.style.top = '-6px'; dot.style.left = `${20 + Math.random() * 60}%`; break;
        case 1: dot.style.bottom = '-6px'; dot.style.left = `${20 + Math.random() * 60}%`; break;
        case 2: dot.style.left = '-6px'; dot.style.top = `${20 + Math.random() * 60}%`; break;
        case 3: dot.style.right = '-6px'; dot.style.top = `${20 + Math.random() * 60}%`; break;
      }
      dot.style.animationDelay = `${Math.random() * 1.5}s`;
      slideContainer.appendChild(dot);
    }
  }

  // =============================================
  // 8. FLYING PHOTOS → ENVELOPE ANIMATION
  // =============================================
  // Flow: envelope appears OPEN → photos fly INTO it → flap CLOSES → clickable
  let envelopeReady = false; // true after flap is sealed

  function startFlyingPhotosAnimation() {
    // Hide slideshow UI
    if (clickHint) clickHint.classList.remove('visible');
    if (slideCounter) slideCounter.classList.remove('visible');

    // Fade out current photo
    const lastPhoto = slideContainer.querySelector('.slide-photo.active');
    if (lastPhoto) {
      lastPhoto.style.transition = 'all 0.6s ease';
      lastPhoto.style.opacity = '0';
      lastPhoto.style.transform = 'scale(0.8)';
    }

    // After fade out, show envelope scene
    setTimeout(() => {
      // Hide slideshow
      slideshowScene.classList.remove('active');

      // Show envelope scene
      envelopeScene.classList.add('active');

      // === STEP 1: Show envelope already OPEN ===
      // Hide seal initially (envelope is open, no seal yet)
      if (envelopeSeal) {
        envelopeSeal.style.opacity = '0';
        envelopeSeal.style.transform = 'translate(-50%, -50%) scale(0)';
      }

      // Start with flap OPEN
      if (envelopeFlap) {
        envelopeFlap.style.transition = 'none';
        envelopeFlap.classList.add('open');
      }

      // Show envelope with bounce animation
      envelopeWrapper.style.opacity = '0';
      envelopeWrapper.style.transform = 'scale(0.3)';
      envelopeWrapper.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
      // Disable clicking while photos are flying in
      envelopeWrapper.style.pointerEvents = 'none';

      // Hide the hint while photos fly in
      const envHint = envelopeWrapper.querySelector('.envelope-hint');
      if (envHint) {
        envHint.style.opacity = '0';
        envHint.textContent = 'Ketuk untuk membuka';
      }

      // Animate envelope appearing
      requestAnimationFrame(() => {
        envelopeWrapper.style.opacity = '1';
        envelopeWrapper.style.transform = 'scale(1)';
      });

      // === STEP 2: After envelope appears, fly photos into it ===
      setTimeout(() => {
        const flyingPhotos = [];
        const shuffled = [...PHOTOS].sort(() => Math.random() - 0.5);
        const photoCount = Math.min(shuffled.length, 10);

        for (let i = 0; i < photoCount; i++) {
          const img = document.createElement('img');
          img.className = 'flying-photo';
          img.src = shuffled[i];
          img.alt = '';
          img.draggable = false;

          // Random starting position around edges of screen
          const edge = Math.floor(Math.random() * 4);
          let startX, startY;
          switch (edge) {
            case 0: startX = Math.random() * window.innerWidth; startY = -120; break;
            case 1: startX = Math.random() * window.innerWidth; startY = window.innerHeight + 120; break;
            case 2: startX = -120; startY = Math.random() * window.innerHeight; break;
            case 3: startX = window.innerWidth + 120; startY = Math.random() * window.innerHeight; break;
          }

          img.style.left = `${startX}px`;
          img.style.top = `${startY}px`;
          img.style.transform = `rotate(${-30 + Math.random() * 60}deg)`;

          document.body.appendChild(img);
          flyingPhotos.push({
            el: img,
            delay: i * 250,
            rotation: -15 + Math.random() * 30,
          });
        }

        // Animate each photo: appear → float → fly into open envelope
        flyingPhotos.forEach((photo) => {
          const { el, delay, rotation } = photo;

          // Phase 1: Appear and float to a random mid-screen position
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            const midX = window.innerWidth * 0.1 + Math.random() * window.innerWidth * 0.8;
            const midY = window.innerHeight * 0.1 + Math.random() * window.innerHeight * 0.6;
            el.style.left = `${midX}px`;
            el.style.top = `${midY}px`;
            el.style.transform = `rotate(${rotation}deg) scale(1.1)`;
          }, delay);

          // Phase 2: Fly into the open envelope
          setTimeout(() => {
            const rect = envelopeWrapper.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 - 40;
            const cy = rect.top + rect.height / 2 - 20; // aim slightly above center (into opening)

            el.style.transition = 'all 0.7s cubic-bezier(0.55, 0.06, 0.68, 0.19)';
            el.style.left = `${cx}px`;
            el.style.top = `${cy}px`;
            el.style.transform = 'rotate(0deg) scale(0.1)';
            el.style.opacity = '0.5';
          }, delay + 1600);

          // Phase 3: Disappear (absorbed into envelope)
          setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
          }, delay + 2300);
        });

        // === STEP 3: After ALL photos are inside, CLOSE the envelope ===
        const allPhotosDone = photoCount * 250 + 2800;

        setTimeout(() => {
          // Small shake to indicate "envelope is now full"
          envelopeWrapper.style.transition = 'transform 0.15s ease';
          envelopeWrapper.style.transform = 'scale(1) rotate(-2deg)';
          setTimeout(() => {
            envelopeWrapper.style.transform = 'scale(1) rotate(2deg)';
          }, 150);
          setTimeout(() => {
            envelopeWrapper.style.transform = 'scale(1) rotate(-1deg)';
          }, 300);
          setTimeout(() => {
            envelopeWrapper.style.transform = 'scale(1) rotate(0deg)';
          }, 450);

          // Close the flap with a smooth animation
          setTimeout(() => {
            if (envelopeFlap) {
              envelopeFlap.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
              envelopeFlap.classList.remove('open');
            }
          }, 600);

          // After flap closes, show the seal with a pop animation
          setTimeout(() => {
            if (envelopeSeal) {
              envelopeSeal.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
              envelopeSeal.style.opacity = '1';
              envelopeSeal.style.transform = 'translate(-50%, -50%) scale(1)';
            }

            // Small bounce on the whole envelope to emphasize "sealed!"
            envelopeWrapper.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            envelopeWrapper.style.transform = 'scale(1.08)';
            setTimeout(() => {
              envelopeWrapper.style.transform = 'scale(1)';
            }, 400);
          }, 1500);

          // === STEP 4: Envelope is sealed — now allow clicking ===
          setTimeout(() => {
            envelopeReady = true;
            envelopeWrapper.style.pointerEvents = 'auto';

            // Show the hint text
            if (envHint) {
              envHint.style.transition = 'opacity 0.6s ease';
              envHint.style.opacity = '1';
            }

            // Update progress bar to 100%
            if (progressBar) progressBar.style.width = '100%';
          }, 2200);

        }, allPhotosDone);

      }, 1200); // wait for envelope to finish appearing

    }, 800); // wait for last slideshow photo to fade
  }

  // =============================================
  // 9. ENVELOPE CLICK → OPEN & REVEAL LETTER
  // =============================================
  let envelopeOpened = false;

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', () => {
      // Only allow click after envelope is sealed
      if (!envelopeReady) return;
      if (envelopeOpened) return;
      envelopeOpened = true;

      // Re-open flap (this time to reveal the letter)
      if (envelopeFlap) {
        envelopeFlap.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        envelopeFlap.classList.add('open');
      }

      // Hide seal with pop-out
      if (envelopeSeal) {
        setTimeout(() => {
          envelopeSeal.style.transition = 'all 0.4s cubic-bezier(0.55, 0.06, 0.68, 0.19)';
          envelopeSeal.style.opacity = '0';
          envelopeSeal.style.transform = 'translate(-50%, -50%) scale(0)';
        }, 200);
      }

      // Heart burst effect
      createHeartBurst();

      // Letter "rises" out of envelope before scene switch
      setTimeout(() => {
        // Animate envelope moving down and fading
        envelopeWrapper.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        envelopeWrapper.style.transform = 'scale(0.7) translateY(60px)';
        envelopeWrapper.style.opacity = '0.3';
      }, 800);

      // Transition to message scene
      setTimeout(() => {
        switchScene(envelopeScene, messageScene).then(() => {
          if (messageContainer) {
            setTimeout(() => messageContainer.classList.add('visible'), 200);
          }
          // Fire confetti
          setTimeout(createConfetti, 600);
          // Start fairy sparkle particles
          setTimeout(createFairySparkles, 300);
        });
      }, 1500);
    });
  }

  // =============================================
  // 9b. FAIRY SPARKLE PARTICLES (message scene)
  // =============================================
  let fairySparklesActive = false;

  function createFairySparkles() {
    if (fairySparklesActive) return;
    fairySparklesActive = true;

    const container = document.getElementById('fairySparkles');
    if (!container) return;

    // Continuously spawn sparkle particles
    function spawnSparkle() {
      if (!messageScene.classList.contains('active')) return;

      const sparkle = document.createElement('div');
      sparkle.className = 'fairy-sparkle';

      // Random properties
      const size = 3 + Math.random() * 6;
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const duration = 3 + Math.random() * 4;
      const delay = Math.random() * 0.5;

      // Random drift direction
      const driftX = -30 + Math.random() * 60;
      const driftY = -40 - Math.random() * 60;

      // Random color from palette
      const colors = [
        'rgba(249, 168, 212, 0.8)',   // pink
        'rgba(253, 164, 175, 0.7)',   // rose
        'rgba(245, 213, 160, 0.8)',   // gold
        'rgba(255, 255, 255, 0.6)',   // white
        'rgba(196, 181, 253, 0.6)',   // purple
        'rgba(252, 205, 211, 0.7)',   // soft pink
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      sparkle.style.cssText = `
        position: absolute;
        left: ${startX}%;
        top: ${startY}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color};
        animation: fairyFloat ${duration}s ease-in-out ${delay}s forwards;
        --drift-x: ${driftX}px;
        --drift-y: ${driftY}px;
      `;

      container.appendChild(sparkle);

      // Remove after animation completes
      setTimeout(() => {
        sparkle.remove();
      }, (duration + delay) * 1000);
    }

    // Spawn sparkles at intervals
    function sparkleLoop() {
      if (!messageScene.classList.contains('active')) return;

      // Spawn a burst of 2-4 sparkles
      const burst = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < burst; i++) {
        setTimeout(spawnSparkle, i * 100);
      }

      // Schedule next burst
      const nextDelay = 200 + Math.random() * 400;
      setTimeout(sparkleLoop, nextDelay);
    }

    // Also add some persistent "wand trail" sparkles that orbit gently
    function createOrbitSparkle() {
      if (!messageScene.classList.contains('active')) return;

      const sparkle = document.createElement('div');
      sparkle.className = 'fairy-orbit';

      const size = 2 + Math.random() * 3;
      const orbitRadius = 30 + Math.random() * 50;
      const duration = 4 + Math.random() * 3;
      const centerX = 20 + Math.random() * 60;
      const centerY = 20 + Math.random() * 60;

      const colors = [
        'rgba(249, 168, 212, 0.5)',
        'rgba(245, 213, 160, 0.5)',
        'rgba(255, 255, 255, 0.4)',
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      sparkle.style.cssText = `
        position: absolute;
        left: ${centerX}%;
        top: ${centerY}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        box-shadow: 0 0 ${size * 3}px ${color};
        animation: fairyOrbit ${duration}s linear infinite;
        --orbit-r: ${orbitRadius}px;
      `;

      container.appendChild(sparkle);

      // Remove after some time and recreate
      setTimeout(() => {
        sparkle.remove();
        if (messageScene.classList.contains('active')) {
          createOrbitSparkle();
        }
      }, duration * 3 * 1000);
    }

    // Start the effects
    sparkleLoop();

    // Create a few orbit sparkles
    for (let i = 0; i < 8; i++) {
      setTimeout(createOrbitSparkle, i * 500);
    }
  }

  function createHeartBurst() {
    const hearts = ['💕', '💗', '💖', '❤️', '💞', '✨'];
    for (let i = 0; i < 12; i++) {
      const h = document.createElement('span');
      h.className = 'heart-burst';
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      h.style.left = '50%';
      h.style.top = '45%';
      const angle = (i / 12) * Math.PI * 2;
      const dist = 80 + Math.random() * 60;
      h.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
      h.style.setProperty('--by', `${Math.sin(angle) * dist}px`);
      h.style.setProperty('--br', `${Math.random() * 360}deg`);
      envelopeWrapper.appendChild(h);
      setTimeout(() => h.remove(), 1500);
    }
  }

  // =============================================
  // 10. CONFETTI
  // =============================================
  function createConfetti() {
    const canvas = confettiCanvas || document.createElement('canvas');
    if (!confettiCanvas) {
      canvas.id = 'confettiCanvas';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.pointerEvents = 'none';

    const pieces = [];
    const colors = ['#e11d48', '#ec4899', '#f9a8d4', '#fda4af', '#d4a574', '#f5d5a0', '#fff'];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 300,
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: ['circle', 'rect', 'heart'][Math.floor(Math.random() * 3)],
        speedX: (Math.random() - 0.5) * 4,
        speedY: 2 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    function drawHeart(ctx, x, y, size) {
      ctx.beginPath();
      const h = size * 0.3;
      ctx.moveTo(x, y + h);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + h);
      ctx.bezierCurveTo(x - size / 2, y + (size + h) / 2, x, y + (size + h) / 1.5, x, y + size);
      ctx.bezierCurveTo(x, y + (size + h) / 1.5, x + size / 2, y + (size + h) / 2, x + size / 2, y + h);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + h);
      ctx.fill();
    }

    let frame = 0;
    const max = 200;

    function animate() {
      if (frame >= max) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.speedY += 0.04;
        if (frame > max * 0.6) p.opacity -= 0.015;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
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

      requestAnimationFrame(animate);
    }
    animate();
  }

  // =============================================
  // 11. START BUTTON — Kick off flow
  // =============================================
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // Play music
      if (bgMusic) {
        bgMusic.volume = 0;
        bgMusic.play().then(() => {
          isMusicPlaying = true;
          fadeInAudio(bgMusic, 0.5, 2000);
          if (musicToggle) {
            musicToggle.style.display = 'flex';
            musicToggle.classList.add('playing');
          }
          updateMusicIcon();
        }).catch(() => {
          if (musicToggle) musicToggle.style.display = 'flex';
        });
      }

      // Preload photos then switch to slideshow
      preloadPhotos().then(() => {
        switchScene(heroScene, slideshowScene).then(() => {
          // Show counter & hint
          setTimeout(() => {
            if (slideCounter) slideCounter.classList.add('visible');
            if (clickHint) clickHint.classList.add('visible');
          }, 400);

          // Show first photo
          setTimeout(() => showNextSlide(), 600);
        });
      });
    });
  }

  // =============================================
  // 12. CLICK / TAP TO ADVANCE SLIDESHOW
  // =============================================
  if (slideshowScene) {
    slideshowScene.addEventListener('click', (e) => {
      // Don't interfere with music toggle
      if (e.target.closest('.music-toggle')) return;
      showNextSlide();
    });
  }

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!slideshowScene.classList.contains('active')) return;
    if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') {
      e.preventDefault();
      showNextSlide();
    }
  });

  // =============================================
  // 13. TOUCH SWIPE SUPPORT FOR SLIDESHOW
  // =============================================
  let touchStartX = 0;
  let touchStartY = 0;

  if (slideshowScene) {
    slideshowScene.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    slideshowScene.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      // Only advance on tap (small movement) or swipe left
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
        // It's a tap — handled by click event
        return;
      }
      if (dx < -50) {
        showNextSlide();
      }
    }, { passive: true });
  }

  console.log('💕 Happy Anniversary! Made with love 💕');
});
