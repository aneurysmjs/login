export function byTestId(id: string) {
  return `[data-testid="${id}"]`
}

export function byAriaLabel(label: string) {
  return `[aria-label="${label}"]`
}
