/**
 * Unit tests for captureElement function
 * 
 * Tests the canvas capture functionality that converts HTML elements to canvas
 * while preserving CSS styling, fonts, and visual effects.
 * 
 * Requirements: 1.2, 2.1, 2.2, 2.3, 2.5, 4.1
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { captureElement, HTML2CANVAS_OPTIONS } from '../services/PDFService';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(),
}));

describe('captureElement', () => {
  let mockElement: HTMLElement;
  let mockCanvas: HTMLCanvasElement;
  let html2canvas: any;

  beforeEach(async () => {
    // Create a mock HTML element
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<h1>Test Content</h1>';
    mockElement.style.width = '800px';
    mockElement.style.height = '600px';

    // Create a mock canvas
    mockCanvas = document.createElement('canvas');
    mockCanvas.width = 1600;
    mockCanvas.height = 1200;

    // Get the mocked html2canvas function
    const html2canvasModule = await import('html2canvas');
    html2canvas = html2canvasModule.default;
    
    // Reset mock before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should capture element and return canvas', async () => {
    // Arrange
    html2canvas.mockResolvedValue(mockCanvas);

    // Act
    const result = await captureElement(mockElement);

    // Assert
    expect(html2canvas).toHaveBeenCalledWith(mockElement, HTML2CANVAS_OPTIONS);
    expect(result).toBe(mockCanvas);
    expect(result.width).toBe(1600);
    expect(result.height).toBe(1200);
  });

  it('should use default HTML2CANVAS_OPTIONS', async () => {
    // Arrange
    html2canvas.mockResolvedValue(mockCanvas);

    // Act
    await captureElement(mockElement);

    // Assert
    expect(html2canvas).toHaveBeenCalledWith(mockElement, expect.objectContaining({
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    }));
  });

  it('should merge custom options with defaults', async () => {
    // Arrange
    html2canvas.mockResolvedValue(mockCanvas);
    const customOptions = {
      scale: 3,
      backgroundColor: '#f0f0f0',
    };

    // Act
    await captureElement(mockElement, customOptions);

    // Assert
    expect(html2canvas).toHaveBeenCalledWith(mockElement, expect.objectContaining({
      scale: 3, // Custom value
      backgroundColor: '#f0f0f0', // Custom value
      useCORS: true, // Default value
      logging: false, // Default value
      windowWidth: 1200, // Default value
    }));
  });

  it('should enable CORS for external resources', async () => {
    // Arrange
    html2canvas.mockResolvedValue(mockCanvas);

    // Act
    await captureElement(mockElement);

    // Assert
    const callArgs = html2canvas.mock.calls[0][1];
    expect(callArgs.useCORS).toBe(true);
  });

  it('should use scale factor of 3 for high quality (~225 DPI)', async () => {
    // Arrange
    html2canvas.mockResolvedValue(mockCanvas);

    // Act
    await captureElement(mockElement);

    // Assert
    const callArgs = html2canvas.mock.calls[0][1];
    expect(callArgs.scale).toBe(3);
  });

  it('should throw error if canvas generation fails', async () => {
    // Arrange
    const error = new Error('Canvas generation failed');
    html2canvas.mockRejectedValue(error);

    // Act & Assert
    await expect(captureElement(mockElement)).rejects.toThrow(
      'Failed to capture element as canvas: Canvas generation failed'
    );
  });

  it('should throw error if canvas is invalid (zero width)', async () => {
    // Arrange
    const invalidCanvas = document.createElement('canvas');
    invalidCanvas.width = 0;
    invalidCanvas.height = 600;
    html2canvas.mockResolvedValue(invalidCanvas);

    // Act & Assert
    await expect(captureElement(mockElement)).rejects.toThrow(
      'Generated canvas is invalid or empty'
    );
  });

  it('should throw error if canvas is invalid (zero height)', async () => {
    // Arrange
    const invalidCanvas = document.createElement('canvas');
    invalidCanvas.width = 800;
    invalidCanvas.height = 0;
    html2canvas.mockResolvedValue(invalidCanvas);

    // Act & Assert
    await expect(captureElement(mockElement)).rejects.toThrow(
      'Generated canvas is invalid or empty'
    );
  });

  it('should throw error if canvas is null', async () => {
    // Arrange
    html2canvas.mockResolvedValue(null);

    // Act & Assert
    await expect(captureElement(mockElement)).rejects.toThrow(
      'Generated canvas is invalid or empty'
    );
  });

  it('should handle elements with complex CSS styling', async () => {
    // Arrange
    mockElement.style.background = 'linear-gradient(to right, #ff0000, #00ff00)';
    mockElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    mockElement.style.fontFamily = 'font-witt, sans-serif';
    html2canvas.mockResolvedValue(mockCanvas);

    // Act
    const result = await captureElement(mockElement);

    // Assert
    expect(html2canvas).toHaveBeenCalledWith(mockElement, expect.any(Object));
    expect(result).toBe(mockCanvas);
  });

  it('should include onclone callback to remove animations', async () => {
    // Arrange
    html2canvas.mockResolvedValue(mockCanvas);

    // Act
    await captureElement(mockElement);

    // Assert
    const callArgs = html2canvas.mock.calls[0][1];
    expect(callArgs.onclone).toBeDefined();
    expect(typeof callArgs.onclone).toBe('function');
  });

  it('should set fixed windowWidth for consistent rendering', async () => {
    // Arrange
    html2canvas.mockResolvedValue(mockCanvas);

    // Act
    await captureElement(mockElement);

    // Assert
    const callArgs = html2canvas.mock.calls[0][1];
    expect(callArgs.windowWidth).toBe(1200);
  });

  it('should disable logging to keep console clean', async () => {
    // Arrange
    html2canvas.mockResolvedValue(mockCanvas);

    // Act
    await captureElement(mockElement);

    // Assert
    const callArgs = html2canvas.mock.calls[0][1];
    expect(callArgs.logging).toBe(false);
  });

  it('should set white background color by default', async () => {
    // Arrange
    html2canvas.mockResolvedValue(mockCanvas);

    // Act
    await captureElement(mockElement);

    // Assert
    const callArgs = html2canvas.mock.calls[0][1];
    expect(callArgs.backgroundColor).toBe('#ffffff');
  });
});
