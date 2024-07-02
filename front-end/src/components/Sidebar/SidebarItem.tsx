
import { IconType } from "react-icons";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
    icon: IconType,
    label: string,
    to: string
    iconOnly?: boolean
}

const SidebarItem = ({ icon: Icon, iconOnly, label, to }: SidebarItemProps) => {
    const location = useLocation();

    return <Link to={to} className={`${(iconOnly ? "text-white text-3xl justify-center" : "text-xl")} w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white ${(location.pathname != to ? "hover:bg-gray-700" : "bg-gray-700")} dark:hover:bg-gray-700 group`}>
        <Icon />
        <span className={`${(iconOnly && "hidden")} ms-2`}>{label}</span>
    </Link >
};

export default SidebarItem;

