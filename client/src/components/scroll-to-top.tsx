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
      const scrollTop = scrollableElement 
        ? scrollableElement.scrollTop 
        : window.scrollY || document.documentElement.scrollTop;
      
      setIsVisible(scrollTop > 300);
    };

    const scrollableElement = document.querySelector('[data-scroll-container]');
    
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', toggleVisibility);
    } else {
      window.addEventListener('scroll', toggleVisibility);
    }
    
    toggleVisibility();

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', toggleVisibility);
      } else {
        window.removeEventListener('scroll', toggleVisibility);
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
    } else {
      window.scrollTo({
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
