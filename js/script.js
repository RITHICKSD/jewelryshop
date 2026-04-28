/* 
   Jewelry Store - Interactive Logic
*/

function init() {
    initThemeToggle();
    initRTL();
    initScrollHeader();
    initScrollReveal();
    initMobileMenu();
    initCounters();
    initCountdown();
    initMarquee();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ─── Dark / Light Theme Toggle ───────────────────────────────────────────────
function initThemeToggle() {
    const html = document.documentElement;
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    if (!toggleBtns.length) return;

    // Restore saved preference (default: light)
    const saved = localStorage.getItem('lumina-theme');
    if (saved === 'dark') {
        html.classList.add('dark-mode');
        document.body.classList.add('dark-theme');
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const isDark = html.classList.toggle('dark-mode');
            document.body.classList.toggle('dark-theme', isDark);
            localStorage.setItem('lumina-theme', isDark ? 'dark' : 'light');

            // Micro-animation feedback
            btn.style.transform = 'scale(0.88) rotate(15deg)';
            setTimeout(() => { btn.style.transform = ''; }, 200);
            
            console.log('Theme toggled. Is dark:', isDark);
        });
    });
}

// RTL / LTR Toggle
function initRTL() {
    const toggles = document.querySelectorAll('.globe-icon');
    const html = document.documentElement;

    console.log('initRTL called');
    console.log('Toggle elements found:', toggles.length);

    // Always start in LTR mode on page load
    html.setAttribute('dir', 'ltr');

    if (toggles.length > 0) {
        console.log('Attaching RTL toggle events to', toggles.length, 'elements');

        // Add event listeners to all globe icons
        toggles.forEach((toggle) => {
            console.log('Adding click listener to:', toggle);
            
            // Add both click and touch events for mobile compatibility
            const handleToggle = (e) => {
                console.log('Globe clicked! Event triggered:', e.type);
                e.preventDefault();
                e.stopPropagation();

                const currentDir = html.getAttribute('dir');
                const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
                console.log('Switching from', currentDir, 'to', newDir);

                // Update direction
                html.setAttribute('dir', newDir);
                console.log('HTML dir attribute set to:', newDir);
                
                localStorage.setItem('site-dir', newDir);

                // Add visual feedback
                toggle.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    toggle.style.transform = 'scale(1)';
                }, 150);

                // Update all icons to show current state
                updateRTLTIcon(newDir);

                // Re-run visibility check
                initScrollReveal();

                // Trigger custom event for other components
                window.dispatchEvent(new CustomEvent('directionChange', { 
                    detail: { direction: newDir } 
                }));

                console.log('RTL/LTR toggle completed. Current direction:', newDir);
            };
            
            // Add click event for desktop
            toggle.addEventListener('click', handleToggle);
            
            // Add only touchend event for mobile (to prevent double triggers)
            toggle.addEventListener('touchend', handleToggle, { passive: false });
            
            console.log('Added click and touchend events to globe');
        });

        console.log('RTL toggle events attached');

        // Initialize all icons
        updateRTLTIcon('ltr');
    } else {
        console.error('No RTL toggle elements found!');
    }
}

// Update RTL toggle icon based on current direction
function updateRTLTIcon(direction) {
    const toggles = document.querySelectorAll('.globe-icon');
    console.log('Updating', toggles.length, 'globe icons to direction:', direction);
    
    toggles.forEach((toggle) => {
        const icon = toggle.querySelector('i');
        if (icon) {
            // Always show globe icon, but change color for visual feedback
            icon.className = 'fas fa-globe';
            if (direction === 'rtl') {
                toggle.title = 'Switch to LTR';
                toggle.style.color = '#c5a059'; // Gold color for RTL
                console.log('Set RTL styling for globe');
            } else {
                toggle.title = 'Switch to RTL';
                toggle.style.color = 'var(--text-dark)'; // Normal color for LTR
                console.log('Set LTR styling for globe');
            }
        }
    });
    
    // Test if CSS is being applied
    const header = document.querySelector('header');
    if (header) {
        const computedStyle = window.getComputedStyle(header);
        console.log('Header computed style direction:', computedStyle.direction);
        console.log('HTML dir attribute:', document.documentElement.getAttribute('dir'));
    }
}

// Sticky Header on Scroll
function initScrollHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Scroll animations are handled by CSS keyframes in animations.css
// No JS-driven IntersectionObserver needed — all sections are naturally visible
function initScrollReveal() {
    // CSS animations handle all reveals automatically
    console.log('CSS-driven animations active. All sections visible.');
}


// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');
    if (!menuToggle || !nav) return;

    function openMenu() {
        nav.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close navigation menu');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
        document.body.style.overflow = '';
        // Collapse all open dropdowns
        document.querySelectorAll('.dropdown.open').forEach(d => {
            d.classList.remove('open');
            const dm = d.querySelector('.dropdown-menu');
            if (dm) dm.classList.remove('active');
        });
    }

    // Toggle on hamburger click - support both click and touch events
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        nav.classList.contains('active') ? closeMenu() : openMenu();
    });

    // Add touch support for mobile devices
    menuToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        nav.classList.contains('active') ? closeMenu() : openMenu();
    }, { passive: false });

    // Close when clicking the dark backdrop area (left of the panel)
    nav.addEventListener('click', (e) => {
        if (e.target === nav) closeMenu();
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) closeMenu();
    });

    // Accordion dropdowns on mobile
    document.querySelectorAll('.dropdown > .nav-link').forEach(link => {
        // Handle click events
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown(link);
            }
        });

        // Handle touch events for better mobile support
        link.addEventListener('touchstart', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown(link);
            }
        }, { passive: false });
    });

    // Helper function to toggle dropdown
    function toggleDropdown(link) {
        const parentLi = link.closest('.dropdown');
        const menu = link.nextElementSibling;
        const isOpen = parentLi.classList.contains('open');

        // Close all other dropdowns (accordion behaviour)
        document.querySelectorAll('.dropdown.open').forEach(d => {
            if (d !== parentLi) {
                d.classList.remove('open');
                const dm = d.querySelector('.dropdown-menu');
                if (dm) dm.classList.remove('active');
            }
        });

        // Toggle this dropdown
        parentLi.classList.toggle('open', !isOpen);
        if (menu) menu.classList.toggle('active', !isOpen);
    }

    // Close whole menu on page-link click
    document.querySelectorAll('nav ul li a:not(.nav-link)').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Count up animation for stats
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                animateCounter(entry.target);
                entry.target.dataset.animated = "true";
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        let count = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        const update = () => {
            count += increment;
            if (count < target) {
                el.innerText = Math.floor(count);
                requestAnimationFrame(update);
            } else {
                el.innerText = target;
            }
        };
        update();
    }
}

// Countdown timer logic
function initCountdown() {
    const timer = document.getElementById('countdown-timer');
    if (!timer) return;

    // Set target date - 30 days from now for demo
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    function updateTimer() {
        const now = new Date();
        const diff = targetDate - now;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        const dEl = document.getElementById('days');
        const hEl = document.getElementById('hours');
        const mEl = document.getElementById('mins');
        const sEl = document.getElementById('secs');

        if (dEl) dEl.innerText = d.toString().padStart(2, '0');
        if (hEl) hEl.innerText = h.toString().padStart(2, '0');
        if (mEl) mEl.innerText = m.toString().padStart(2, '0');
        if (sEl) sEl.innerText = s.toString().padStart(2, '0');
    }

    setInterval(updateTimer, 1000);
    updateTimer();
}

// Infinite Marquee setup
function initMarquee() {
    // Could add pause on hover etc here
}
