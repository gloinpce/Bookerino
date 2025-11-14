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
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Panou de Control",
    url: "/",
    testId: "link-dashboard",
  },
  {
    title: "Rezervări",
    url: "/bookings",
    testId: "link-bookings",
  },
  {
    title: "Recenzii",
    url: "/reviews",
    testId: "link-reviews",
  },
  {
    title: "Camere",
    url: "/rooms",
    testId: "link-rooms",
  },
  {
    title: "Mese & Meniuri",
    url: "/meals",
    testId: "link-meals",
  },
  {
    title: "Analize",
    url: "/analytics",
    testId: "link-analytics",
  },
  {
    title: "Setări",
    url: "/settings",
    testId: "link-settings",
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <img 
            src="/attached_assets/logo bokkerino_1759435973381.png" 
            alt="BOOKERINO Logo" 
            className="h-8 w-8 rounded-md object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
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
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} data-testid="button-logout">
              <span>Delogare</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}