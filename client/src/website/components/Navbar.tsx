import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Acasă" },
    { to: "/pricing", label: "Prețuri" },
    { to: "/#features", label: "Funcții" },
    { to: "/#contact", label: "Contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <img 
              src="/attached_assets/logo bokkerino_1759435973381.png" 
              alt="Bookerino Logo" 
              className="h-8 w-8 object-contain"
              onError={(e) => {
                // Fallback if image doesn't load
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>Bookerino</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname === link.to ||
                    (link.to.startsWith("/#") &&
                      location.pathname === "/" &&
                      window.location.hash === link.to.slice(1));
              
              return link.to.startsWith("/#") ? (
                <a
                  key={link.to}
                  href={link.to}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    const id = link.to.slice(2);
                    const element = document.getElementById(id);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Button asChild size="sm">
              <Link to="/auth">Autentificare</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {navLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname === link.to;
              
              return link.to.startsWith("/#") ? (
                <a
                  key={link.to}
                  href={link.to}
                  className={cn(
                    "block px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    const id = link.to.slice(2);
                    const element = document.getElementById(id);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "block px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="px-4 pt-2">
              <Button asChild className="w-full" size="sm">
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  Autentificare
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

