import { Component, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary specifically for OAuth errors
 * Catches any unhandled OAuth-related errors
 */
export class OAuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log OAuth errors for debugging
    if (error.message.includes("oauth") || error.message.includes("OAuth")) {
      console.error("OAuth Error Boundary caught:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-subtle pt-24 pb-20 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Eroare la autentificare OAuth</CardTitle>
              </div>
              <CardDescription>
                A apărut o eroare neașteptată în timpul autentificării OAuth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                  {this.state.error.message}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.href = "/auth";
                  }}
                  className="flex-1"
                >
                  Încercați din nou
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/">Acasă</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

