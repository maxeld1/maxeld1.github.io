async function injectPartial(targetSelector, path) {
  const host = document.querySelector(targetSelector);
  if (!host) return;

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    host.innerHTML = await response.text();
  } catch (error) {
    host.innerHTML = `<p class="include-error">Could not load shared layout.</p>`;
    console.error(error);
  }
}

function setActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;

  const link = document.querySelector(`.main-nav a[data-page="${page}"]`);
  if (link) link.classList.add('is-active');
}

(async function loadSharedLayout() {
  await injectPartial('[data-include="header"]', 'partials/header.html');
  await injectPartial('[data-include="footer"]', 'partials/footer.html');
  setActiveNav();
  document.dispatchEvent(new CustomEvent('partials:loaded'));
})();
