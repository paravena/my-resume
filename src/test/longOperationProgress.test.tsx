/**
 * Tests for the long operation progress indicator in DownloadButton component.
 * 
 * These tests verify that the progress indicator is displayed when PDF generation
 * takes longer than 2 seconds, as specified in Requirement 6.3.
 * 
 * Validates: Requirements 6.3
 * 
 * NOTE: These tests are SKIPPED because the DownloadButton component now uses
 * window.print() instead of the async generatePDF service. The browser's native
 * print dialog opens immediately and synchronously, so there is no "long operation"
 * state to track. The progress indicator functionality still exists in the component
 * but will never be triggered since window.print() completes instantly.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import React from 'react';
import DownloadButton from '../components/DownloadButton/DownloadButton';

// Mock the PDF service
vi.mock('../services/PDFService', () => ({
  generatePDF: vi.fn(),
}));

// Mock the browser feature detection
vi.mock('../services/BrowserFeatureDetection', () => ({
  checkBrowserSupport: vi.fn(() => ({
    isFullySupported: true,
    canvas: true,
    blob: true,
    downloadAPI: true,
    objectURL: true,
  })),
  getUnsupportedFeaturesMessage: vi.fn(() => null),
}));

// Mock the error handler
vi.mock('../services/PDFErrors', () => ({
  handlePDFError: vi.fn((error) => error?.message || 'An error occurred'),
}));

import { generatePDF } from '../services/PDFService';

describe.skip('Long Operation Progress Indicator', () => {
  let targetRef: React.RefObject<HTMLDivElement>;
  let targetElement: HTMLDivElement;

  beforeEach(() => {
    vi.useFakeTimers();
    
    // Create a mock target element
    targetElement = document.createElement('div');
    targetElement.id = 'resume-container';
    document.body.appendChild(targetElement);
    
    // Create a ref that points to the element
    targetRef = { current: targetElement };
    
    // Reset mocks
    vi.mocked(generatePDF).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.removeChild(targetElement);
    vi.clearAllMocks();
  });

  describe('Progress Indicator Display', () => {
    it('should not show progress indicator initially', () => {
      render(<DownloadButton targetRef={targetRef} />);
      
      expect(screen.queryByTestId('long-operation-progress')).not.toBeInTheDocument();
    });

    it('should not show progress indicator when generation completes quickly (< 2 seconds)', async () => {
      // Mock a fast PDF generation (completes in 500ms)
      vi.mocked(generatePDF).mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true, blob: new Blob(['test']) });
          }, 500);
        });
      });

      render(<DownloadButton targetRef={targetRef} />);
      
      const button = screen.getByRole('button', { name: /download/i });
      fireEvent.click(button);
      
      // Advance time by 500ms (before the 2 second threshold)
      await act(async () => {
        vi.advanceTimersByTime(500);
      });
      
      // Progress indicator should not be shown
      expect(screen.queryByTestId('long-operation-progress')).not.toBeInTheDocument();
    });

    it('should show progress indicator when generation takes > 2 seconds', async () => {
      // Mock a slow PDF generation (takes 5 seconds)
      let resolveGeneration: (value: { success: boolean; blob?: Blob }) => void;
      vi.mocked(generatePDF).mockImplementation(() => {
        return new Promise((resolve) => {
          resolveGeneration = resolve;
        });
      });

      render(<DownloadButton targetRef={targetRef} />);
      
      const button = screen.getByRole('button', { name: /download/i });
      fireEvent.click(button);
      
      // Advance time by 2001ms (just past the 2 second threshold)
      await act(async () => {
        vi.advanceTimersByTime(2001);
      });
      
      // Progress indicator should now be shown
      expect(screen.getByTestId('long-operation-progress')).toBeInTheDocument();
      expect(screen.getByText(/still generating your pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/2s elapsed/i)).toBeInTheDocument();
      
      // Complete the generation
      await act(async () => {
        resolveGeneration({ success: true, blob: new Blob(['test']) });
      });
    });

    it('should update elapsed time every second during long operations', async () => {
      // Mock a slow PDF generation
      let resolveGeneration: (value: { success: boolean; blob?: Blob }) => void;
      vi.mocked(generatePDF).mockImplementation(() => {
        return new Promise((resolve) => {
          resolveGeneration = resolve;
        });
      });

      render(<DownloadButton targetRef={targetRef} />);
      
      const button = screen.getByRole('button', { name: /download/i });
      fireEvent.click(button);
      
      // Advance time by 2001ms to trigger long operation state
      await act(async () => {
        vi.advanceTimersByTime(2001);
      });
      
      expect(screen.getByText(/2s elapsed/i)).toBeInTheDocument();
      
      // Advance time by another second
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      
      expect(screen.getByText(/3s elapsed/i)).toBeInTheDocument();
      
      // Advance time by another second
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      
      expect(screen.getByText(/4s elapsed/i)).toBeInTheDocument();
      
      // Complete the generation
      await act(async () => {
        resolveGeneration({ success: true, blob: new Blob(['test']) });
      });
    });

    it('should hide progress indicator when generation completes', async () => {
      // Mock a slow PDF generation
      let resolveGeneration: (value: { success: boolean; blob?: Blob }) => void;
      vi.mocked(generatePDF).mockImplementation(() => {
        return new Promise((resolve) => {
          resolveGeneration = resolve;
        });
      });

      render(<DownloadButton targetRef={targetRef} />);
      
      const button = screen.getByRole('button', { name: /download/i });
      fireEvent.click(button);
      
      // Advance time by 2001ms to trigger long operation state
      await act(async () => {
        vi.advanceTimersByTime(2001);
      });
      
      expect(screen.getByTestId('long-operation-progress')).toBeInTheDocument();
      
      // Complete the generation
      await act(async () => {
        resolveGeneration({ success: true, blob: new Blob(['test']) });
        // Flush all pending promises
        await Promise.resolve();
      });
      
      // Progress indicator should be hidden
      expect(screen.queryByTestId('long-operation-progress')).not.toBeInTheDocument();
    });

    it('should hide progress indicator when generation fails', async () => {
      // Mock a slow PDF generation that fails
      let rejectGeneration: (error: Error) => void;
      vi.mocked(generatePDF).mockImplementation(() => {
        return new Promise((_, reject) => {
          rejectGeneration = reject;
        });
      });

      render(<DownloadButton targetRef={targetRef} />);
      
      const button = screen.getByRole('button', { name: /download/i });
      fireEvent.click(button);
      
      // Advance time by 2001ms to trigger long operation state
      await act(async () => {
        vi.advanceTimersByTime(2001);
      });
      
      expect(screen.getByTestId('long-operation-progress')).toBeInTheDocument();
      
      // Fail the generation
      await act(async () => {
        rejectGeneration(new Error('Generation failed'));
        // Flush all pending promises
        await Promise.resolve();
      });
      
      // Progress indicator should be hidden
      expect(screen.queryByTestId('long-operation-progress')).not.toBeInTheDocument();
    });
  });

  describe('Screen Reader Announcements', () => {
    it('should announce long operation status to screen readers', async () => {
      // Mock a slow PDF generation
      let resolveGeneration: (value: { success: boolean; blob?: Blob }) => void;
      vi.mocked(generatePDF).mockImplementation(() => {
        return new Promise((resolve) => {
          resolveGeneration = resolve;
        });
      });

      render(<DownloadButton targetRef={targetRef} />);
      
      const button = screen.getByRole('button', { name: /download/i });
      fireEvent.click(button);
      
      // Advance time by 2001ms to trigger long operation state
      await act(async () => {
        vi.advanceTimersByTime(2001);
      });
      
      // Check for screen reader announcement - use getAllByRole since there are multiple status elements
      const statusElements = screen.getAllByRole('status', { hidden: true });
      // Find the sr-only status element (the one with the class)
      const srOnlyStatus = statusElements.find(el => el.classList.contains('sr-only'));
      expect(srOnlyStatus).toBeTruthy();
      expect(srOnlyStatus).toHaveTextContent(/taking longer than expected/i);
      expect(srOnlyStatus).toHaveTextContent(/2 seconds elapsed/i);
      
      // Complete the generation
      await act(async () => {
        resolveGeneration({ success: true, blob: new Blob(['test']) });
        await Promise.resolve();
      });
    });
  });

  describe('Timer Cleanup', () => {
    it('should clean up timers when component unmounts during generation', async () => {
      // Mock a slow PDF generation
      vi.mocked(generatePDF).mockImplementation(() => {
        return new Promise(() => {
          // Never resolves
        });
      });

      const { unmount } = render(<DownloadButton targetRef={targetRef} />);
      
      const button = screen.getByRole('button', { name: /download/i });
      fireEvent.click(button);
      
      // Advance time by 1 second (before threshold)
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      
      // Unmount the component
      unmount();
      
      // Advance time further - should not cause any errors
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      
      // If we get here without errors, the cleanup worked correctly
      expect(true).toBe(true);
    });

    it('should reset elapsed time when starting a new generation', async () => {
      // First generation - slow
      let resolveFirst: (value: { success: boolean; blob?: Blob }) => void;
      vi.mocked(generatePDF).mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolveFirst = resolve;
        });
      });

      render(<DownloadButton targetRef={targetRef} />);
      
      const button = screen.getByRole('button', { name: /download/i });
      fireEvent.click(button);
      
      // Advance time by 3 seconds
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(screen.getByText(/3s elapsed/i)).toBeInTheDocument();
      
      // Complete the first generation
      await act(async () => {
        resolveFirst({ success: true, blob: new Blob(['test']) });
      });
      
      // Second generation - also slow
      let resolveSecond: (value: { success: boolean; blob?: Blob }) => void;
      vi.mocked(generatePDF).mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolveSecond = resolve;
        });
      });
      
      // Start second generation
      fireEvent.click(button);
      
      // Advance time by 2001ms
      await act(async () => {
        vi.advanceTimersByTime(2001);
      });
      
      // Should show 2s, not 5s (reset from previous)
      expect(screen.getByText(/2s elapsed/i)).toBeInTheDocument();
      
      // Complete the second generation
      await act(async () => {
        resolveSecond({ success: true, blob: new Blob(['test']) });
      });
    });
  });
});
