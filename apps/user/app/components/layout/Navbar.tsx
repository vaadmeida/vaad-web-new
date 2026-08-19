"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Bell,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Heart,
  Home,
  TrendingUp,
  Radio,
  Printer,
  Monitor,
  ChevronRight,
} from "lucide-react";
import { useAuthContext } from "@/app/contexts/auth-context";
import { useCartContext } from "@/app/contexts/cart-context";
import { useToast } from "@/app/contexts/toast-context";
import CartDrawer from "../cart/CartDrawer";

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

const Avatar = ({
  imageUrl,
  name,
}: {
  imageUrl?: string | null;
  name?: string;
}) => {
  const [imageError, setImageError] = useState(false);

  const initials = name
    ? name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  if (imageUrl && !imageError) {
    return (
      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/40">
        <Image
          src={imageUrl}
          alt={name || "User avatar"}
          width={36}
          height={36}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0088b5] to-[#005a7a] flex items-center justify-center text-white font-semibold text-sm border-2 border-white/40">
      {initials}
    </div>
  );
};

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCartContext();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuthContext();
  const { showToast } = useToast();

  const isTransparent = transparent && !scrolled;

  const mutedColor = isTransparent ? "text-white/70" : "text-gray-600";
  const hoverColor = isTransparent
    ? "hover:text-white"
    : "hover:text-[#0177AB]";
  const activeColor = isTransparent ? "text-white" : "text-[#0177AB]";

  const isActiveLink = (href: string) => pathname === href;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const openCart = () => {
    setIsCartOpen(true);
    setIsMobileMenuOpen(false); // close mobile menu if open
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast({
        type: "success",
        message: "Logged out successfully",
        duration: 3000,
      });
      setIsProfileMenuOpen(false);
    } catch {
      showToast({ type: "error", message: "Failed to logout", duration: 4000 });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 90);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        className={`
          fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-16 py-4 
          transition-all duration-300
          ${
            isTransparent
              ? "bg-transparent backdrop-blur-lg"
              : "bg-white backdrop-blur-xl shadow-sm border-b border-gray-100"
          }
        `}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={isTransparent ? "/vaad-white-full.svg" : "/vaad.svg"}
              alt="VAAD Media"
              width={150}
              height={34}
              className="transition-opacity duration-300"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-9 text-[15px] font-medium">
            {NAV_LINKS.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0.6 }}
                animate={{
                  opacity: 1,
                  color: isTransparent
                    ? "#ffffff"
                    : isActiveLink(link.href)
                      ? "#0177AB"
                      : "#111827",
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                  delay: index * 0.02,
                }}
              >
                <Link
                  href={link.href}
                  className={`transition-colors ${hoverColor} ${
                    isActiveLink(link.href) ? activeColor : ""
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    className={`p-2.5 rounded-xl transition-all ${mutedColor} ${hoverColor}`}
                  >
                    <Bell size={21} />
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={openCart}
                    className={`p-2.5 rounded-xl transition-all ${mutedColor} ${hoverColor}`}
                  >
                    <ShoppingCart size={21} />
                    {totalItems > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0088b5] text-[10px] font-medium text-white ring-2 ring-white">
                        {totalItems > 9 ? "9+" : totalItems}
                      </span>
                    )}
                  </button>
                </div>

                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center gap-2.5 focus:outline-none hover:opacity-90 transition-all"
                  >
                    <Avatar
                      imageUrl={user?.avatar}
                      name={user?.fullName || user?.name}
                    />
                    <ChevronDown
                      size={17}
                      className={`transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""} ${mutedColor}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{
                          duration: 0.25,
                          ease: [0.32, 0.72, 0, 1],
                        }}
                        className="absolute right-0 mt-4 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 py-2 overflow-hidden"
                      >
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                          <div className="flex items-center gap-4">
                            <Avatar
                              imageUrl={user?.avatar}
                              name={user?.fullName || user?.name}
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {user?.fullName || user?.name || "User"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-3">
                          <Link
                            href="/profile"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 rounded-2xl mx-2 transition-all"
                          >
                            <User size={20} className="text-gray-400" /> Your
                            Profile
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 rounded-2xl mx-2 transition-all"
                          >
                            <Settings size={20} className="text-gray-400" />{" "}
                            Settings
                          </Link>
                          <Link
                            href="/favorites"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 rounded-2xl mx-2 transition-all"
                          >
                            <Heart size={20} className="text-gray-400" />{" "}
                            Favorites
                          </Link>
                        </div>

                        <div className="h-px bg-gray-100 mx-6 my-2" />

                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="flex items-center gap-4 px-6 py-4 text-red-600 hover:bg-red-50 rounded-2xl mx-2 w-full text-left"
                        >
                          <LogOut size={20} className="text-red-400" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-7 py-2.5 border border-[#0177AB] text-[#0177AB] hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-7 py-2.5 bg-[#0088b5] hover:bg-[#007a9e] text-white rounded-xl font-semibold text-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right: Cart + Menu */}
          <div className="flex md:hidden items-center gap-1">
            {isAuthenticated && (
              <button
                onClick={openCart}
                className={`relative p-3 rounded-2xl transition-all ${mutedColor} hover:text-[#0088b5]`}
                aria-label="Open cart"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0088b5] text-[9px] font-medium text-white ring-2 ring-white">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={toggleMobileMenu}
              className={`p-3 rounded-2xl transition-all ${mutedColor} hover:text-[#0088b5]`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ==================== FULL MOBILE SIDEBAR ==================== */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMobileMenu}
        />

        <div
          className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="bg-gradient-to-br from-[#0088b5] to-[#006d91] pt-10 pb-8 px-6 sticky top-0 z-10">
            <div className="flex items-center justify-between mb-8">
              <Image
                src="/vaad-white-full.svg"
                alt="VAAD Media"
                width={120}
                height={38}
              />
              <button
                onClick={toggleMobileMenu}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {isAuthenticated && (
              <div className="flex items-center gap-4">
                <Avatar
                  imageUrl={user?.avatar}
                  name={user?.fullName || user?.name}
                />
                <div className="text-white">
                  <p className="font-semibold">
                    {user?.fullName || user?.name}
                  </p>
                  <p className="text-sm text-white/70">{user?.email}</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-5 py-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMobileMenu}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                  isActiveLink(link.href)
                    ? "bg-[#0088b5]/10 text-[#0088b5]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span
                  className={
                    isActiveLink(link.href) ? "text-[#0088b5]" : "text-gray-500"
                  }
                >
                  {link.icon}
                </span>
                <span className="font-medium">{link.name}</span>
                {isActiveLink(link.href) && (
                  <ChevronRight size={18} className="ml-auto text-[#0088b5]" />
                )}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="px-5 pt-4 border-t border-gray-100">
              {/* Cart in mobile sidebar */}
              <button
                onClick={openCart}
                className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-gray-700 hover:bg-gray-100"
              >
                <div className="relative">
                  <ShoppingCart size={20} className="text-gray-500" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0088b5] text-[9px] font-medium text-white">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </div>
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="ml-auto text-sm text-[#0088b5] font-medium">
                    {totalItems} item{totalItems > 1 ? "s" : ""}
                  </span>
                )}
              </button>

              <Link
                href="/favorites"
                onClick={toggleMobileMenu}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-700 hover:bg-gray-100"
              >
                <Heart size={20} className="text-gray-500" />
                <span>Favorites</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="flex items-center gap-4 w-full px-5 py-4 mt-6 text-red-600 hover:bg-red-50 rounded-2xl"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="p-6 border-t border-gray-100 space-y-3">
              <Link
                href="/auth/login"
                onClick={toggleMobileMenu}
                className="block w-full py-4 text-center border-2 border-[#0177AB] text-[#0177AB] font-semibold rounded-2xl hover:bg-[#0177AB] hover:text-white transition-all"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                onClick={toggleMobileMenu}
                className="block w-full py-4 text-center bg-[#0088b5] text-white font-semibold rounded-2xl hover:bg-[#007a9e] transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Cart drawer works on mobile + desktop */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}