export function initMenu(): void {
  const displayButton = document.getElementById('display-site-menu-main');
  const closeButton = document.getElementById('close-site-menu-main');
  const mainMenu = document.getElementById('site-menu-main');
  const navigationLinksTop = document.querySelectorAll('.navigation-top a');

  function addFadeIn() {
    mainMenu.classList.add('m-fadeIn');
  }

  function removeFadeIn() {
    mainMenu.classList.remove('m-fadeIn');
  }

  displayButton.addEventListener('click', addFadeIn);
  closeButton.addEventListener('click', removeFadeIn);
  navigationLinksTop.forEach((it) => it.addEventListener('click', removeFadeIn));
}
