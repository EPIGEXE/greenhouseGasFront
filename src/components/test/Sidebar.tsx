import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { Nav } from "./Nav"
import {
    File,
    Inbox,
  } from "lucide-react"

interface SidebarProps {
    isCollapsed: boolean
    setIsCollapsed: (isCollapsed: boolean) => void
}

const Sidebar = ({isCollapsed, setIsCollapsed}: SidebarProps) => {
  return (
    <aside 
        className={`
            h-full
            absolute z-10 left-0 inset-y-0
            bg-side-nav transition-all duration-300 ease-in-out 
            ${isCollapsed ? 'w-1/12' : 'w-1/6'} 
            border-r border-side-nav
        `}
        > {/* 변경 */}
        <div className='flex items-center justify-between p-2'>
            <Button variant="destructive" onClick={() => setIsCollapsed(!isCollapsed)} className="w-full">Toggle</Button>
        </div>
        <Separator />
        <Nav 
            isCollapsed={isCollapsed} 
            links={[
                {
                    title: "연간 온실가스 발생량",
                    // label: "128",
                    icon: Inbox,
                    variant: "default",
                },
                {
                    title: "온실가스 발생 비교",
                    //label: "9",
                    icon: File,
                    variant: "ghost",
                },
            ]}
        />
    </aside>
  )
}

export default Sidebar