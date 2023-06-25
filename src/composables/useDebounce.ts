import debounce from 'lodash.debounce'

export default function useDebounce<T extends (...args: any[]) => void>(callback: T, delay = 500) {
  const debouncedCallback = debounce(callback, delay)

  return debouncedCallback
}
