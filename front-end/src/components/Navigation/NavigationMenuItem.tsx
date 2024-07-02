import React from 'react'
import { IconType } from 'react-icons'
import { Link, useLocation } from 'react-router-dom'

const NavigationMenuItem = ({ page, big = false, text, Icon }
    : { page: string, big?: boolean, text: string, Icon: IconType }
) => {
    const location = useLocation();
    return (
        <Link to={page} className={`flex flex-col gap-1 justify-${(big ? "center" : "end pb-2")} items-center text-white w-full ${(location.pathname == page ? "bg-gray-700": "bg-gray-800")}`}>
            <Icon className={`${(big ? "text-4xl" : "text-2xl")} ${(location.pathname == page && "text-blue-500")}`} />
            { !big && <span className="text-xs">{text}</span> }
        </Link>
    )
}

export default NavigationMenuItem