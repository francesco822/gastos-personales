/*
 *   Copyright (c) 2025 Laith Alkhaddam aka Iconical or Sleepyico.
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import PasscodeWrapper from "@/components/security/PasscodeWrapper";
import GoToTop from "@/components/helpers/GoToTop";
import { BudgetProvider } from "@/contexts/BudgetContext";
import Toaster from "@/components/effects/Sonner";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import Logo from "@/components/common/Logo";
import { generateMetadata } from "@/lib/head";
import { Settings } from "@/components/common/Settings";
import PageLayout from "@/components/helpers/PageLayout";
import { Achievements } from "@/components/common/Achievements";
import { AppProvider } from "@/contexts/AppContext";
import BottomNav from "@/components/common/BottomNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = generateMetadata;

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#17202B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.NODE_ENV !== "production") {
    import("@/lib/recurring");
  }

  return (
    <html
      lang="es"
      suppressHydrationWarning={true}
      className="scroll-smooth scroll-p-4 overflow-hidden overflow-y-scroll"
    >
      <body
        className={`${inter.variable} antialiased min-w-full flex justify-center items-center`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PasscodeWrapper>
            <AppProvider>
              <BudgetProvider>
                <main className="p-0 pb-20 md:p-6 md:pb-24">
                  <PageLayout>
                    <Logo />
                    <Settings />
                    <Achievements />
                    <ThemeToggle />
                    {children}
                  </PageLayout>
                </main>
                <BottomNav />
                <GoToTop />
                <Toaster />
              </BudgetProvider>
            </AppProvider>
          </PasscodeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
