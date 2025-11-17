import { useState, useEffect } from "react";
import { Calendar, BarChart3, Users, Bed, Settings as SettingsIcon, DollarSign, TrendingUp, Menu, X, Bell, Search, LogOut } from "lucide-react";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Login } from "./components/Login";
import { EmptyDashboard } from "./components/EmptyDashboard";
import { Bookings } from "./components/Bookings";
import { Rooms } from "./components/Rooms";
import { Guests } from "./components/Guests";
import { Analytics } from "./components/Analytics";
import { FinancialReports } from "./components/FinancialReports";
import { Settings } from "./components/Settings";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("bookerino_auth_token");
    const userData = localStorage.getItem("bookerino_user");
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("bookerino_auth_token");
    localStorage.removeItem("bookerino_user");
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab("dashboard");
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "bookings", label: "Rezervări", icon: Calendar },
    { id: "rooms", label: "Camere", icon: Bed },
    { id: "guests", label: "Oaspeți", icon: Users },
    { id: "analytics", label: "Analiză Performanță", icon: TrendingUp },
    { id: "financial", label: "Rapoarte Financiare", icon: DollarSign },
    { id: "settings", label: "Setări", icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-gradient-subtle overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between border-b border-blue-500/30">
          {sidebarOpen && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Bookerino</h1>
              <p className="text-xs text-blue-100 mt-1">HoReCa Management</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-500/30 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${
                  sidebarOpen ? "justify-start px-4" : "justify-center"
                } py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-white text-blue-600 shadow-lg"
                    : "hover:bg-blue-500/30 text-blue-50"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-blue-500/30">
          <div
            className={`flex items-center ${
              sidebarOpen ? "justify-between" : "justify-center"
            } p-3 rounded-lg hover:bg-blue-500/30 cursor-pointer transition-colors`}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {sidebarOpen ? (
              <>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-400 text-white">
                      {user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-blue-100">{user?.email || ""}</p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
                  <LogOut size={16} className="text-blue-100 hover:text-white" />
                </button>
              </>
            ) : (
              <button onClick={handleLogout}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-400 text-white">
                    {user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  type="search"
                  placeholder="Caută rezervări, oaspeți, camere..."
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-8">
              <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.propertyName || "Proprietatea Ta"}</p>
                  <p className="text-xs text-slate-500">{user?.propertyLocation || "România"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-subtle">
          <div className="p-8">
            {activeTab === "dashboard" && <EmptyDashboard />}
            {activeTab === "bookings" && <Bookings />}
            {activeTab === "rooms" && <Rooms />}
            {activeTab === "guests" && <Guests />}
            {activeTab === "analytics" && <Analytics />}
            {activeTab === "financial" && <FinancialReports />}
            {activeTab === "settings" && <Settings user={user} />}
          </div>
        </main>
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
