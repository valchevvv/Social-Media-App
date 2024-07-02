import SidebarItem from "./SidebarItem";

import { BiSolidMessageSquareDots } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineRssFeed } from "react-icons/md";
import { FaSearchPlus } from "react-icons/fa";
import { useSidebarContext } from "../../contexts/SidebarContext";

const Sidebar = () => {
    const { isCollapsed } = useSidebarContext();
    return (
        <>
            <aside
                id="default-sidebar"
                className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} hidden sm:block relative top-0 left-0 z-40 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-800`}
                aria-label="Sidebar"
            >
                <div className="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <div className="flex flex-col gap-5">
                        <div className={`flex align-center justify-${(isCollapsed ? "center" : "start")} px-2 py-5`}>
                            <span className={`text-white font-bold text-${(isCollapsed ? "xl" : "4xl")}`}>{(isCollapsed ? "DM" : "DMedia")}</span>
                        </div>
                        <ul className="space-y-2 font-medium">
                            <SidebarItem iconOnly={isCollapsed} icon={MdOutlineRssFeed} label="News Feed" />
                            <SidebarItem iconOnly={isCollapsed} icon={BiSolidMessageSquareDots} label="Messages" />
                            <SidebarItem iconOnly={isCollapsed} icon={FaSearchPlus} label="Search" />
                        </ul>
                    </div>
                    <ul className="space-y-2 font-medium">
                        <SidebarItem iconOnly={isCollapsed} icon={CgProfile} label="Profile" />
                    </ul>
                </div>
            </aside>
        </>
    )
}

export default Sidebar;