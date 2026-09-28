/* ==========================================================================
   A SMARTER TOMORROW - Main Application Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. NAVIGATION SCROLL & ACTIVE SPY & BACK TO TOP
  // ------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  backToTopBtn?.addEventListener('click', () => {
    if (window.soundFX) window.soundFX.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // ------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (window.soundFX) window.soundFX.playSwitch();
    mobileDrawer?.classList.add('open');
    mobileBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (window.soundFX) window.soundFX.playClick();
    mobileDrawer?.classList.remove('open');
    mobileBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileToggleBtn?.addEventListener('click', openMobileMenu);
  mobileCloseBtn?.addEventListener('click', closeMobileMenu);
  mobileBackdrop?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ------------------------------------------------------------------------
  // 3. THEME SWITCHER
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themes = ['cyber', 'solar', 'matrix'];
  let currentThemeIdx = 0;

  const savedTheme = localStorage.getItem('site_theme');
  if (savedTheme && themes.includes(savedTheme)) {
    currentThemeIdx = themes.indexOf(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playSwitch();
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      const nextTheme = themes[currentThemeIdx];
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('site_theme', nextTheme);
      showToast(`Theme switched to ${nextTheme.toUpperCase()} Mode`);
    });
  }

  // ------------------------------------------------------------------------
  // 4. SOUND TOGGLE
  // ------------------------------------------------------------------------
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  function updateSoundUI() {
    if (!soundIcon) return;
    if (window.soundFX && window.soundFX.muted) {
      soundIcon.className = 'fa-solid fa-volume-xmark';
      soundToggleBtn?.classList.add('muted');
    } else {
      soundIcon.className = 'fa-solid fa-volume-high';
      soundToggleBtn?.classList.remove('muted');
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (window.soundFX) {
        const isMuted = window.soundFX.toggleMute();
        if (!isMuted) {
          window.soundFX.playSuccess();
          showToast('Audio Synthesis Activated');
        } else {
          showToast('Audio Synthesis Muted');
        }
        updateSoundUI();
      }
    });
    updateSoundUI();
  }

  // ------------------------------------------------------------------------
  // 5. PILLAR TABS CONTROLLER
  // ------------------------------------------------------------------------
  const pillarTabBtns = document.querySelectorAll('.pillar-tab-btn');
  const pillarPanels = document.querySelectorAll('.pillar-panel');

  pillarTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playSwitch();
      const target = btn.dataset.target;

      pillarTabBtns.forEach(b => b.classList.remove('active'));
      pillarPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(target);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // ------------------------------------------------------------------------
  // 6. GALLERY LIGHTBOX MODAL
  // ------------------------------------------------------------------------
  const modalOverlay = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalCloseBtn = document.getElementById('modal-close');
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playClick();
      const imgPath = card.dataset.image;
      const title = card.dataset.title;
      const desc = card.dataset.desc;

      if (modalImg) modalImg.src = imgPath;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;

      modalOverlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    if (window.soundFX) window.soundFX.playClick();
    modalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtn?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
      closeModal();
    }
  });

  // ------------------------------------------------------------------------
  // 7. DYNAMIC RANGE SLIDERS PROGRESS FILL
  // ------------------------------------------------------------------------
  function updateSliderFill(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--range-progress', `${pct}%`);
  }

  document.querySelectorAll('.custom-range').forEach(slider => {
    updateSliderFill(slider);
    slider.addEventListener('input', () => updateSliderFill(slider));
  });

  // ------------------------------------------------------------------------
  // 8. 3D TILT EFFECT ON CARDS
  // ------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.tilt-card, .hero-poster-frame, .blueprint-detail-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
  });

  // ------------------------------------------------------------------------
  // 9. REVEAL ON SCROLL OBSERVER
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.section-header, .pillar-visual-card, .pillar-content-box, .calculator-card, .gallery-card, .loop-node-item');
  revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));

  // ------------------------------------------------------------------------
  // 10. CIVIC TOAST NOTIFICATIONS
  // ------------------------------------------------------------------------
  const toast = document.getElementById('civic-toast');
  const toastText = document.getElementById('toast-text');
  let toastTimeout;

  function showToast(msg) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.add('active');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  }

  window.showToast = showToast;
});
