/* ==========================================================================
   MAIN JS IMPLEMENTATION
   ========================================================================== */

/* ══════ SUPABASE INIT ══════ */
const SUPABASE_URL = 'https://ylrdjuwdozygrgjtxdwe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_lhmtzfxYERlDKrex_C5xSg_CyYYflfO';
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. HEADER SCROLL EFFECT
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // 2. MOBILE MENU TOGGLE
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Active Link on Scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
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

  // 3. TEXT SLIDER (HERO TITLE)
  const textSlider = document.getElementById('text-slider');
  const words = ['Technology', 'Development', 'Accounting', 'Multimedia & AI', 'Interior Design', 'Future Careers'];
  let wordIndex = 0;

  if (textSlider) {
    setInterval(() => {
      textSlider.style.opacity = 0;
      setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        textSlider.textContent = words[wordIndex];
        textSlider.style.opacity = 1;
      }, 400);
    }, 3000);
  }

  // 4. CANVAS PARTICLE BACKGROUND
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2.5 + 1;
        this.color = Math.random() > 0.5 ? '#e31e24' : '#ffeb00';
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Bounce check
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Move
        this.x += this.vx;
        this.y += this.vy;

        // Interactive mouse force
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.hypot(dx, dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 1.5;
            this.y -= (dy / distance) * force * 1.5;
          }
        }
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Connect nodes
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(227, 30, 36, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animateParticles();
  }

  // 5. SCROLL REVEAL SYSTEM
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once animated
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. STATS COUNTER ANIMATION
  const statNumbers = document.querySelectorAll('.stat-number');
  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing curve outQuad
      const easedProgress = progress * (2 - progress);
      const val = Math.floor(easedProgress * target);
      
      if (target >= 1000) {
        // Format for 10000+ -> 10k+
        element.textContent = val >= 1000 ? `${(val / 1000).toFixed(0)}k+` : val;
      } else if (target === 1) {
        element.textContent = "No: 1";
      } else {
        element.textContent = `${val}+`;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        // Guarantee target display
        if (target >= 1000) element.textContent = `${(target / 1000).toFixed(0)}k+`;
        else if (target === 1) element.textContent = "No: 1";
        else element.textContent = `${target}+`;
      }
    };
    requestAnimationFrame(updateCount);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => statsObserver.observe(num));

  // 7. COURSE GRID FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Active Class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Custom animated fade filters
        if (filterValue === 'all' || category === filterValue) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          card.classList.remove('hide');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hide');
          }, 300);
        }
      });
    });
  });

  // 8. AUTO SELECT COURSE IN FORM ON CLICK
  const selectCourseButtons = document.querySelectorAll('.select-course-btn');
  const courseSelectDropdown = document.getElementById('course-select');

  selectCourseButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseName = btn.getAttribute('data-course');
      if (courseSelectDropdown) {
        courseSelectDropdown.value = courseName;
      }
    });
  });

  // 9. DYNAMIC TESTIMONIALS SLIDER
  const track = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('slider-dots');
  let currentSlide = 0;
  let slideInterval;

  if (track && slides.length > 0) {
    const slideCount = slides.length;
    track.style.width = `${slideCount * 100}%`;
    slides.forEach(slide => {
      slide.style.width = `${100 / slideCount}%`;
    });

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('span');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', i);
        dotsContainer.appendChild(dot);
      }
    }

    const dots = document.querySelectorAll('.dot');

    const updateSlider = (index) => {
      currentSlide = index;
      track.style.transform = `translateX(-${index * (100 / slideCount)}%)`;
      
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
    };

    const startSlideCycle = () => {
      slideInterval = setInterval(() => {
        let nextSlide = (currentSlide + 1) % slideCount;
        updateSlider(nextSlide);
      }, 5000);
    };

    const stopSlideCycle = () => {
      clearInterval(slideInterval);
    };

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        stopSlideCycle();
        updateSlider(idx);
        startSlideCycle();
      });
    });

    startSlideCycle();
  }

  // 10. MULTI-STEP ADMISSION INQUIRY FORM
  const form = document.getElementById('inquiry-form');
  const steps = document.querySelectorAll('.form-step');
  const stepDots = document.querySelectorAll('.step-dot');
  const stepLines = document.querySelectorAll('.step-line');
  const nextBtns = document.querySelectorAll('.next-step-btn');
  const prevBtns = document.querySelectorAll('.prev-step-btn');
  const successScreen = document.getElementById('form-success-screen');
  const resetBtn = document.querySelector('.reset-form-btn');
  let activeStep = 1;

  const updateFormSteps = () => {
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx + 1 === activeStep);
    });

    // Update Dots & Lines
    stepDots.forEach((dot, idx) => {
      const stepNum = idx + 1;
      dot.classList.toggle('active', stepNum === activeStep);
      dot.classList.toggle('completed', stepNum < activeStep);
    });

    stepLines.forEach((line, idx) => {
      line.classList.toggle('active', idx + 1 < activeStep);
    });
  };

  // Form Validation helper
  const validateStep = (stepNumber) => {
    let isValid = true;
    
    if (stepNumber === 1) {
      const nameInput = document.getElementById('student-name');
      const phoneInput = document.getElementById('student-phone');
      
      // Name Check
      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        nameInput.parentElement.classList.remove('has-error');
      }

      // Phone Check (Valid 10 digits in India)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneInput.value.trim())) {
        phoneInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        phoneInput.parentElement.classList.remove('has-error');
      }
    }

    if (stepNumber === 2) {
      const courseSelect = document.getElementById('course-select');
      if (!courseSelect.value) {
        courseSelect.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        courseSelect.parentElement.classList.remove('has-error');
      }
    }

    return isValid;
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(activeStep)) {
        activeStep++;
        updateFormSteps();
        // Update Lucide icons after state render if needed
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeStep--;
      updateFormSteps();
    });
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateStep(activeStep)) return;

      const submitBtn = document.getElementById('submit-btn');
      const originalBtnText = submitBtn.innerHTML;

      // Loading State
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Submitting...</span> <i data-lucide="loader" class="animate-spin"></i>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();

      const phoneVal = (document.getElementById('student-phone')?.value || '').trim();

      try {
        // ── Save enquiry to Supabase ──
        const courseSelect = document.getElementById('course-select');
        const messageArea  = document.getElementById('student-message');

        const { error } = await _sb.from('enquiries').insert({
          name:    (document.getElementById('student-name')?.value  || '').trim(),
          phone:   phoneVal,
          email:   (document.getElementById('student-email')?.value || '').trim(),
          course:  courseSelect ? courseSelect.options[courseSelect.selectedIndex]?.text : '',
          message: messageArea  ? messageArea.value.trim() : '',
          status:  'new',
          replies: []
        });

        if (error) throw error;

        localStorage.setItem('sscc_last_phone', phoneVal);
      } catch (err) {
        console.error('Enquiry submission error:', err);
      }

      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Hide form & indicator, show success
      form.style.display = 'none';
      document.getElementById('step-indicator').style.display = 'none';
      successScreen.classList.add('active');
    });
  }

  // Reset form
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      document.getElementById('step-indicator').style.display = 'flex';
      successScreen.classList.remove('active');
      activeStep = 1;
      updateFormSteps();
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }


});

