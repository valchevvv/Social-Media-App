import { useSidebarContext } from '../../contexts/SidebarContext';
import SidebarItem from './SidebarItem';
import { BiMessageSquareDots } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineExplore, MdOutlineRssFeed } from 'react-icons/md';
import { RiImageAddLine } from 'react-icons/ri';
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarRightCollapseFilled,
} from 'react-icons/tb';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebarContext();
  const { pathname: location } = useLocation();
  return (
    <>
      <aside
        id="default-sidebar"
        className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} shadow hidden laptop:block sticky top-0 left-0 z-40 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-800`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col gap-5">
            <Link
              to={'/'}
              className={`flex align-center justify-${isCollapsed ? 'center' : 'start'} px-2 py-5`}
            >
              <span className={`text-white font-bold text-${isCollapsed ? 'xl' : '4xl'}`}>
                {isCollapsed ? 'DM' : 'DMedia'}
              </span>
            </Link>
            <ul className="space-y-2 font-medium">
              <SidebarItem
                to="/"
                iconOnly={isCollapsed}
                icon={MdOutlineRssFeed}
                label="News Feed"
              />
              <SidebarItem
                to="/messages"
                iconOnly={isCollapsed}
                icon={BiMessageSquareDots}
                label="Messages"
              />
              <SidebarItem to="/post" iconOnly={isCollapsed} icon={RiImageAddLine} label="Upload" />
              <SidebarItem
                to="/explore"
                iconOnly={isCollapsed}
                icon={MdOutlineExplore}
                label="Explore"
              />
            </ul>
          </div>
          <ul className="space-y-2 font-medium">
            <div className={`flex flex-${isCollapsed ? 'col' : 'row'} gap-2`}>
              <SidebarItem to="/profile" iconOnly={isCollapsed} icon={CgProfile} label="Profile" />

              {!location.includes('/messages') && (
                <div
                  className={`text-white text-3xl justify-center flex items-center p-2 text-gray-900 rounded-lg ${!isCollapsed ? 'bg-gray-700' : ''} hover:bg-gray-500 group cursor-pointer`}
                  onClick={toggleSidebar}
                >
                  {isCollapsed ? (
                    <TbLayoutSidebarLeftCollapseFilled />
                  ) : (
                    <TbLayoutSidebarRightCollapseFilled />
                  )}
                </div>
              )}
            </div>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
