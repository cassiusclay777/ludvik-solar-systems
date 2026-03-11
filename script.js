/**
 * Solar Power Energy s.r.o. & Ludvík a Syn
 * Hlavní skripty webu
 */

(function () {
    'use strict';

    // --- 1. Google Maps API Loader ---
    (function() {
        var key = typeof window.__GOOGLE_MAPS_API_KEY__ !== 'undefined' ? window.__GOOGLE_MAPS_API_KEY__ : '';
        if (key) {
            var s = document.createElement('script');
            s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(key) + '&callback=initConfiguratorMap&loading=async&libraries=marker&v=weekly';
            s.async = true; s.defer = true;
            document.body.appendChild(s);
        }
    })();

    // --- 2. Konfigurátor FVE ---
    window.initConfiguratorMap = function() {
        var el = document.getElementById('configurator-map');
        if (!el) return;
        var center = { lat: 49.2148, lng: 16.0543 };
        var map = new google.maps.Map(el, { center: center, zoom: 12, mapId: 'DEMO_MAP_ID' });
        var advancedMarker = null;
        var geocoder = new google.maps.Geocoder();
        var btn = document.getElementById('config-show-map');
        if (btn) btn.onclick = function() {
            var addr = document.getElementById('config-address').value.trim();
            if (!addr) { alert('Zadejte adresu.'); return; }
            geocoder.geocode({ address: addr }, function(res, status) {
                if (status === 'OK' && res[0]) {
                    var pos = res[0].geometry.location;
                    map.setCenter(pos);
                    if (!advancedMarker) advancedMarker = new google.maps.marker.AdvancedMarkerElement({ map: map, position: pos });
                    else advancedMarker.position = pos;
                } else alert('Adresu nenalezeno.');
            });
        };
    };

    (function roofConfig() {
        var W = 400, P = 1050, E = 6.5, S = 0.35, X = 1.5;
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
            var kwp = n * W / 1000, o = parseFloat(document.getElementById('config-orientation').value) || 1, sl = parseFloat(document.getElementById('config-slope').value) || 1;
            var prod = Math.round(kwp * P * o * sl), self = prod * S, exp = prod * (1 - S), sav = Math.round(self * E + exp * X);
            document.getElementById('cfg-panels').textContent = n;
            document.getElementById('cfg-kwp').textContent = kwp.toFixed(1) + ' kWp';
            document.getElementById('cfg-production').textContent = prod.toLocaleString('cs-CZ') + ' kWh';
            document.getElementById('cfg-savings').textContent = sav.toLocaleString('cs-CZ') + ' Kč';
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
        var orient = document.getElementById('config-orientation'), slope = document.getElementById('config-slope');
        if (orient) orient.onchange = updateCfg;
        if (slope) slope.onchange = updateCfg;
        document.getElementById('config-export-pdf').onclick = function() {
            var doc = new window.jspdf.jsPDF();
            var a = document.getElementById('config-address').value || '—';
            doc.setFontSize(18); doc.text('Návrh FVE', 14, 22);
            doc.setFontSize(11);
            doc.text('Adresa: ' + a, 14, 32);
            doc.text('Panely: ' + document.getElementById('cfg-panels').textContent + ', ' + document.getElementById('cfg-kwp').textContent, 14, 38);
            doc.text('Výroba: ' + document.getElementById('cfg-production').textContent + ', Úspora: ' + document.getElementById('cfg-savings').textContent, 14, 44);
            doc.save('navrh-fve.pdf');
        };
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
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var gdpr = document.getElementById('gdpr');
            if (!gdpr || !gdpr.checked) {
                alert('Pro odeslání je nutný souhlas se zpracováním osobních údajů.');
                if (gdpr) gdpr.focus();
                return;
            }
            var interestEl = document.getElementById('interest');
            var interestLabel = interestEl.options[interestEl.selectedIndex] ? interestEl.options[interestEl.selectedIndex].text : '';
            var n = document.getElementById('name').value, ph = document.getElementById('phone').value, em = document.getElementById('email').value, m = document.getElementById('msg').value;
            var body = 'Zájem: ' + interestLabel + '\nJméno: ' + n + '\nTelefon: ' + ph + '\nEmail: ' + em + '\n\n' + m;
            window.location.href = 'mailto:jakubludvik93@gmail.com?subject=' + encodeURIComponent('Poptávka FVE - ' + n) + '&body=' + encodeURIComponent(body);
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
})();
