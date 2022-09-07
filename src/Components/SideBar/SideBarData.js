import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

export const SidebarData = [
    {
        title: 'Home Page',
        path: '/',
        icon: <AiIcons.AiOutlineHome color='#fff'/>,
        cNAme: 'nav-text'
    },
    {
        title: 'Site Data',
        path: '/site-data',
        icon: <AiIcons.AiFillUsb color='#fff'/>,
        cNAme: 'nav-text'
    },
    {
        title: 'Problems',
        path: '/problems',
        icon: <FaIcons.FaTasks color='#fff'/>,
        cNAme: 'nav-text'
    },
    {
        title: 'Solutions',
        path: '/solutions',
        icon: <AiIcons.AiFillSchedule color='#fff'/>,
        cNAme: 'nav-text'
    },
]
