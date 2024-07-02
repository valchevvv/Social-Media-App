
import { BiMessageSquareDots } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineRssFeed, MdOutlineExplore } from "react-icons/md";
import { BsPlusCircleDotted } from "react-icons/bs";

import { Link } from "react-router-dom";

const Navigation = () => {
    return (
        <div className="bg-gray-800 shadow sm:hidden fixed bottom-0 left-0 w-full h-[60px] text-white flex flex-row ">
            <Link to='/' className="bg-white flex flex-col gap-1 justify-end pb-2 items-center text-white w-full bg-gray-800">
                <MdOutlineRssFeed className="text-2xl" />
                <span className="text-xs">Feed</span>
            </Link>
            <Link to='/' className="bg-white flex flex-col gap-1 justify-end pb-2 items-center text-white w-full bg-gray-800">
                <BiMessageSquareDots className="text-xl" />
                <span className="text-xs">Messages</span>
            </Link>
            <Link to='/' className="bg-white flex flex-col gap-1 justify-center items-center text-white w-full bg-gray-800">
                <BsPlusCircleDotted className="text-4xl" />
            </Link>
            <Link to='/' className="bg-white flex flex-col gap-1 justify-end pb-2 items-center text-white w-full bg-gray-800">
                <MdOutlineExplore className="text-xl" />
                <span className="text-xs">Explore</span>
            </Link>
            <Link to='/' className="bg-white flex flex-col gap-1 justify-end pb-2 items-center text-white w-full bg-gray-800">
                <CgProfile className="text-xl" />
                <span className="text-xs">Profile</span>
            </Link>
        </div>
    )
}

export default Navigation;