/* ==========================================================================
   PUBLIC GALLERY — reads media from Supabase (syncs across all devices)
   ========================================================================== */

(function initPublicGallery() {
  // ---------- helpers ----------
  async function getMediaItems() {
    try {
      const { data, error } = await _sb.from('media').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        title: row.title,
        caption: row.caption,
        category: row.category,
        type: row.type,
        dataURL: row.file_url,
        fileName: row.file_name,
        timestamp: new Date(row.created_at).getTime()
      }));
    } catch (e) {
      console.error('Gallery fetch error:', e);
      return [];
    }
  }

  // ---------- state ----------
  let currentItems = [];   // currently visible (after filter)
  let allItems     = [];   // full list
  let lbIndex      = 0;    // lightbox active index

  // ---------- DOM refs ----------
  const grid       = document.getElementById('pub-gallery-grid');
  const emptyState = document.getElementById('gallery-empty');
  const lightbox   = document.getElementById('lightbox');
  const lbMedia    = document.getElementById('lightbox-media');
  const lbTitle    = document.getElementById('lightbox-title');
  const lbCaption  = document.getElementById('lightbox-caption');

  if (!grid) return; // gallery section not present

  // ---------- render ----------
  function renderGallery(items) {
    currentItems = items;

    if (items.length === 0) {
      grid.innerHTML = '';
      emptyState && emptyState.classList.add('show');
      return;
    }

    emptyState && emptyState.classList.remove('show');

    grid.innerHTML = items.map((item, i) => {
      const isVideo = item.type === 'video';
      const mediaTpl = isVideo
        ? `<video src="${item.dataURL}" muted preload="metadata"></video>
           <div class="pub-video-badge"><i data-lucide="play"></i>VIDEO</div>`
        : `<img src="${item.dataURL}" alt="${item.title}" loading="lazy">`;

      return `
        <div class="pub-gallery-item" data-index="${i}" onclick="openLightbox(${i})">
          ${mediaTpl}
          <div class="pub-expand-icon"><i data-lucide="expand"></i></div>
          <div class="pub-gallery-overlay">
            <div class="pub-gallery-overlay-inner">
              <h5>${item.title}</h5>
              ${item.caption ? `<p>${item.caption}</p>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // ---------- filter ----------
  function applyFilter(cat) {
    const items = cat === 'all' ? allItems : allItems.filter(m => m.category === cat);
    renderGallery(items);
  }

  // ---------- filter tab click ----------
  const filterTabs = document.querySelectorAll('.gal-filter');
  filterTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.cat);
    });
  });

  // ---------- lightbox ----------
  window.openLightbox = function(index) {
    lbIndex = index;
    showLightboxItem();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // pause any playing videos
    const vid = lbMedia.querySelector('video');
    if (vid) vid.pause();
  };

  window.shiftLightbox = function(dir, e) {
    e && e.stopPropagation();
    lbIndex = (lbIndex + dir + currentItems.length) % currentItems.length;
    showLightboxItem();
  };

  function showLightboxItem() {
    const item = currentItems[lbIndex];
    if (!item) return;

    // clear previous media
    lbMedia.innerHTML = '';

    if (item.type === 'video') {
      const vid = document.createElement('video');
      vid.src = item.dataURL;
      vid.controls = true;
      vid.autoplay = true;
      lbMedia.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = item.dataURL;
      img.alt = item.title;
      lbMedia.appendChild(img);
    }

    lbTitle.textContent   = item.title  || '';
    lbCaption.textContent = item.caption || '';

    // show/hide prev-next
    const showNav = currentItems.length > 1;
    document.getElementById('lb-prev').style.display = showNav ? 'flex' : 'none';
    document.getElementById('lb-next').style.display = showNav ? 'flex' : 'none';
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  shiftLightbox(1);
    if (e.key === 'ArrowLeft')   shiftLightbox(-1);
  });

  // ---------- initial load from Supabase ----------
  async function load() {
    allItems = await getMediaItems();
    applyFilter('all');
  }

  load();

  // ---------- real-time sync via Supabase Realtime ----------
  _sb.channel('public-gallery-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'media' }, async () => {
      allItems = await getMediaItems();
      const activeCat = document.querySelector('.gal-filter.active');
      applyFilter(activeCat ? activeCat.dataset.cat : 'all');
    })
    .subscribe();
})();
