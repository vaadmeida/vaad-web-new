/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Eye,
  Receipt,
  Users,
  Repeat,
  ShoppingCart,
  BarChart3,
  CreditCard,
  FileText,
  Tag,
  FileEdit,
  User,
  Bell,
  Settings,
  HelpCircle,
  ChevronDown,
  Menu,
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

// Menu item type
interface MenuItem {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  label: string;
  href: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Boards: false, // Start closed
  });

  // Boards with sub-items - DECLARED FIRST BEFORE USE
  const boardsMenu = {
    icon: ClipboardList,
    label: "Boards",
    subItems: [
      { label: "Board Review", href: "/admin/boards/review" },
      { label: "Add New Board", href: "/admin/boards/add" },
    ],
  };

  // Close dropdown when navigating to a different section
  useEffect(() => {
    // Check if current path is NOT a boards sub-item
    const isBoardsActive = boardsMenu.subItems.some(
      (item) => pathname === item.href
    );
    
    // If not on boards page, close the boards dropdown
    if (!isBoardsActive) {
      setOpenMenus((prev) => ({
        ...prev,
        Boards: false,
      }));
    }
  }, [pathname]);

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  // Define menu items with their routes (Boards is now second)
  const menuItems: MenuItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/admin",
    },
    {
      icon: boardsMenu.icon,
      label: boardsMenu.label,
      href: "#",
      subItems: boardsMenu.subItems,
    },
    {
      icon: Eye,
      label: "Watch",
      href: "/admin/watch",
    },
    {
      icon: Receipt,
      label: "Transactions",
      href: "/admin/transactions",
    },
    {
      icon: Users,
      label: "Media Partners",
      href: "/admin/media-partners",
    },
    {
      icon: Repeat,
      label: "Referrals",
      href: "/admin/referrals",
    },
    {
      icon: ShoppingCart,
      label: "Bookings and Orders",
      href: "/admin/bookings",
    },
    {
      icon: BarChart3,
      label: "Campaign Report",
      href: "/admin/campaign-report",
    },
    {
      icon: CreditCard,
      label: "Subscription",
      href: "/admin/subscription",
    },
    {
      icon: FileText,
      label: "Application",
      href: "/admin/application",
    },
    {
      icon: Tag,
      label: "Promo",
      href: "/admin/promo",
    },
    {
      icon: FileEdit,
      label: "Blog Post",
      href: "/admin/blog",
    },
    {
      icon: User,
      label: "Customers",
      href: "/admin/customers",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/admin/notifications",
    },
  ];

  // Bottom menu items
  const bottomMenuItems: MenuItem[] = [
    {
      icon: Settings,
      label: "Settings",
      href: "/admin/settings",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      href: "/admin/support",
    },
  ];

  // Check if a menu item is active
  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Check if any sub-item is active
  const isSubItemActive = (subItems: SubMenuItem[]) => {
    return subItems.some((item) => pathname === item.href);
  };

  // Render menu item (regular or with sub-items)
  const renderMenuItem = (item: MenuItem) => {
    if (item.subItems) {
      // Render item with sub-items (Boards)
      const isActive = isSubItemActive(item.subItems);
      
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={clsx(
              "w-full flex items-center justify-between px-3 py-2 min-h-[36px] text-[13px] rounded-md hover:bg-gray-100 transition-colors",
              isActive ? "text-[#0088b5] bg-[#0088b5]/5" : "text-gray-700",
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon
                size={16}
                className={clsx(
                  "flex-shrink-0",
                  isActive ? "text-[#0088b5]" : "text-gray-500",
                )}
              />
              <Label collapsed={collapsed}>{item.label}</Label>
            </div>

            {!collapsed && (
              <ChevronDown
                size={14}
                className={clsx(
                  "text-gray-400 transition-transform duration-200",
                  openMenus[item.label] && "rotate-180",
                )}
              />
            )}
          </button>

          {/* Sub-items Dropdown */}
          <div
            className={clsx(
              "ml-6 pl-4 border-l border-gray-300 overflow-hidden transition-all duration-300 ease-in-out",
              collapsed
                ? "max-h-0 opacity-0"
                : openMenus[item.label]
                  ? "max-h-50 opacity-100 mt-1"
                  : "max-h-0 opacity-0",
            )}
          >
            <div className="space-y-1 py-1">
              {item.subItems.map((subItem) => (
                <SubItem
                  key={subItem.label}
                  label={subItem.label}
                  href={subItem.href}
                  active={pathname === subItem.href}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Render regular menu item
    return (
      <Item
        key={item.label}
        icon={item.icon}
        label={item.label}
        href={item.href}
        collapsed={collapsed}
        active={isActive(item.href)}
      />
    );
  };

  return (
    <aside
      className={clsx(
        "h-screen flex flex-col bg-white border-r border-[#D9D9D9] sticky top-0",
        "transition-[width] duration-300 ease-in-out",
        "overflow-hidden shrink-0",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/vaad.svg"
            alt="VAAD Media"
            width={100}
            height={34}
            className="transition-opacity duration-300"
            priority
          />
        </Link>

        <button onClick={() => setCollapsed(!collapsed)} className="p-1">
          <Menu size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Scroll Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto overflow-x-hidden px-2 space-y-1">
          {/* Render all menu items */}
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-2 py-3 border-t border-gray-200 space-y-1">
        {bottomMenuItems.map((item) => (
          <Item
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            collapsed={collapsed}
            active={isActive(item.href)}
          />
        ))}
      </div>
    </aside>
  );
}

/* Label Component */
function Label({
  children,
  collapsed,
}: {
  children: React.ReactNode;
  collapsed: boolean;
}) {
  return (
    <span
      className={clsx(
        "whitespace-nowrap transition-all duration-200 text-sm",
        collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
      )}
    >
      {children}
    </span>
  );
}

/* Main Item Component - Using Next.js Link */
function Item({
  icon: Icon,
  label,
  href,
  collapsed,
  active,
}: {
  icon: any;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean;
}) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className={clsx(
          "w-full flex items-center gap-3 px-3 py-2 min-h-[36px] text-[13px] rounded-md transition-colors",
          active
            ? "bg-[#0088b5]/10 text-[#0088b5] font-medium"
            : "text-gray-700 hover:bg-gray-100",
        )}
      >
        <Icon
          size={16}
          className={clsx(
            "flex-shrink-0",
            active ? "text-[#0088b5]" : "text-gray-500",
          )}
        />
        <Label collapsed={collapsed}>{label}</Label>
      </Link>

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 pointer-events-none">
          {label}
        </div>
      )}
    </div>
  );
}

/* Sub Item Component - Using Next.js Link */
function SubItem({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "w-full flex items-center gap-2 text-[13px] px-3 py-2 rounded-md transition-colors",
        active
          ? "bg-[#0088b5]/10 text-[#0088b5] font-medium"
          : "text-gray-600 hover:bg-gray-100",
      )}
    >
      <div
        className={clsx(
          "w-1.5 h-1.5 rounded-full",
          active ? "bg-[#0088b5]" : "bg-gray-400",
        )}
      />
      {label}
    </Link>
  );
}