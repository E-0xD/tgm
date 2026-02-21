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

});
