import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex gap-4 lg:gap-6 items-center">
        <SidebarTrigger />
        
        <h1 className="py-2 lg:text-base text-sm font-medium">Whistleblowing Management Platform</h1>
        
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
