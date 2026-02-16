function bootSharedUI() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const revealNodes = document.querySelectorAll('[data-reveal]');
  if (!revealNodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function bootContactActions() {
  const copyBtn = document.getElementById('copyEmail');
  if (!copyBtn || copyBtn.dataset.bound === 'true') return;
  copyBtn.dataset.bound = 'true';

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('maxeldabbas86@gmail.com');
      copyBtn.textContent = 'Email copied';
      setTimeout(() => {
        copyBtn.textContent = 'Copy email';
      }, 1800);
    } catch {
      copyBtn.textContent = 'Copy failed';
    }
  });
}

function bootProjectFilters() {
  const panel = document.getElementById('projectFilters');
  if (!panel || panel.dataset.initialized === 'true') return;
  panel.dataset.initialized = 'true';

  const cards = Array.from(document.querySelectorAll('.project-card'));
  const tags = [...new Set(cards.flatMap((card) => (card.dataset.stack || '').split(',').filter(Boolean)))].sort();

  tags.forEach((tag) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tag-filter';
    button.textContent = tag;
    button.dataset.tag = tag;
    panel.appendChild(button);
  });

  panel.addEventListener('click', (event) => {
    const button = event.target.closest('.tag-filter');
    if (!button) return;

    panel.querySelectorAll('.tag-filter').forEach((node) => node.classList.remove('is-active'));
    button.classList.add('is-active');

    const chosenTag = button.dataset.tag;
    cards.forEach((card) => {
      const stack = (card.dataset.stack || '').split(',');
      card.hidden = !stack.includes(chosenTag);
    });
  });

  const clearBtn = document.getElementById('clearFilter');
  if (!clearBtn) return;

  clearBtn.addEventListener('click', () => {
    panel.querySelectorAll('.tag-filter').forEach((node) => node.classList.remove('is-active'));
    cards.forEach((card) => {
      card.hidden = false;
    });
  });
}

function initPage() {
  bootSharedUI();
  bootContactActions();
  bootProjectFilters();
}

document.addEventListener('partials:loaded', initPage);
if (document.readyState !== 'loading') {
  initPage();
} else {
  document.addEventListener('DOMContentLoaded', initPage);
}
