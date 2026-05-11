(() => {
  const config = window.__minimaTheme || {};
  const events = config.events || {};

  const runSiteEnhancements = async () => {
    const detail = { promises: [] };
    document.dispatchEvent(new CustomEvent(events.pageReady || 'op:page-ready', { detail }));

    if (detail.promises.length) {
      await Promise.allSettled(detail.promises);
    }

    document.dispatchEvent(new CustomEvent(events.contentReady || 'op:content-ready'));
  };

  const revealContent = () => {
    document.documentElement.classList.remove('is-navigating');
    document.documentElement.classList.add('is-loaded');

    window.setTimeout(() => {
      document.documentElement.classList.remove('is-loaded');
    }, 120);
  };

  document.addEventListener('DOMContentLoaded', () => {
    void runSiteEnhancements();
  });
  document.addEventListener(events.contentReady || 'op:content-ready', revealContent);
})();
