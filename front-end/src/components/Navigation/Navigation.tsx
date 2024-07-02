
import { BiMessageSquareDots } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineRssFeed, MdOutlineExplore } from "react-icons/md";
import { BsPlusCircleDotted } from "react-icons/bs";
import NavigationMenuItem from "./NavigationMenuItem";

const Navigation = () => {
    return (
        <div className="bg-gray-800 shadow sm:hidden fixed bottom-0 left-0 w-full h-[60px] text-white flex flex-row ">
            <NavigationMenuItem page='/' text="Feed" Icon={MdOutlineRssFeed} />
            <NavigationMenuItem page='/messages' text="Messages" Icon={BiMessageSquareDots} />
            <NavigationMenuItem page='/post' big={true} text="" Icon={BsPlusCircleDotted} />
            <NavigationMenuItem page='/explore' text="Explore" Icon={MdOutlineExplore} />
            <NavigationMenuItem page='/profile' text="Profile" Icon={CgProfile} />
        </div>
    )
}

export default Navigation;