export function initTransitions(selector: string, delay = 250): void {
  if (IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          const timeout = target.classList.contains('transition-postponed') ? 2 * delay : delay;
          setTimeout(() => target.classList.add('transition-final'), timeout);
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
