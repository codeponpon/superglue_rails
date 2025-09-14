export function debounce<T extends (...args: any[]) => any>(
  func: T,
  timeout: number = 300
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}
