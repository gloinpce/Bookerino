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
        setIsVisible(scrollableElement.scrollTop > 300);
      }
    };

    // Wait a bit for the DOM to be ready after route change
    const timeoutId = setTimeout(() => {
      const scrollableElement = document.querySelector('[data-scroll-container]');
      if (scrollableElement) {
        scrollableElement.addEventListener('scroll', toggleVisibility);
        // Check initial scroll position
        toggleVisibility();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const scrollableElement = document.querySelector('[data-scroll-container]');
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', toggleVisibility);
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

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      data-testid="button-scroll-to-top"
      size="icon"
      className="fixed bottom-6 right-6 z-50 shadow-lg"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
