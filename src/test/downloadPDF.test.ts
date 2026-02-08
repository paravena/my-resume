/**
 * Unit tests for downloadPDF function
 * 
 * Tests the PDF download functionality that triggers browser downloads
 * using object URLs and anchor elements.
 * 
 * Requirements: 1.3, 5.3
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadPDF } from '../services/PDFService';

describe('downloadPDF', () => {
  let mockCreateObjectURL: ReturnType<typeof vi.fn>;
  let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
  let mockAppendChild: ReturnType<typeof vi.fn>;
  let mockRemoveChild: ReturnType<typeof vi.fn>;
  let mockClick: ReturnType<typeof vi.fn>;
  let capturedAnchor: HTMLAnchorElement | null = null;

  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    mockCreateObjectURL = vi.fn(() => 'blob:http://localhost/mock-object-url');
    mockRevokeObjectURL = vi.fn();
    
    // Store original URL methods
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    
    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = mockRevokeObjectURL;

    // Mock document.body.appendChild and removeChild
    mockAppendChild = vi.fn((element: HTMLElement) => {
      if (element instanceof HTMLAnchorElement) {
        capturedAnchor = element;
      }
      return element;
    });
    mockRemoveChild = vi.fn((element: HTMLElement) => element);
    
    vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
    vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);

    // Mock click on anchor elements
    mockClick = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(mockClick);

    // Reset captured anchor
    capturedAnchor = null;

    // Use fake timers for setTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    capturedAnchor = null;
  });

  it('should create object URL from blob', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    const filename = 'test.pdf';

    // Act
    downloadPDF(mockBlob, filename);

    // Assert
    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
  });

  it('should create anchor element with correct href and download attributes', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    const filename = 'test-resume.pdf';

    // Act
    downloadPDF(mockBlob, filename);

    // Assert
    expect(capturedAnchor).not.toBeNull();
    expect(capturedAnchor?.href).toBe('blob:http://localhost/mock-object-url');
    expect(capturedAnchor?.download).toBe('test-resume.pdf');
  });

  it('should append anchor to document body', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    const filename = 'test.pdf';

    // Act
    downloadPDF(mockBlob, filename);

    // Assert
    expect(mockAppendChild).toHaveBeenCalled();
    expect(capturedAnchor).not.toBeNull();
  });

  it('should trigger click on anchor element', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    const filename = 'test.pdf';

    // Act
    downloadPDF(mockBlob, filename);

    // Assert
    expect(mockClick).toHaveBeenCalled();
  });

  it('should remove anchor from document body after click', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    const filename = 'test.pdf';

    // Act
    downloadPDF(mockBlob, filename);

    // Assert
    expect(mockRemoveChild).toHaveBeenCalled();
  });

  it('should revoke object URL after timeout', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    const filename = 'test.pdf';

    // Act
    downloadPDF(mockBlob, filename);

    // Assert - URL should not be revoked immediately
    expect(mockRevokeObjectURL).not.toHaveBeenCalled();

    // Fast-forward time
    vi.advanceTimersByTime(100);

    // Assert - URL should be revoked after timeout
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/mock-object-url');
  });

  it('should set anchor style to display none', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    const filename = 'test.pdf';

    // Act
    downloadPDF(mockBlob, filename);

    // Assert
    expect(capturedAnchor?.style.display).toBe('none');
  });

  it('should append .pdf extension if filename does not have it', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    const filename = 'my-resume';

    // Act
    downloadPDF(mockBlob, filename);

    // Assert
    expect(capturedAnchor?.download).toBe('my-resume.pdf');
  });

  it('should not double .pdf extension if filename already has it', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    const filename = 'my-resume.pdf';

    // Act
    downloadPDF(mockBlob, filename);

    // Assert
    expect(capturedAnchor?.download).toBe('my-resume.pdf');
  });

  it('should throw error for null blob', () => {
    // Arrange
    const filename = 'test.pdf';

    // Act & Assert
    expect(() => downloadPDF(null as unknown as Blob, filename)).toThrow(
      'Invalid or empty PDF blob provided'
    );
  });

  it('should throw error for empty blob', () => {
    // Arrange
    const emptyBlob = new Blob([], { type: 'application/pdf' });
    const filename = 'test.pdf';

    // Act & Assert
    expect(() => downloadPDF(emptyBlob, filename)).toThrow(
      'Invalid or empty PDF blob provided'
    );
  });

  it('should throw error for null filename', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });

    // Act & Assert
    expect(() => downloadPDF(mockBlob, null as unknown as string)).toThrow(
      'Invalid filename provided'
    );
  });

  it('should throw error for empty filename', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });

    // Act & Assert
    expect(() => downloadPDF(mockBlob, '')).toThrow(
      'Invalid filename provided'
    );
  });

  it('should throw error for non-string filename', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });

    // Act & Assert
    expect(() => downloadPDF(mockBlob, 123 as unknown as string)).toThrow(
      'Invalid filename provided'
    );
  });

  it('should handle filenames with special characters', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    const filename = 'John Doe - Resume (2024).pdf';

    // Act
    downloadPDF(mockBlob, filename);

    // Assert
    expect(capturedAnchor?.download).toBe('John Doe - Resume (2024).pdf');
  });

  it('should clean up object URL even if click throws', () => {
    // Arrange
    const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    const filename = 'test.pdf';
    
    // Make click throw an error
    mockClick.mockImplementation(() => {
      throw new Error('Click failed');
    });

    // Act & Assert
    expect(() => downloadPDF(mockBlob, filename)).toThrow('Click failed');

    // Fast-forward time
    vi.advanceTimersByTime(100);

    // Assert - URL should still be revoked
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/mock-object-url');
  });
});
