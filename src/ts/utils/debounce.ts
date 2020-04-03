export function debounce<T>(func: (...args: T[]) => void, wait: number) {
  let timeout: number;

  return (...args: T[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
