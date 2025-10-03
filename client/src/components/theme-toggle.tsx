import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      data-testid="button-theme-toggle"
      className="text-xs"
    >
      {theme === "light" ? "Dark" : "Light"}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
