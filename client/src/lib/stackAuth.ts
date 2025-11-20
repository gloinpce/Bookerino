// Stack Auth Configuration
// Project ID: a84c6c76-faaa-49dc-9afc-6ff8e1656eab
// JWKS URL: https://api.stack-auth.com/api/v1/projects/a84c6c76-faaa-49dc-9afc-6ff8e1656eab/.well-known/jwks.json

export const STACK_AUTH_CONFIG = {
    projectId: import.meta.env.VITE_STACK_PROJECT_ID || 'a84c6c76-faaa-49dc-9afc-6ff8e1656eab',
    publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY || 'pck_hp7qzx3dmnbatmbz5z6tp6dj6rd3b11j9vybrngm4savg',
    jwksUrl: `https://api.stack-auth.com/api/v1/projects/${import.meta.env.VITE_STACK_PROJECT_ID || 'a84c6c76-faaa-49dc-9afc-6ff8e1656eab'}/.well-known/jwks.json`,
    apiUrl: 'https://api.stack-auth.com/api/v1',
  };
  
  interface AuthResponse {
    user?: {
      id: string;
      email: string;
      name?: string;
      subscriptions?: {
        professional?: {
          active: boolean;
          plan: string;
          price: string;
          billingPeriod: string;
          startDate: string;
          nextBilling: string;
        };
        enterprise?: {
          active: boolean;
          plan: string;
          price: string;
          billingPeriod: string;
          startDate: string;
          nextBilling: string;
        };
      };
    };
    token?: string;
    error?: string;
  }
  
  // Helper function to format date in Romanian
  const formatRomanianDate = (date: Date): string => {
    const months = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  // Helper function to calculate next billing date
  const getNextBillingDate = (startDate: Date, billingType: 'monthly' | 'yearly'): Date => {
    const nextBilling = new Date(startDate);
    if (billingType === 'monthly') {
      nextBilling.setMonth(nextBilling.getMonth() + 1);
    } else {
      nextBilling.setFullYear(nextBilling.getFullYear() + 1);
    }
    return nextBilling;
  };
  
  // Developer Account Credentials (private - only for developer access)
  const getDeveloperAccount = () => {
    // Professional subscription start date (1 month ago from today)
    const professionalStart = new Date();
    professionalStart.setMonth(professionalStart.getMonth() - 1);
    
    // Enterprise subscription start date (current year January 1st)
    const enterpriseStart = new Date(new Date().getFullYear(), 0, 1);
    
    return {
      email: 'admin@bookerino.ro',
      password: 'Bookerino2025!',
      user: {
        id: 'dev-user-001',
        email: 'admin@bookerino.ro',
        name: 'Developer Bookerino',
        subscriptions: {
          professional: {
            active: true,
            plan: 'Bookerino Professional',
            price: '€45',
            billingPeriod: 'lunar',
            startDate: formatRomanianDate(professionalStart),
            nextBilling: formatRomanianDate(getNextBillingDate(professionalStart, 'monthly')),
          },
          enterprise: {
            active: true,
            plan: 'Bookerino Enterprise',
            price: '€450',
            billingPeriod: 'anual',
            startDate: formatRomanianDate(enterpriseStart),
            nextBilling: formatRomanianDate(getNextBillingDate(enterpriseStart, 'yearly')),
          },
        },
      },
      token: 'dev-token-bookerino-2025',
    };
  };
  
  export const stackAuth = {
    async login(email: string, password: string): Promise<AuthResponse> {
      // Check if developer account (private access only)
      const DEV_ACCOUNT = getDeveloperAccount();
      if (email === DEV_ACCOUNT.email && password === DEV_ACCOUNT.password) {
        return {
          user: DEV_ACCOUNT.user,
          token: DEV_ACCOUNT.token,
        };
      }

      try {
        // Use Stack Auth API
        const response = await fetch(`${STACK_AUTH_CONFIG.apiUrl}/auth/sign-in`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-stack-project-id': STACK_AUTH_CONFIG.projectId,
            'x-stack-publishable-key': STACK_AUTH_CONFIG.publishableClientKey,
          },
          body: JSON.stringify({ email, password }),
        });
  
        // Read response body as text once
        const responseText = await response.text();
  
        if (!response.ok) {
          // Parse error response
          let errorMessage = 'Autentificare eșuată. Verificați email-ul și parola.';
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            errorMessage = responseText || errorMessage;
          }
          throw new Error(errorMessage);
        }
  
        // Parse success response
        return JSON.parse(responseText);
      } catch (error) {
        console.error('Login error:', error);
        return {
          error: error instanceof Error ? error.message : 'A apărut o eroare la autentificare',
        };
      }
    },
  
    async register(name: string, email: string, password: string): Promise<AuthResponse> {
      try {
        // Use Stack Auth API
        const response = await fetch(`${STACK_AUTH_CONFIG.apiUrl}/auth/sign-up`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-stack-project-id': STACK_AUTH_CONFIG.projectId,
            'x-stack-publishable-key': STACK_AUTH_CONFIG.publishableClientKey,
          },
          body: JSON.stringify({ name, email, password }),
        });
  
        // Read response body as text once
        const responseText = await response.text();
  
        if (!response.ok) {
          // Parse error response
          let errorMessage = 'Înregistrare eșuată. Email-ul ar putea fi deja folosit.';
          try {
            const errorData = JSON.parse(responseText);
            if (errorData.error || errorData.message) {
              errorMessage = errorData.error || errorData.message;
            }
          } catch (e) {
            // If response is not JSON, use the text as error message
            errorMessage = responseText || errorMessage;
          }
          throw new Error(errorMessage);
        }
  
        // Parse success response
        const result = JSON.parse(responseText);
        return result;
      } catch (error) {
        console.error('Register error:', error);
        // Check if it's a network error or API unavailable
        if (error instanceof TypeError && error.message.includes('fetch')) {
          return {
            error: 'Nu s-a putut conecta la server. Verificați conexiunea la internet sau contactați suportul.',
          };
        }
        return {
          error: error instanceof Error ? error.message : 'A apărut o eroare la înregistrare',
        };
      }
    },
  
    async logout(): Promise<void> {
      localStorage.removeItem('stack_auth_token');
      localStorage.removeItem('stack_auth_user');
    },
  
    isAuthenticated(): boolean {
      return !!localStorage.getItem('stack_auth_token');
    },
  
    getUser(): any {
      const user = localStorage.getItem('stack_auth_user');
      return user ? JSON.parse(user) : null;
    },

    getCurrentUser(): any {
      return this.getUser();
    },

    setAuthData(token: string, user: any): void {
      localStorage.setItem('stack_auth_token', token);
      localStorage.setItem('stack_auth_user', JSON.stringify(user));
    },
  };

