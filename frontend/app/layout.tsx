'use client'

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconCalendarStats,
  IconHome,
  IconLogout,
  IconSpeakerphone,
  IconUser,
} from "@tabler/icons-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// `RootLayout` is a client component now (due to 'use client' directive)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noLayoutPages = ["/auth/*"];
  const isNoLayoutPage = noLayoutPages.includes(pathname);

  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },

    {
      title: "Event",
      icon: (
        <IconSpeakerphone className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/event",
    },
    {
      title: "schedule",
      icon: (
        <IconCalendarStats className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/schedule",
    },

    {
      title: "Profile",
      icon: (
        <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/user",
    },
    {
      title: "Logout",
      icon: (
        <IconLogout className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/aaronjoju07/cecompanion",
    },
  ];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isNoLayoutPage ? (
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">{children}</div>
            <div className="flex justify-center w-full fixed bottom-0 z-10">
              <FloatingDock items={links} />
            </div>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
