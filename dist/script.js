/**
 * Solar Power Energy s.r.o. – smooth scroll, mobilní menu, formulář
 */

(function () {
    'use strict';

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                var navLinks = document.querySelector('.nav-links');
                if (navLinks) navLinks.classList.remove('is-open');
            }
        });
    });

    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', navLinks.classList.contains('is-open'));
        });
    }

    var contactForm = document.getElementById('contactForm') || document.getElementById('quoteForm');
    if (contactForm && !contactForm.getAttribute('data-handled')) {
        contactForm.setAttribute('data-handled', '1');
    }
})();
