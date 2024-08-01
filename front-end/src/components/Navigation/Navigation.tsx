
import { BiMessageSquareDots } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineRssFeed, MdOutlineExplore } from "react-icons/md";
import { BsPlusCircleDotted } from "react-icons/bs";
import NavigationMenuItem from "./NavigationMenuItem";
import { useLocation } from "react-router-dom";

const Navigation = () => {
    const { pathname: location } = useLocation();

    const isHidden = location.includes("/messages")

    return (
        <>
            {
                !isHidden &&
                <div className="bg-gray-800 z-50 shadow laptop:hidden fixed bottom-5 left-[50%] p-2 translate-x-[-50%] w-[80%] h-[60px] text-white flex flex-row justify-center rounded-full backdrop-blur bg-opacity-60">
                    <NavigationMenuItem page='/' Icon={MdOutlineRssFeed} />
                    <NavigationMenuItem page='/messages' Icon={BiMessageSquareDots} />
                    <NavigationMenuItem page='/post' big={true} Icon={BsPlusCircleDotted} />
                    <NavigationMenuItem page='/explore' Icon={MdOutlineExplore} />
                    <NavigationMenuItem page='/profile' Icon={CgProfile} />
                </div>
            }
        </>
    )
}

export default Navigation;