// This is a mock implementation for html2canvas since we can't directly import it in the v0 environment
// In a real project, you would install html2canvas via npm

export default async function html2canvas(element: HTMLElement, options: any = {}): Promise<HTMLCanvasElement> {
  // Create a canvas element
  const canvas = document.createElement("canvas")
  const width = element.offsetWidth
  const height = element.offsetHeight

  // Set canvas dimensions
  canvas.width = width * (options.scale || 1)
  canvas.height = height * (options.scale || 1)

  // Get the canvas context
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Could not get canvas context")

  // Set background color if specified
  if (options.backgroundColor) {
    context.fillStyle = options.backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Scale the context if needed
  if (options.scale) {
    context.scale(options.scale, options.scale)
  }

  try {
    // Use browser's native API if available
    if (window.html2canvas) {
      return window.html2canvas(element, options)
    }

    // Fallback: Create a data URL from the element's content
    // This is a simplified version - in reality, html2canvas does much more
    const serializer = new XMLSerializer()
    const xmlString = serializer.serializeToString(element)

    const img = new Image()
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xmlString)

    // Draw the image to the canvas
    context.drawImage(img, 0, 0, width, height)

    return canvas
  } catch (error) {
    console.error("Error in html2canvas:", error)
    return canvas // Return the canvas even if there was an error
  }
}

// Add a type declaration for the window object
declare global {
  interface Window {
    html2canvas?: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>
  }
}
