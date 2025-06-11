export const generateTrackingId = (): string => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `SHP${timestamp}${random}`
}
