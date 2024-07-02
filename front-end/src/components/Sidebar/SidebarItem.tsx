
import { IconType } from "react-icons";

interface SidebarItemProps {
    icon: IconType,
    label: string,
    iconOnly?: boolean,
    onClick?: () => void
}

const SidebarItem = ({ icon: Icon, iconOnly, label, onClick }: SidebarItemProps) => {
    return <button onClick={onClick} className={`${(iconOnly ? "text-white text-3xl justify-center" : "text-xl")} w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}>
        <Icon />
        <span className={`${(iconOnly && "hidden")} ms-2`}>{label}</span>
    </button >
};

export default SidebarItem;

