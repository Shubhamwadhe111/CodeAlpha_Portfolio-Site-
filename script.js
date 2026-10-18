/**
 * Shubham Wadhe Portfolio - Interactive JavaScript Engine
 * Features:
 *  - Right-side Curved Arc Navbar with Real-time Scroll Animation & Active Node Tracking
 *  - Typewriter dynamic role cycling
 *  - Subtle Ambient Cursor
 *  - Subtle 3D Card Tilt
 *  - Project filtering
 *  - Interactive Resume Modal & PDF print trigger
 *  - Contact Form validation & mailto dispatch
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Typewriter Effect
  initTypewriter();

  // 3. Subtle Cursor Ambient
  initCursorGlow();

  // 4. Subtle 3D Card Tilt
  init3DTilt();

  // 5. Project Filters
  initProjectFilters();

  // 6. Right-Side Curved Arc Navbar & Scroll Animation
  initCurvedArcNavbar();

  // 7. Mobile Drawer Navigation
  initMobileDrawer();

  // 8. Resume Modal Controls
  initResumeModal();

  // 9. Contact Form
  initContactForm();

  // 10. Current Year
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
});

/* ==========================================================================
   TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const elem = document.getElementById('typewriter');
  if (!elem) return;

  const roles = [
    'Artificial Intelligence & Data Science',
    'Machine Learning Engineering',
    'Modern Web Application Development',
    'Data-Driven Problem Solving'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      elem.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      elem.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   CURSOR AMBIENT FOLLOWER
   ========================================================================== */
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow) return;

  if (window.matchMedia('(pointer: coarse)').matches) {
    cursorGlow.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;

    requestAnimationFrame(updateCursor);
  }

  updateCursor();
}

/* ==========================================================================
   SUBTLE 3D CARD TILT
   ========================================================================== */
function init3DTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.15s ease-out';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease-out';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease-out';
    });
  });
}

/* ==========================================================================
   RIGHT-SIDE CURVED ARC NAVBAR WITH SCROLLING ANIMATION
   ========================================================================== */
function initCurvedArcNavbar() {
  const arcProgressPath = document.getElementById('arcProgressPath');
  const scrollPercentText = document.getElementById('scrollPercentText');
  const arcItems = document.querySelectorAll('.arc-item');
  const sections = document.querySelectorAll('section[id]');

  let pathLength = 600;
  if (arcProgressPath && arcProgressPath.getTotalLength) {
    pathLength = arcProgressPath.getTotalLength();
    arcProgressPath.style.strokeDasharray = pathLength;
    arcProgressPath.style.strokeDashoffset = pathLength;
  }

  function onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const scrollProgress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

    // 1. Animate the SVG curved progress track
    if (arcProgressPath) {
      const offset = pathLength * (1 - scrollProgress);
      arcProgressPath.style.strokeDashoffset = offset;
    }

    // 2. Update percentage indicator
    if (scrollPercentText) {
      scrollPercentText.textContent = `${Math.round(scrollProgress * 100)}%`;
    }

    // 3. Detect current section in viewport
    let currentId = 'hero';
    const offsetThreshold = window.innerHeight * 0.35;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollTop + offsetThreshold >= top && scrollTop + offsetThreshold < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    // Handle end of page -> select last section (contact)
    if (scrollProgress > 0.96) {
      currentId = 'contact';
    }

    // 4. Update active state on arc nodes
    arcItems.forEach((item) => {
      const sectionName = item.getAttribute('data-section');
      if (sectionName === currentId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial state

  // Smooth scroll on clicking arc nodes
  arcItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.m-link');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
  }

  function closeDrawer() {
    drawer.classList.remove('active');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* ==========================================================================
   PROJECT FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterTabs.length || !projectCards.length) return;

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.98)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   RESUME MODAL CONTROLS
   ========================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resumeModal');
  const openModalBtn = document.getElementById('openResumeModal');
  const heroResumeBtn = document.getElementById('heroResumeBtn');
  const previewTriggerCard = document.getElementById('previewTriggerCard');
  const closeModalBtn = document.getElementById('closeResumeModal');
  const printResumeBtn = document.getElementById('printResumeBtn');
  const modalPrintBtn = document.getElementById('modalPrintBtn');

  if (!resumeModal) return;

  function openModal() {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  [openModalBtn, heroResumeBtn, previewTriggerCard].forEach((trigger) => {
    if (trigger) {
      trigger.addEventListener('click', openModal);
    }
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
      closeModal();
    }
  });

  function triggerPrint() {
    if (!resumeModal.classList.contains('active')) {
      openModal();
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  }

  if (printResumeBtn) printResumeBtn.addEventListener('click', triggerPrint);
  if (modalPrintBtn) modalPrintBtn.addEventListener('click', triggerPrint);
}

/* ==========================================================================
   CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (!form) return;

  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    [nameError, emailError, subjectError, messageError].forEach((err) => {
      if (err) {
        err.textContent = '';
        err.classList.remove('active');
      }
    });

    if (!nameInput.value.trim()) {
      showError(nameError, 'Please enter your name');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailError, 'Please provide a valid email address');
      isValid = false;
    }

    if (!subjectInput.value.trim()) {
      showError(subjectError, 'Please enter a subject');
      isValid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
      showError(messageError, 'Message must be at least 8 characters');
      isValid = false;
    }

    if (!isValid) return;

    const subject = encodeURIComponent(`[Inquiry] ${subjectInput.value.trim()}`);
    const body = encodeURIComponent(
      `Hello Shubham,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}\n\n---\nSent via Shubham Wadhe Portfolio`
    );

    if (formSuccess) {
      formSuccess.classList.add('active');
      setTimeout(() => {
        formSuccess.classList.remove('active');
      }, 7000);
    }

    window.location.href = `mailto:shubhamwadhe2876@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });

  function showError(element, msg) {
    if (!element) return;
    element.textContent = msg;
    element.classList.add('active');
  }
}
