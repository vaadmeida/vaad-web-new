// apps/admin/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "@repo/ui/globals.css";
import { AuthProvider } from "./contexts/auth-context";
import { ToastProvider } from "./contexts/toast-context";
import SplashProvider from "./components/SplashProvider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "VAAD Media Partner",
  description: "Media Partner dashboard for VAAD Media Ltd",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0088b5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <SplashProvider>
              {children}
            </SplashProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}