import { useEffect, useRef } from 'react';

/**
 * Custom hook to trap focus within a modal or dialog
 * Implements WCAG 2.1.2 (No Keyboard Trap) requirements
 *
 * @param isOpen - Whether the modal is currently open
 * @returns ref - Reference to attach to the modal container
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(isOpen: boolean) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;

    // Get all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus the first element when modal opens
    firstFocusable.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    // Add event listener
    container.addEventListener('keydown', handleTab);

    // Cleanup
    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  return containerRef;
}
