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

function bootProjectPreviews() {
  const cards = Array.from(document.querySelectorAll('.project-card'));
  if (!cards.length) return;

  const closeCard = (card) => {
    const panel = card.querySelector('.project-preview');
    const button = card.querySelector('.project-preview-toggle');
    const video = panel ? panel.querySelector('video') : null;
    if (panel) panel.hidden = true;
    if (button) button.setAttribute('aria-expanded', 'false');
    if (video) video.pause();
  };

  cards.forEach((card) => {
    const button = card.querySelector('.project-preview-toggle');
    const panel = card.querySelector('.project-preview');
    if (!button || !panel || button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';

    const previewSrc = card.dataset.preview;
    const previewPoster = card.dataset.previewPoster;
    const inner = panel.querySelector('.project-preview-inner');
    const message = panel.querySelector('.project-preview-message');

    if (!previewSrc) {
      button.setAttribute('aria-disabled', 'true');
      button.title = 'Add a data-preview attribute to enable video previews.';
      return;
    }

    if (message) message.remove();

    const video = document.createElement('video');
    video.src = previewSrc;
    video.controls = true;
    video.muted = true;
    video.playsInline = true;
    if (previewPoster) video.poster = previewPoster;
    inner.appendChild(video);

    button.addEventListener('click', () => {
      const isOpen = !panel.hidden;
      cards.forEach((otherCard) => {
        if (otherCard !== card) closeCard(otherCard);
      });

      if (isOpen) {
        closeCard(card);
        return;
      }

      panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      video.play().catch(() => {});
    });
  });
}

function initPage() {
  bootSharedUI();
  bootContactActions();
  bootProjectFilters();
  bootProjectPreviews();
}

document.addEventListener('partials:loaded', initPage);
if (document.readyState !== 'loading') {
  initPage();
} else {
  document.addEventListener('DOMContentLoaded', initPage);
}
