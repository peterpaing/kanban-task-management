"use client";

import { useEffect, useRef } from "react";

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function useModalAccessibility<T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
) {
  const modalRef = useRef<T>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modalElement = modalRef.current;
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    const focusableElements = Array.from(
      modalElement.querySelectorAll<HTMLElement>(focusableSelector),
    );

    (focusableElements[0] ?? modalElement).focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const elements = Array.from(
        modalElement.querySelectorAll<HTMLElement>(focusableSelector),
      );

      if (elements.length === 0) {
        event.preventDefault();
        modalElement.focus();
        return;
      }

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [isOpen, onClose]);

  return modalRef;
}