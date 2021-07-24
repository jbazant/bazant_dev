export function initTransitions(selector: string, delay = 250): void {
  if (IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          setTimeout(() => target.classList.add('transition-final'), delay);
          observer.unobserve(target);
        }
      });
    });

    document.querySelectorAll(selector).forEach((element) => {
      element.classList.add('transition-initial');
      observer.observe(element);
    });
  }
}
