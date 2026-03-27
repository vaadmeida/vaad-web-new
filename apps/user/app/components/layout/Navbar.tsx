// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { 
  Menu, X, Bell, ShoppingCart, User, LogOut, Settings, 
  ChevronDown, Heart, Home, TrendingUp, 
  Radio, Printer, Monitor, LogIn, UserPlus, ChevronRight
} from "lucide-react";
import { useAuthContext } from "@/app/contexts/auth-context";
import { useToast } from "@/app/contexts/toast-context";

interface NavLink {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/", icon: <Home size={18} /> },
  { name: "Billboard", href: "/billboard", icon: <TrendingUp size={18} /> },
  { name: "Prints", href: "/prints", icon: <Printer size={18} /> },
  { name: "Digital", href: "/digital", icon: <Monitor size={18} /> },
  { name: "Radio", href: "/radio", icon: <Radio size={18} /> },
];

// Avatar Component
const Avatar = ({ imageUrl, name }: { imageUrl?: string | null; name?: string }) => {
  const [imageError, setImageError] = useState(false);
  
  const initials = name
    ? name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  if (imageUrl && !imageError) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
        <Image
          src={imageUrl}
          alt={name || "User avatar"}
          width={40}
          height={40}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0088b5] to-[#005a7a] flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200">
      {initials || <User size={20} />}
    </div>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuthContext();
  const { showToast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Theme detection
  useEffect(() => {
    const sections = document.querySelectorAll("[data-theme]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newTheme = entry.target.getAttribute("data-theme") as "light" | "dark";
            setTheme(newTheme);
          }
        });
      },
      { root: null, threshold: 0.6 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      showToast({ type: 'success', message: 'Logged out successfully', duration: 3000 });
      setIsProfileMenuOpen(false);
    } catch (error) {
      showToast({ type: 'error', message: 'Failed to logout', duration: 4000 });
    }
  };

  const isActiveLink = (href: string) => pathname === href;

  return (
    <>
      <nav className={`
        w-full px-4 sm:px-6 lg:px-18 py-4 transition-all duration-300
        ${theme === "light" ? "bg-white shadow-sm" : "bg-transparent"}
      `}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={theme === "light" ? "/vaad.svg" : "/vaad-white.svg"}
              alt="VAAD Media"
              width={60}
              height={32}
              className="w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className={`hidden md:flex gap-8 ${theme === "light" ? "text-gray-800" : "text-white"}`}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-normal ${theme === "light" ? 'hover:text-[#0177AB]' : 'hover:text-white'} ${
                  isActiveLink(link.href) ? "text-[#0177AB]" : `${theme === "light" ? 'text-[#222831]' : 'text-white'}`
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth/User Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button className="relative p-2 text-gray-600 hover:text-[#0088b5] transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="relative p-2 text-gray-600 hover:text-[#0088b5] transition-colors">
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0088b5] text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
                  >
                    <Avatar imageUrl={user?.avatar} name={user?.fullName || user?.name} />
                    <ChevronDown size={16} className={`text-gray-600 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.fullName || user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User size={16} /><span>Your Profile</span>
                      </Link>
                      <Link href="/settings" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings size={16} /><span>Settings</span>
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut size={16} /><span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="px-[38.5px] py-[15.4px] border border-[#0177AB] rounded-lg text-[#0177AB] hover:bg-gray-50 transition-colors text-[15.4px] font-semibold">
                  Login
                </Link>
                <Link href="/auth/signup" className="px-[38.5px] py-[15.4px] bg-[#0088b5] text-white rounded-lg hover:bg-[#007a9e] transition-colors text-[15.4px] font-semibold">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:text-[#0088b5] transition-colors relative z-50"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMobileMenu}
        />
        
        {/* Sidebar Panel */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#0088b5] to-[#006d91] pt-8 pb-6 px-5 sticky top-0 z-10">
            <div className="flex items-center justify-between mb-6">
              <Image src="/vaad-white-full.svg" alt="VAAD Media" width={90} height={30} />
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            
            {/* User Info if authenticated */}
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <Avatar imageUrl={user?.avatar} name={user?.fullName || user?.name} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.fullName || user?.name || 'User'}
                  </p>
                  <p className="text-xs text-white/80 truncate">{user?.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="py-2 px-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMobileMenu}
                className={`
                  flex items-center justify-between px-4 py-3 my-1 rounded-xl transition-colors duration-200
                  ${isActiveLink(link.href)
                    ? "bg-[#0088b5]/10 text-[#0088b5]"
                    : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={isActiveLink(link.href) ? "text-[#0088b5]" : "text-gray-500"}>
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.name}</span>
                </div>
                {isActiveLink(link.href) && (
                  <ChevronRight size={16} className="text-[#0088b5]" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          {isAuthenticated ? (
            <>
              {/* Quick Actions */}
              <div className="px-3 py-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 px-4 py-2 uppercase tracking-wider">Quick Actions</p>
                {/* <Link
                  href="/profile"
                  onClick={toggleMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <User size={18} className="text-gray-500" />
                  <span>Your Profile</span>
                </Link> */}
                <Link
                  href="/favorites"
                  onClick={toggleMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Heart size={18} className="text-gray-500" />
                  <span>Favorites</span>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="p-4 mt-2 border-t border-gray-100 pb-8">
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            /* Auth Buttons for non-authenticated users */
            <div className="p-4 mt-4 border-t border-gray-100 pb-8">
              <Link
                href="/auth/login"
                onClick={toggleMobileMenu}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-3 rounded-xl border-2 border-[#0177AB] text-[#0177AB] font-semibold hover:bg-[#0177AB] hover:text-white transition-all duration-200"
              >
                <LogIn size={18} />
                Login
              </Link>
              <Link
                href="/auth/signup"
                onClick={toggleMobileMenu}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#0088b5] text-white font-semibold hover:bg-[#006d91] transition-all duration-200"
              >
                <UserPlus size={18} />
                Sign Up
              </Link>
            </div>
          )}
          
          {/* Extra padding at bottom for safe area */}
          <div className="h-4" />
        </div>
      </div>
    </>
  );
}