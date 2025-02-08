"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconCalendar,
  IconCircleNumber1,
  IconHome,
  IconScoreboard,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  {
    label: "Events",
    href: "/event",
    icon: <IconCalendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "attandence",
    href: "/event/attandence",
    icon: <IconCircleNumber1 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Results",
    href: "/profile",
    icon: <IconScoreboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Logout",
    href: "/logout",
    icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
];

export default function EventLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true); // Keep sidebar open by default
  return (
<div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-full  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-[100vh]" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {sidebarLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}

// Logo with text
export const Logo = () => {
  return (
    <Link href="/" className="font-normal flex space-x-2 items-center text-sm text-black py-1">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};

// Logo icon only
export const LogoIcon = () => {
  return (
    <Link href="/" className="font-normal flex space-x-2 items-center text-sm text-black py-1">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm" />
    </Link>
  );
};
