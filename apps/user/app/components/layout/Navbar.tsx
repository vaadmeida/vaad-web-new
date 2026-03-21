// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Bell, ShoppingCart, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuthContext } from "@/app/contexts/auth-context";
import { useToast } from "@/app/contexts/toast-context";

interface NavLink {
  name: string;
  href: string;
  isActive?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Billboard", href: "/billboard" },
  { name: "Prints", href: "/prints" },
  { name: "Digital", href: "/digital" },
  { name: "Radio", href: "/radio" },
];

// Fallback Avatar Component
const Avatar = ({ imageUrl, name }: { imageUrl?: string | null; name?: string }) => {
  const [imageError, setImageError] = useState(false);
  
  // Get initials from name
  const initials = name
    ? name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
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

  // Fallback avatar with initials or default icon
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
  const isHomePage = pathname === '/';

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast({
        type: 'success',
        message: 'Logged out successfully',
        duration: 3000,
      });
      setIsProfileMenuOpen(false);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to logout',
        duration: 4000,
      });
    }
  };

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  return (
    <nav className={`
      w-full px-4 sm:px-6 lg:px-18 py-4 transition-all duration-300
      ${!isHomePage 
        ? 'bg-transparent shadow-none' 
        : 'bg-white shadow-sm'
      }
    `}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={isHomePage ? "/vaad.svg" : "/vaad-white.svg"}
            alt="VAAD Media"
            width={60}
            height={32}
            className="w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className={`hidden md:flex gap-8 ${isHomePage ? 'text-gray-600' : 'text-white'} font-medium`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors font-normal ${isHomePage ? 'hover:text-[#0177AB]' : 'hover:text-white'} ${
                isActiveLink(link.href) ? "text-[#0177AB]" : `${isHomePage ? 'text-[#222831]' : 'text-white'}`
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
              {/* Notification Bell */}
              <button className="relative p-2 text-gray-600 hover:text-[#0088b5] transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Cart Icon */}
              <button className="relative p-2 text-gray-600 hover:text-[#0088b5] transition-colors">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0088b5] text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>

              {/* User Avatar with Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
                >
                  <Avatar 
                    imageUrl={user?.avatar} 
                    name={user?.fullName || user?.name} 
                  />
                  <ChevronDown size={16} className={`text-gray-600 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.fullName || user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} />
                      <span>Your Profile</span>
                    </Link>
                    
                    <Link
                      href="/settings"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-[38.5px] py-[15.4px] border border-[#0177AB] rounded-lg text-[#0177AB] hover:bg-gray-50 transition-colors text-[15.4px] font-semibold"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-[38.5px] py-[15.4px] bg-[#0088b5] text-white rounded-lg hover:bg-[#007a9e] transition-colors text-[15.4px] font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-gray-600 hover:text-[#0088b5] transition-colors"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-[72px] bg-white border-t border-gray-100 shadow-lg z-50">
          <div className="flex flex-col p-4 space-y-3">
            {/* Mobile Navigation Links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActiveLink(link.href)
                    ? "bg-[#0088b5]/10 text-[#0088b5]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Auth/User Section */}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <Avatar 
                      imageUrl={user?.avatar} 
                      name={user?.fullName || user?.name} 
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user?.fullName || user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 px-4">
                    <button className="flex-1 p-2 text-gray-600 hover:bg-gray-50 rounded-md flex items-center justify-center gap-2">
                      <Bell size={18} />
                      <span>Notifs</span>
                    </button>
                    <button className="flex-1 p-2 text-gray-600 hover:bg-gray-50 rounded-md flex items-center justify-center gap-2">
                      <ShoppingCart size={18} />
                      <span>Cart (3)</span>
                    </button>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <User size={18} />
                    <span>Your Profile</span>
                  </Link>
                  
                  <Link
                    href="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-center bg-[#0088b5] text-white rounded-md hover:bg-[#007a9e] transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}