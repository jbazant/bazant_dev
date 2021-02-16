export function debounce<T>(func: (...args: T[]) => void, wait: number): (...args: T[]) => void {
  let timeout: NodeJS.Timeout;

  return (...args: T[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
