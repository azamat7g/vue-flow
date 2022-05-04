export const warn = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV || process.env.NODE_ENV !== 'production') {
    console.warn(`[Vue Flow]: ${message}`, ...args)
  }
}
