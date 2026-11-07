// TAR accessibility + performance patch
// Load this file immediately before the app bootstrap script in index.htm.

(function () {
  'use strict';

  const schedule = (() => {
    let frame = null;
    return function (callback) {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = null;
        callback();
      });
    };
  })();

  function ensureAccessibleControls() {
    document.querySelectorAll('button.float-btn').forEach((btn) => {
      if (!btn.type) btn.type = 'button';
      if (!btn.getAttribute('aria-label')) {
        const title = btn.getAttribute('title') || btn.textContent.trim() || 'Action';
        btn.setAttribute('aria-label', title);
      }
    });

    const search = document.getElementById('searchBox');
    if (search && !search.getAttribute('aria-label')) {
      search.setAttribute('aria-label', 'Search flights');
    }

    const bootStatus = document.getElementById('bootStatus');
    if (bootStatus) {
      bootStatus.setAttribute('aria-live', 'polite');
      bootStatus.setAttribute('aria-atomic', 'true');
    }

    const milStatus = document.getElementById('milSyncStatus');
    if (milStatus) {
      milStatus.setAttribute('aria-live', 'polite');
      milStatus.setAttribute('aria-atomic', 'true');
    }
  }

  function debounce(fn, wait = 80) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function attachSafeListeners() {
    const search = document.getElementById('searchBox');
    if (search) {
      const onSearch = debounce((event) => {
        if (window.searchTerm !== undefined) {
          window.searchTerm = event.target.value.trim();
        }
        if (typeof window.uMAT === 'function') {
          window.uMAT();
        }
      }, 80);
      search.addEventListener('input', onSearch);
    }

    const mapToggle = document.getElementById('mLT');
    if (mapToggle) {
      mapToggle.addEventListener('click', function () {
        if (window.currentMapLayer !== undefined) {
          window.currentMapLayer = window.currentMapLayer === 'white' ? 'black' : 'white';
        }
        schedule(() => {
          if (typeof window.uMAT === 'function') window.uMAT();
        });
      });
    }
  }

  function patchLangUi() {
    const toggle = document.getElementById('langToggle');
    if (toggle && !toggle.hasAttribute('aria-label')) {
      toggle.setAttribute('aria-label', 'Switch language');
    }
  }

  ensureAccessibleControls();
  patchLangUi();
  attachSafeListeners();
})();
