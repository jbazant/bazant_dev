export function initMenu(): void {
  const displayButton = document.getElementById('display-site-menu-main');
  const closeButton = document.getElementById('close-site-menu-main');
  const mainMenu = document.getElementById('site-menu-main');

  displayButton.addEventListener('click', function () {
    mainMenu.classList.add('m-fadeIn');
  });

  closeButton.addEventListener('click', function () {
    mainMenu.classList.remove('m-fadeIn');
  });
}
