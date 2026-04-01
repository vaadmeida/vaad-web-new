// apps/admin/app/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LayoutGrid,
  Eye,
  Repeat,
  Handshake,
  Calendar,
  FileText,
  CreditCard,
  FileCheck,
  Megaphone,
  Users,
  Bell,
  Settings,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  BarChart3,
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const MAIN_MENU: MenuItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Boards", href: "/admin/boards", icon: <LayoutGrid size={20} /> },
  { name: "Watch", href: "/admin/watch", icon: <Eye size={20} /> },
  { name: "Transactions", href: "/admin/transactions", icon: <Repeat size={20} /> },
  { name: "Media Partners", href: "/admin/media-partners", icon: <Handshake size={20} /> },
  { name: "Referrals", href: "/admin/referrals", icon: <UserPlus size={20} /> },
  { name: "Bookings and Orders", href: "/admin/bookings", icon: <Calendar size={20} /> },
  { name: "Campaign Report", href: "/admin/campaign-report", icon: <BarChart3 size={20} /> },
  { name: "Subscription", href: "/admin/subscription", icon: <CreditCard size={20} /> },
  { name: "Application", href: "/admin/application", icon: <FileCheck size={20} /> },
  { name: "Promo", href: "/admin/promo", icon: <Megaphone size={20} /> },
  { name: "Blog Post", href: "/admin/blog", icon: <FileText size={20} /> },
  { name: "Customers", href: "/admin/customers", icon: <Users size={20} /> },
  { name: "Notifications", href: "/admin/notifications", icon: <Bell size={20} />, badge: 3 },
];

const BOTTOM_MENU: MenuItem[] = [
  { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  { name: "Help & Support", href: "/admin/support", icon: <LifeBuoy size={20} /> },
];

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <aside
      className={`
        hidden lg:flex flex-col bg-white border-r border-gray-200 shadow-sm
        transition-all duration-300 ease-in-out fixed left-0 top-0 bottom-0 z-30
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Logo Area */}
      <div className={`
        flex items-center h-16 px-4 border-b border-gray-200
        ${isCollapsed ? "justify-center" : "justify-between"}
      `}>
        {!isCollapsed ? (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image src="/vaad.svg" alt="VAAD Media" width={32} height={32} />
            <span className="font-bold text-lg text-gray-800">VAAD Admin</span>
          </Link>
        ) : (
          <Link href="/admin/dashboard">
            <Image src="/vaad.svg" alt="VAAD Media" width={32} height={32} />
          </Link>
        )}
        
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {MAIN_MENU.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${active 
                    ? "bg-[#0088b5] text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <span className={active ? "text-white" : "text-gray-500"}>
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium">{item.name}</span>
                    {item.badge && (
                      <span className={`
                        text-xs px-1.5 py-0.5 rounded-full
                        ${active ? "bg-white/20 text-white" : "bg-red-500 text-white"}
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                
                {isCollapsed && item.badge && (
                  <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 pt-2 pb-4 px-3 space-y-1">
        {BOTTOM_MENU.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${active 
                  ? "bg-[#0088b5] text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
              title={isCollapsed ? item.name : undefined}
            >
              <span className={active ? "text-white" : "text-gray-500"}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="flex-1 text-sm font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}