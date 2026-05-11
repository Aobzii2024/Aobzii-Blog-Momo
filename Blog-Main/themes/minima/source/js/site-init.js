(() => {
  const config = window.__minimaTheme || {};
  const events = config.events || {};

  const waitForEnhancements = (promises) => Promise.race([
    Promise.allSettled(promises),
    new Promise((resolve) => window.setTimeout(resolve, 1800))
  ]);

  const runSiteEnhancements = async () => {
    const detail = { promises: [] };
    document.dispatchEvent(new CustomEvent(events.pageReady || 'op:page-ready', { detail }));

    if (detail.promises.length) {
      await waitForEnhancements(detail.promises);
    }

    document.dispatchEvent(new CustomEvent(events.contentReady || 'op:content-ready'));
  };

  const revealContent = () => {
    document.documentElement.classList.remove('is-loading');
    document.documentElement.classList.remove('is-rendering');
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
