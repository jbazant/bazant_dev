export function ready(fn: () => void): void {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

export function gid(id: string): HTMLElement | null {
  return document.getElementById(id);
}

export function appendPara(el: Node, text: string, className?: string): void {
  const para = document.createElement('p');
  para.innerHTML = text;
  para.classList.add(className);
  el.parentNode.appendChild(para);
}
