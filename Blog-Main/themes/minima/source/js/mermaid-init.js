(() => {
  const config = window.__minimaTheme || {};
  const selectors = config.selectors || {};
  const events = config.events || {};

  const initMermaidDiagrams = () => {
    const mermaidCodeBlocks = Array.from(
      document.querySelectorAll(selectors.mermaidCode || 'pre code.language-mermaid, pre code.lang-mermaid')
    );

    const mermaidTextPattern =
      /^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph)\b/m;

    const plaintextFigures = Array.from(
      document.querySelectorAll(selectors.mermaidPlaintextFigure || 'figure.highlight.plaintext')
    ).filter((figure) => {
      const code = figure.querySelector(selectors.mermaidPlaintextCode || 'td.code pre');
      return code && mermaidTextPattern.test(code.textContent || '');
    });

    if (!mermaidCodeBlocks.length && !plaintextFigures.length) {
      return Promise.resolve();
    }

    if (!window.mermaid) {
      if (document.querySelector('script[data-mermaid-loader]')) {
        return Promise.resolve();
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      script.defer = true;
      script.dataset.mermaidLoader = '1';
      const loaded = new Promise((resolve) => {
        script.addEventListener('load', resolve, { once: true });
        script.addEventListener('error', resolve, { once: true });
      });
      document.head.appendChild(script);
      return loaded.then(initMermaidDiagrams);
    }

    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose'
    });

    mermaidCodeBlocks.forEach((block) => {
      const source = block.textContent || '';
      const container = document.createElement('div');

      container.className = 'mermaid';
      container.textContent = source;

      const pre = block.closest('pre');
      if (pre) {
        pre.replaceWith(container);
      } else {
        block.replaceWith(container);
      }
    });

    plaintextFigures.forEach((figure) => {
      const code = figure.querySelector(selectors.mermaidPlaintextCode || 'td.code pre');
      if (!code) {
        return;
      }

      const container = document.createElement('div');
      container.className = 'mermaid';
      container.textContent = code.textContent || '';
      figure.replaceWith(container);
    });

    return window.mermaid.run({ querySelector: '.mermaid' }).catch(() => {});
  };

  document.addEventListener('DOMContentLoaded', initMermaidDiagrams);
  document.addEventListener(events.pageReady || 'op:page-ready', (event) => {
    const promise = initMermaidDiagrams();
    if (event.detail && Array.isArray(event.detail.promises)) {
      event.detail.promises.push(promise);
    }
  });
})();
