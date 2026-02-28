/* ========================================
   TGM Web3 Institution — Cohort 3 Landing
   JavaScript Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------
    // 1. HEADER SCROLL EFFECT
    // ----------------------------
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 40) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });


    // ----------------------------
    // 2. MOBILE NAVIGATION
    // ----------------------------
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    let overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);

    function openMenu() {
        mainNav.classList.add('active');
        overlay.classList.add('active');
        menuToggle.querySelector('.material-icons-outlined').textContent = 'close';
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mainNav.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.querySelector('.material-icons-outlined').textContent = 'menu';
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', () => {
        if (mainNav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);

    // Close menu on nav link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });


    // ----------------------------
    // 3. TRACK ACCORDIONS
    // ----------------------------
    const trackToggles = document.querySelectorAll('[data-track-toggle]');

    trackToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const track = toggle.closest('.track');
            const isActive = track.classList.contains('active');

            // Close all tracks
            document.querySelectorAll('.track').forEach(t => {
                t.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                track.classList.add('active');
            }
        });
    });

    // Open first track by default
    const firstTrack = document.querySelector('.track');
    if (firstTrack) firstTrack.classList.add('active');


    // ----------------------------
    // 4. FAQ ACCORDIONS
    // ----------------------------
    const faqItems = document.querySelectorAll('.faq-item__question');

    faqItems.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isActive = item.classList.contains('active');
            const expanded = btn.getAttribute('aria-expanded') === 'true';

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    // ----------------------------
    // 5. SCROLL ANIMATIONS
    // ----------------------------
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));


    // ----------------------------
    // 6. SMOOTH SCROLL FOR ANCHOR LINKS
    // ----------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ----------------------------
    // 7. COUNTER ANIMATION (for stats if added)
    // ----------------------------
    function animateCounter(el, target, duration = 2000) {
        let start = 0;
        const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        };
        requestAnimationFrame(step);
    }


    // ----------------------------
    // 8. TYPING EFFECT FOR HERO (subtle)
    // ----------------------------
    const heroBadge = document.querySelector('.hero__badge');
    if (heroBadge) {
        heroBadge.style.opacity = '0';
        heroBadge.style.transform = 'translateY(12px)';
        setTimeout(() => {
            heroBadge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            heroBadge.style.opacity = '1';
            heroBadge.style.transform = 'translateY(0)';
        }, 300);
    }


    // ----------------------------
    // 9. STACKED CARD SLIDER
    // ----------------------------
    const sliderDeck = document.querySelector('.emotional__slider-deck');
    const slides = document.querySelectorAll('.emotional__card[data-slide]');
    const dots = document.querySelectorAll('.emotional__slider-dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    if (sliderDeck && slides.length) {
        let currentIndex = 0;
        let isAnimating = false;
        const totalSlides = slides.length;

        // Position all cards initially
        function positionCards() {
            slides.forEach((card, i) => {
                card.classList.remove('slide-active', 'slide-next', 'slide-hidden', 'slide-exit-left', 'slide-exit-right');
                if (i === currentIndex) {
                    card.classList.add('slide-active');
                } else if (i === (currentIndex + 1) % totalSlides) {
                    card.classList.add('slide-next');
                } else {
                    card.classList.add('slide-hidden');
                }
            });
            // Update dots
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
            // Auto-adjust deck height
            adjustDeckHeight();
        }

        function adjustDeckHeight() {
            const activeCard = slides[currentIndex];
            if (activeCard) {
                const h = activeCard.scrollHeight;
                sliderDeck.style.minHeight = h + 'px';
            }
        }

        function goToSlide(newIndex, direction) {
            if (isAnimating || newIndex === currentIndex) return;
            isAnimating = true;

            const oldCard = slides[currentIndex];
            const exitClass = direction === 'next' ? 'slide-exit-left' : 'slide-exit-right';

            // Remove positioning classes from old card and apply exit
            oldCard.classList.remove('slide-active', 'slide-next', 'slide-hidden');
            oldCard.classList.add(exitClass);

            currentIndex = newIndex;

            // Delay repositioning to let exit anim start
            setTimeout(() => {
                positionCards();
            }, 80);

            // After full transition, clean up exit class
            setTimeout(() => {
                oldCard.classList.remove(exitClass);
                isAnimating = false;
            }, 600);
        }

        function goNext() {
            const next = (currentIndex + 1) % totalSlides;
            goToSlide(next, 'next');
        }

        function goPrev() {
            const prev = (currentIndex - 1 + totalSlides) % totalSlides;
            goToSlide(prev, 'prev');
        }

        // Arrow buttons
        if (nextBtn) nextBtn.addEventListener('click', goNext);
        if (prevBtn) prevBtn.addEventListener('click', goPrev);

        // Dot buttons
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const target = parseInt(dot.dataset.dot);
                if (target === currentIndex) return;
                const dir = target > currentIndex ? 'next' : 'prev';
                goToSlide(target, dir);
            });
        });

        // Touch / Mouse swipe support
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        function onPointerDown(e) {
            if (isAnimating) return;
            isDragging = true;
            startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            currentX = startX;
            const activeCard = slides[currentIndex];
            activeCard.classList.add('is-dragging');
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const diff = currentX - startX;
            const activeCard = slides[currentIndex];
            // Move the card with the finger
            const rotation = diff * 0.04;
            activeCard.style.transform = `translateX(${diff}px) rotate(${rotation}deg) scale(1)`;
        }

        function onPointerUp() {
            if (!isDragging) return;
            isDragging = false;
            const diff = currentX - startX;
            const activeCard = slides[currentIndex];
            activeCard.classList.remove('is-dragging');
            activeCard.style.transform = '';

            const threshold = 50;
            if (diff < -threshold) {
                goNext();
            } else if (diff > threshold) {
                goPrev();
            }
        }

        // Attach events to the deck
        sliderDeck.addEventListener('mousedown', onPointerDown);
        sliderDeck.addEventListener('mousemove', onPointerMove);
        sliderDeck.addEventListener('mouseup', onPointerUp);
        sliderDeck.addEventListener('mouseleave', onPointerUp);
        sliderDeck.addEventListener('touchstart', onPointerDown, { passive: true });
        sliderDeck.addEventListener('touchmove', onPointerMove, { passive: true });
        sliderDeck.addEventListener('touchend', onPointerUp);

        // Init
        positionCards();
        window.addEventListener('resize', adjustDeckHeight);
    }

});
