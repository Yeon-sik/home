(function() {
  // Find current script element to resolve static base path
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  function resolveCssHref() {
    try {
      const scriptUrl = new URL(currentScript.src, window.location.href);
      // .../static/js/back-button.js -> .../static/css/back-button.css
      const parts = scriptUrl.pathname.split('/');
      // replace js segment with css
      const jsIdx = parts.lastIndexOf('js');
      if (jsIdx >= 0) parts[jsIdx] = 'css';
      parts[parts.length - 1] = 'back-button.css';
      return scriptUrl.origin + parts.join('/');
    } catch (e) {
      // Fallback: try relative path from current page
      return '../static/css/back-button.css';
    }
  }

  function ensureStylesheet() {
    const existing = document.querySelector('link[data-global-back-button="1"]');
    if (existing) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = resolveCssHref();
    link.setAttribute('data-global-back-button', '1');
    document.head.appendChild(link);
  }

  function createBackButton() {
    if (document.querySelector('.global-back-button')) return;
    const container = document.createElement('div');
    container.className = 'global-back-button';
    const btn = document.createElement('a');
    btn.href = 'javascript:void(0)';
    btn.className = 'back-btn';
    btn.innerHTML = '<span class="arrow">\u2190</span> BACK';
    btn.addEventListener('click', function() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Fallback to project root index.html (one level up is typical)
        window.location.href = '../index.html';
      }
    });
    container.appendChild(btn);
    document.body.appendChild(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ensureStylesheet();
      createBackButton();
    });
  } else {
    ensureStylesheet();
    createBackButton();
  }
})();


