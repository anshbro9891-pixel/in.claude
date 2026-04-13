/**
 * Runs the first-visit INCLAW intro animation using GSAP and sessionStorage.
 */
export function initLogoIntro() {
  try {
    let shown = false;
    try {
      shown = sessionStorage.getItem('inclaw_intro_shown') === 'true';
    } catch (storageError) {
      console.warn('[INCLAW] Intro sessionStorage read failed', storageError);
      shown = true;
    }
    const overlay = document.getElementById('intro-overlay');
    const content = document.querySelector('.site-shell');
    if (!overlay || !content) return;

    if (shown || typeof gsap === 'undefined') {
      overlay.remove();
      content.style.opacity = '1';
      return;
    }

    content.style.opacity = '0';
    const hex = overlay.querySelector('#intro-hex');
    const brain = overlay.querySelector('#intro-brain');
    const title = overlay.querySelector('#intro-title');
    const tagline = overlay.querySelector('#intro-tagline');

    if (!hex || !brain || !title || !tagline) {
      overlay.remove();
      content.style.opacity = '1';
      return;
    }

    const length = hex.getTotalLength();
    hex.style.strokeDasharray = String(length);
    hex.style.strokeDashoffset = String(length);
    title.textContent = '';
    tagline.style.opacity = '0';

    const tl = gsap.timeline({ onComplete: () => {
      try {
        sessionStorage.setItem('inclaw_intro_shown', 'true');
      } catch (e) {
        console.warn('[INCLAW] Intro sessionStorage failed', e);
      }
      overlay.remove();
      gsap.to(content, { opacity: 1, duration: 0.3 });
    }});

    tl.to({}, { duration: 0.5 })
      .to(hex, { strokeDashoffset: 0, duration: 1, ease: 'power2.out' })
      .fromTo(brain, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' })
      .to({}, {
        duration: 0.5,
        onUpdate: function () {
          const text = 'INCLAW';
          const progress = Math.floor(this.progress() * text.length);
          title.textContent = text.slice(0, progress);
        }
      })
      .to(tagline, { opacity: 1, duration: 0.5 })
      .to(overlay, { y: -40, opacity: 0, duration: 0.5, ease: 'power2.in' });
  } catch (error) {
    console.error('[INCLAW] Intro animation error', error);
  }
}
