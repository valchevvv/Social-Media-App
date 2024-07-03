import React from 'react'
import { IconType } from 'react-icons'
import { Link, useLocation } from 'react-router-dom'

const NavigationMenuItem = ({ page, big = false, Icon }
    : { page: string, big?: boolean, Icon: IconType }
) => {
    const location = useLocation();
    return (
        <Link to={page} className={`flex flex-col gap-1 justify-center items-center text-white w-full ${(location.pathname == page ? "bg-gray-200 " :"")} bg-opacity-10 rounded-xl`}>
            <Icon className={`${(big ? "text-4xl" : "text-3xl")} ${(location.pathname == page && "text-blue-400")}`} />
        </Link>
    )
}

export default NavigationMenuItem