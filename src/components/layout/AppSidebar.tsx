import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, Package, ShoppingCart, FileText, 
  Settings, LogOut, Menu, Home, Users, UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

type NavItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  end?: boolean;
};

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
    end: true,
  },
  {
    title: "Inventory",
    icon: Package,
    href: "/inventory",
  },
  {
    title: "Sales",
    icon: ShoppingCart,
    href: "/sales",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/reports",
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: "Profile",
    icon: UserCircle,
    href: "/profile",
  },
];

export function AppSidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r bg-sidebar transition-all duration-300",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {expanded ? (
          <h1 className="font-bold text-xl text-brand-600">InventFlow</h1>
        ) : (
          <h1 className="font-bold text-xl text-brand-600">IF</h1>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex flex-col flex-1 px-2 py-4 space-y-1">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            expanded={expanded}
            isActive={
              item.end
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href)
            }
          />
        ))}
      </nav>

      <nav className="flex flex-col px-2 py-4 space-y-1 border-t">
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            expanded={expanded}
            isActive={location.pathname.startsWith(item.href)}
          />
        ))}
        {user ? (
          <Button
            variant="ghost"
            className="flex items-center"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5 mr-3" />
            {expanded && <span>Logout</span>}
          </Button>
        ) : (
          <NavItem
            item={{
              title: "Logout",
              icon: LogOut,
              href: "#",
            }}
            expanded={expanded}
            isActive={false}
          />
        )}
      </nav>
    </div>
  );
}

function NavItem({
  item,
  expanded,
  isActive,
}: {
  item: NavItem;
  expanded: boolean;
  isActive: boolean;
}) {
  const Icon = item.icon;

  if (!expanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={item.href}
            className={cn(
              "flex items-center justify-center p-3 rounded-md transition-colors",
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{item.title}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{item.title}</span>
    </Link>
  );
}
