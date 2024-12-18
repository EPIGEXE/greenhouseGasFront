"use client"

import { useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    to: string
    label?: string
    icon: LucideIcon
    variant: "default" | "ghost"
  }[]
}

export function Nav({ links, isCollapsed }: NavProps) {
  const [activeMenu, setActiveMenu] = useState('');
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    console.log(currentPath);
    const activeMenu = links.find(link => link.to === currentPath);
    if(activeMenu) {
      setActiveMenu(activeMenu.to);
    }
  }, [location, links])

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link 
                  to={link.to}
                  onClick={() => setActiveMenu(link.to)}
                  className={cn(
                    buttonVariants({ 
                      variant: activeMenu === link.to ? "default" : "ghost", 
                      size: "icon" 
                    }),
                    "h-9 w-9",
                    activeMenu === link.to &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              to={link.to}
              onClick={() => setActiveMenu(link.to)}
              className={cn(
                buttonVariants({ 
                      variant: activeMenu === link.to ? "default" : "ghost", 
                      size: "sm" 
                    }),
                activeMenu === link.to &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  )
}
