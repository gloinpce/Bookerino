import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollableElement = document.querySelector('[data-scroll-container]');
      if (scrollableElement) {
        const shouldShow = scrollableElement.scrollTop > 300;
        setIsVisible(shouldShow);
      }
    };

    let scrollableElement: Element | null = null;
    let pollIntervalId: NodeJS.Timeout | null = null;

    // Try to find and attach listener with retries
    let attemptCount = 0;
    const maxAttempts = 5;
    const attemptInterval = 50;

    const attachListener = () => {
      scrollableElement = document.querySelector('[data-scroll-container]');
      if (scrollableElement) {
        scrollableElement.addEventListener('scroll', toggleVisibility);
        toggleVisibility(); // Check initial position
        
        // Also poll every 100ms as a fallback for programmatic scrolls
        pollIntervalId = setInterval(toggleVisibility, 100);
        return true;
      }
      return false;
    };

    const findIntervalId = setInterval(() => {
      attemptCount++;
      if (attachListener() || attemptCount >= maxAttempts) {
        clearInterval(findIntervalId);
      }
    }, attemptInterval);

    return () => {
      clearInterval(findIntervalId);
      if (pollIntervalId) clearInterval(pollIntervalId);
      const el = document.querySelector('[data-scroll-container]');
      if (el) {
        el.removeEventListener('scroll', toggleVisibility);
      }
    };
  }, [location]);

  const scrollToTop = () => {
    const scrollableElement = document.querySelector('[data-scroll-container]');
    if (scrollableElement) {
      scrollableElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Button
      data-testid="button-scroll-to-top"
      size="icon"
      className={`fixed bottom-6 right-6 z-50 shadow-lg transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      aria-hidden={!isVisible}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
