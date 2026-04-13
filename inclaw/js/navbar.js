/**
 * Returns the current page filename for active nav highlighting.
 */
function getCurrentPage() {
  try {
    const p = location.pathname.split('/').pop();
    return p && p.length ? p : 'index.html';
  } catch (error) {
    console.error('[INCLAW] Failed to detect page', error);
    return 'index.html';
  }
}

/**
 * Creates the shared navbar + footer and binds interactions.
 */
export function initSharedLayout() {
  try {
    const page = getCurrentPage();
    const app = document.querySelector('.site-shell');
    if (!app) return;

    const nav = document.createElement('header');
    nav.className = 'inclaw-nav';
    nav.innerHTML = `
      <div class="inner">
        <a class="brand" href="index.html"><img src="assets/logo.png" alt="INCLAW"/><span>INCLAW</span></a>
        <nav class="nav-links">
          <a href="index.html#features">Features</a>
          <a href="index.html#models">Models</a>
          <a href="workspace.html">Workspace</a>
          <a href="problems.html">Problems</a>
          <a href="pricing.html">Pricing</a>
          <a href="learn.html">Learn</a>
        </nav>
        <div class="nav-actions">
          <a class="icon-btn desktop-only" href="https://github.com/anshbro9891-pixel/in.claude" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.8.5 12.35c0 5.25 3.3 9.7 7.88 11.27.58.12.79-.26.79-.57v-2.01c-3.2.72-3.88-1.58-3.88-1.58-.52-1.36-1.28-1.72-1.28-1.72-1.04-.73.08-.72.08-.72 1.15.08 1.76 1.22 1.76 1.22 1.02 1.79 2.69 1.27 3.35.97.1-.76.4-1.27.72-1.56-2.56-.3-5.26-1.31-5.26-5.85 0-1.29.45-2.34 1.18-3.17-.12-.3-.51-1.52.11-3.17 0 0 .97-.32 3.19 1.21a10.8 10.8 0 0 1 5.8 0c2.21-1.53 3.17-1.2 3.17-1.2.63 1.64.24 2.86.12 3.16.74.83 1.18 1.89 1.18 3.17 0 4.55-2.7 5.55-5.28 5.84.41.37.77 1.1.77 2.23v3.31c0 .32.2.7.8.57 4.57-1.58 7.86-6.02 7.86-11.27C23.5 5.8 18.35.5 12 .5Z"/></svg>
          </a>
          <a class="btn btn-solid desktop-only" href="chat.html">Try Free</a>
          <a class="btn btn-gradient desktop-only" id="auth-btn" href="login.html">Login</a>
          <button class="icon-btn hamburger" id="hamburger" aria-label="menu">☰</button>
        </div>
      </div>
    `;

    const drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.id = 'mobile-drawer';
    drawer.innerHTML = `
      <a href="index.html#features">Features</a>
      <a href="workspace.html">Workspace</a>
      <a href="problems.html">Problems</a>
      <a href="pricing.html">Pricing</a>
      <a href="learn.html">Learn</a>
      <a href="chat.html">Try Free</a>
      <a href="login.html">Login</a>
    `;

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <a class="brand" href="index.html"><img src="assets/logo.png" alt="INCLAW"/><span>INCLAW</span></a>
      <span>Made in India</span>
      <span>© ${new Date().getFullYear()} INCLAW</span>
    `;

    app.prepend(drawer);
    app.prepend(nav);
    app.appendChild(footer);

    const allLinks = [...nav.querySelectorAll('a'), ...drawer.querySelectorAll('a')];
    allLinks.forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith(page) || (page === 'index.html' && href.includes('index.html'))) a.classList.add('active');
    });

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 12);
    });

    const ham = nav.querySelector('#hamburger');
    ham?.addEventListener('click', () => drawer.classList.toggle('open'));

    setInterval(() => {
      const logo = nav.querySelector('.brand img');
      if (logo) {
        logo.style.animation = 'pulse 1s ease';
        setTimeout(() => logo.style.animation = '', 1100);
      }
    }, 3000);
  } catch (error) {
    console.error('[INCLAW] Navbar init error', error);
  }
}

/**
 * Attaches reveal-on-scroll animation to cards and sections.
 */
export function initRevealAnimations() {
  try {
    const nodes = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('shown');
      });
    }, { threshold: 0.14 });
    nodes.forEach((n) => obs.observe(n));
  } catch (error) {
    console.error('[INCLAW] Reveal animation error', error);
  }
}
