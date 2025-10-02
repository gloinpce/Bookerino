import { LayoutDashboard, Calendar, Star, BarChart3, Settings, UtensilsCrossed } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Panou de Control",
    url: "/",
    icon: LayoutDashboard,
    testId: "link-dashboard",
  },
  {
    title: "Rezervări",
    url: "/bookings",
    icon: Calendar,
    testId: "link-bookings",
  },
  {
    title: "Recenzii",
    url: "/reviews",
    icon: Star,
    testId: "link-reviews",
  },
  {
    title: "Camere",
    url: "/rooms",
    icon: () => <span>🏨</span>,
    testId: "link-rooms",
  },
  {
    title: "Mese & Meniuri",
    url: "/meals",
    icon: UtensilsCrossed,
    testId: "link-meals",
  },
  {
    title: "Analize",
    url: "/analytics",
    icon: BarChart3,
    testId: "link-analytics",
  },
  {
    title: "Setări",
    url: "/settings",
    icon: Settings,
    testId: "link-settings",
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <img 
            src="attached_assets/logo bokkerino_1759435973381.png" 
            alt="BOOKERINO Logo" 
            className="h-8 w-8 rounded-md object-contain"
          />
          <span className="text-lg font-semibold">BOOKERINO</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administrare</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={item.testId}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}