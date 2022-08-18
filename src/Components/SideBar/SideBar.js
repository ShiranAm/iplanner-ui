import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

import {SidebarData} from "./SideBarData";
import './Sidebar.css'

function SideBar() {
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

    return (
        <>
            <div className="sidebar">
                <Link to="#" className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar} color='#fff'/>
                </Link>
            </div>
            <nav className={sidebar? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className='navber-toggle'>
                        <Link to='#' className='menu-bars'>
                            <AiIcons.AiOutlineClose color='#fff'/>
                        </Link>
                    </li>
                    {SidebarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cNAme}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span className='sidebar-span'>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </>
    )
}

export default SideBar;
