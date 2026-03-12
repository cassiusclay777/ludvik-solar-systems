/**
 * Solar Power Energy s.r.o. & Ludvík a Syn
 * Hlavní skripty webu
 */

(function () {
    'use strict';

    // --- 1. Google Maps API Loader ---
    (function() {
        var key = typeof window.__GOOGLE_MAPS_API_KEY__ !== 'undefined' ? window.__GOOGLE_MAPS_API_KEY__ : '';
        var mapEl = document.getElementById('configurator-map');
        if (key) {
            var s = document.createElement('script');
            s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(key) + '&callback=initConfiguratorMap&loading=async&v=weekly';
            s.async = true; s.defer = true;
            s.onerror = function() {
                if (mapEl) { mapEl.innerHTML = '<p class="configurator-map-error">Načtení mapy se nezdařilo (kontrola API klíče a HTTP referrerů v Google Cloud).</p>'; }
            };
            document.body.appendChild(s);
        } else if (mapEl) {
            mapEl.innerHTML = '<p class="configurator-map-error">Mapa není k dispozici – na Vercelu nebyl při buildu nastaven <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>. Přidej env proměnnou a spusť nový deploy.</p>';
        }
    })();

    // --- 2. Konfigurátor FVE ---
    window.initConfiguratorMap = function() {
        var el = document.getElementById('configurator-map');
        if (!el) return;
        var center = { lat: 49.2148, lng: 16.0543 };
        var map = new google.maps.Map(el, { center: center, zoom: 12 });
        var marker = null;
        var geocoder = new google.maps.Geocoder();
        var btn = document.getElementById('config-show-map');
        if (btn) btn.onclick = function() {
            var addr = document.getElementById('config-address').value.trim();
            if (!addr) { alert('Zadejte adresu.'); return; }
            geocoder.geocode({ address: addr }, function(res, status) {
                if (status === 'OK' && res[0]) {
                    var pos = res[0].geometry.location;
                    map.setCenter(pos);
                    if (!marker) marker = new google.maps.Marker({ map: map, position: pos });
                    else marker.setPosition(pos);
                } else alert('Adresu nenalezeno.');
            });
        };
    };

    (function roofConfig() {
        // W = výkon panelu (W), P = měrný výnos kWh/kWp/rok, E = cena elektřiny Kč/kWh, S = podíl vlastní spotřeby, X = výkup Kč/kWh
        var W = 400, P = 1050, E = 7, S_DEFAULT = 0.35, X = 1.8;
        var pool = document.getElementById('panel-pool'), grid = document.getElementById('roof-grid');
        if (!pool || !grid) return;

        // Init panels
        for (var i = 0; i < 12; i++) {
            var p = document.createElement('div'); p.className = 'panel-drag-source'; p.draggable = true;
            p.textContent = '400W'; p.dataset.power = W; pool.appendChild(p);
        }
        // Init slots
        for (var j = 0; j < 12; j++) {
            var slot = document.createElement('div'); slot.className = 'roof-slot'; slot.dataset.index = j;
            var btn = document.createElement('button'); btn.className = 'panel-remove'; btn.textContent = '×'; btn.type = 'button';
            btn.onclick = function(e) {
                var s = e.target.closest('.roof-slot');
                if (s && s.classList.contains('filled')) {
                    s.classList.remove('filled');
                    var b = s.querySelector('.panel-badge'); if (b) b.remove();
                    updateCfg();
                }
            };
            slot.appendChild(btn); grid.appendChild(slot);
        }

        function updateCfg() {
            var n = document.querySelectorAll('#roof-grid .roof-slot.filled').length;
            var batteryEl = document.getElementById('config-battery');
            var S = batteryEl ? parseFloat(batteryEl.value) || S_DEFAULT : S_DEFAULT;
            var kwp = n * W / 1000, o = parseFloat(document.getElementById('config-orientation').value) || 1, sl = parseFloat(document.getElementById('config-slope').value) || 1;
            var prod = Math.round(kwp * P * o * sl), self = prod * S, exp = prod * (1 - S), sav = Math.round(self * E + exp * X);
            document.getElementById('cfg-panels').textContent = n;
            document.getElementById('cfg-kwp').textContent = kwp.toFixed(1) + ' kWp';
            document.getElementById('cfg-production').textContent = prod.toLocaleString('cs-CZ') + ' kWh';
            document.getElementById('cfg-savings').textContent = sav.toLocaleString('cs-CZ') + ' Kč';
            var nzuRow = document.getElementById('cfg-nzu-row');
            var nzuVal = document.getElementById('cfg-nzu');
            if (nzuRow && nzuVal) {
                if (n > 0) {
                    nzuRow.style.display = '';
                    nzuVal.textContent = S >= 0.5 ? 'až 200 000 Kč (s baterií)' : 'až 100 000 Kč (bez baterie)';
                } else {
                    nzuRow.style.display = 'none';
                }
            }
            var calcProd = document.getElementById('calc-production');
            if (calcProd && n > 0) calcProd.value = prod;
            if (typeof window.updateCalculatorSummary === 'function') window.updateCalculatorSummary();
        }

        pool.ondragstart = function(e) {
            if (e.target.classList.contains('panel-drag-source')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.power || W);
                e.target.style.opacity = '0.5';
            }
        };
        pool.ondragend = function(e) { e.target.style.opacity = '1'; };
        grid.ondragover = function(e) { e.preventDefault(); var s = e.target.closest('.roof-slot'); if (s && !s.classList.contains('filled')) s.classList.add('drag-over'); };
        grid.ondragleave = function(e) { var s = e.target.closest('.roof-slot'); if (s) s.classList.remove('drag-over'); };
        grid.ondrop = function(e) {
            e.preventDefault();
            var s = e.target.closest('.roof-slot');
            if (s && !s.classList.contains('filled')) {
                s.classList.remove('drag-over');
                s.classList.add('filled');
                var badge = document.createElement('div'); badge.className = 'panel-badge';
                badge.textContent = (parseFloat(e.dataTransfer.getData('text/plain') || W) / 1000).toFixed(1) + ' kW';
                s.insertBefore(badge, s.firstChild);
                updateCfg();
            }
        };
        function fillSlot(slot) {
            if (!slot || slot.classList.contains('filled')) return;
            slot.classList.add('filled');
            var badge = document.createElement('div'); badge.className = 'panel-badge';
            badge.textContent = (W / 1000).toFixed(1) + ' kW';
            slot.insertBefore(badge, slot.firstChild);
            updateCfg();
        }
        grid.addEventListener('click', function(e) {
            var s = e.target.closest('.roof-slot');
            if (s && !s.classList.contains('filled') && !e.target.closest('.panel-remove')) fillSlot(s);
        });
        var orient = document.getElementById('config-orientation'), slope = document.getElementById('config-slope'), battery = document.getElementById('config-battery');
        if (orient) orient.onchange = updateCfg;
        if (slope) slope.onchange = updateCfg;
        if (battery) battery.onchange = updateCfg;
        var pdfBtn = document.getElementById('config-export-pdf');
        if (pdfBtn) {
            pdfBtn.onclick = function() {
                var JsPDF = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);
                if (!JsPDF) {
                    alert('Export PDF není k dispozici (knihovna jspdf se nenačetla). Zkuste obnovit stránku.');
                    return;
                }
                var doc = new JsPDF();
                var a = document.getElementById('config-address').value || '—';
                doc.setFontSize(18); doc.text('Návrh FVE', 14, 22);
                doc.setFontSize(11);
                doc.text('Adresa: ' + a, 14, 32);
                doc.text('Panely: ' + document.getElementById('cfg-panels').textContent + ', ' + document.getElementById('cfg-kwp').textContent, 14, 38);
                doc.text('Výroba: ' + document.getElementById('cfg-production').textContent + ', Úspora: ' + document.getElementById('cfg-savings').textContent, 14, 44);
                doc.save('navrh-fve.pdf');
            };
        }
    })();

    // --- 2b. Kalkulačka úspor ---
    (function savingsCalculator() {
        var S = 0.35, E = 7, X = 1.8;
        var consumptionEl = document.getElementById('calc-consumption');
        var priceEl = document.getElementById('calc-price');
        var productionEl = document.getElementById('calc-production');
        var investmentEl = document.getElementById('calc-investment');
        if (!consumptionEl || !priceEl || !productionEl) return;

        function updateCalculatorSummary() {
            var consumption = parseFloat(consumptionEl.value) || 0;
            var price = parseFloat(priceEl.value) || 0;
            var production = parseFloat(productionEl.value) || 0;
            var investment = parseFloat(investmentEl.value) || 0;
            var before = Math.round(consumption * price);
            var self = production * S, exp = production * (1 - S);
            var savings = Math.round(self * E + exp * X);
            var after = Math.max(0, before - savings);
            document.getElementById('calc-before').textContent = before.toLocaleString('cs-CZ') + ' Kč/rok';
            document.getElementById('calc-savings').textContent = savings.toLocaleString('cs-CZ') + ' Kč/rok';
            document.getElementById('calc-after').textContent = after.toLocaleString('cs-CZ') + ' Kč/rok';
            var paybackEl = document.getElementById('calc-payback');
            if (investment > 0 && savings > 0) {
                var years = (investment / savings).toFixed(1);
                paybackEl.textContent = years.replace('.', ',') + ' let';
            } else {
                paybackEl.textContent = investment > 0 ? '— (zadejte výrobu FVE)' : '—';
            }
        }
        window.updateCalculatorSummary = updateCalculatorSummary;
        consumptionEl.addEventListener('input', updateCalculatorSummary);
        priceEl.addEventListener('input', updateCalculatorSummary);
        productionEl.addEventListener('input', updateCalculatorSummary);
        if (investmentEl) investmentEl.addEventListener('input', updateCalculatorSummary);
        updateCalculatorSummary();
    })();

    // --- 3. Navigace a menu ---
    function closeMenu() {
        var nav = document.querySelector('.nav-dropdown');
        var btn = document.querySelector('.nav-toggle');
        if (nav) nav.classList.remove('is-open');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }
    function openMenu() {
        var nav = document.querySelector('.nav-dropdown');
        var btn = document.querySelector('.nav-toggle');
        if (nav) nav.classList.add('is-open');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    }
    function toggleMenu() {
        var nav = document.querySelector('.nav-dropdown');
        if (nav && nav.classList.contains('is-open')) closeMenu();
        else openMenu();
    }

    var navToggle = document.querySelector('.nav-toggle');
    if (navToggle) navToggle.addEventListener('click', toggleMenu);

    // Smooth scroll pro navigaci
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var el = document.querySelector(id);
            if (el) {
                e.preventDefault();
                closeMenu();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Smooth scroll pro ostatní odkazy (mimo navigaci)
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        if (a.closest('.nav-links')) return;
        a.addEventListener('click', function(e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var el = document.querySelector(id);
            if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    // --- 4. Formulář ---
    var contactForm = document.getElementById('contactForm') || document.getElementById('quoteForm');
    if (contactForm) {
        var submitBtn = contactForm.querySelector('button[type="submit"]');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var gdpr = document.getElementById('gdpr');
            if (!gdpr || !gdpr.checked) {
                alert('Pro odeslání je nutný souhlas se zpracováním osobních údajů.');
                if (gdpr) gdpr.focus();
                return;
            }
            
            // UI Feedback
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Odesílám...';
            }

            var interestEl = document.getElementById('interest');
            var interestLabel = interestEl.options[interestEl.selectedIndex] ? interestEl.options[interestEl.selectedIndex].text : '';
            var n = document.getElementById('name').value, ph = document.getElementById('phone').value, em = document.getElementById('email').value, m = document.getElementById('msg').value;
            var body = 'Zájem: ' + interestLabel + '\nJméno: ' + n + '\nTelefon: ' + ph + '\nEmail: ' + em + '\n\n' + m;
            
            // Simulate delay for better UX
            setTimeout(function() {
                window.location.href = 'mailto:jakubludvik93@gmail.com?subject=' + encodeURIComponent('Poptávka FVE - ' + n) + '&body=' + encodeURIComponent(body);
                // Reset button after redirect (in case user comes back)
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Napsat nám';
                }
            }, 500);
        });
    }

    // --- 5. Lightbox ---
    (function lightbox() {
        function openLightbox(src, caption) {
            var overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-label', 'Zvětšený obrázek');
            overlay.innerHTML = '<div class="lightbox-inner"><img src="' + src + '" alt="' + (caption || '') + '"><button type="button" class="lightbox-close" aria-label="Zavřít">&times;</button></div>';
            overlay.onclick = function(ev) {
                if (ev.target === overlay || ev.target.classList.contains('lightbox-close')) {
                    document.body.removeChild(overlay);
                    document.body.style.overflow = '';
                }
            };
            document.body.style.overflow = 'hidden';
            document.body.appendChild(overlay);
        }
        document.querySelectorAll('.gallery-lightbox').forEach(function(a) {
            a.addEventListener('click', function(ev) {
                ev.preventDefault();
                openLightbox(this.href, this.getAttribute('data-caption') || '');
            });
        });
    })();

    // --- 6. Scroll Animations & Header ---
    (function scrollAnimations() {
        var observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.benefit-card, .service-card, .ref-card, .why-now-block, .step-item, .contact-block').forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        var header = document.querySelector('.site-header');
        if (header) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    })();
})();
