import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChartPie,
    faMapMarkedAlt,
    faHistory,
    faBell,
    faHeadset,
    faCog,
    faChevronLeft,
    faChevronRight,
    faPlus,
    faSun,
    faMoon
} from '@fortawesome/free-solid-svg-icons'

function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const menuItems = [
        {
            title: 'Dashboard',
            path: '/dashboard',
            icon: faChartPie
        },
        {
            title: 'Create Map',
            path: '/create-map',
            icon: faMapMarkedAlt
        },
        {
            title: 'History',
            path: '/history',
            icon: faHistory
        },
        {
            title: 'Alert and Activities',
            path: '/alerts',
            icon: faBell
        },
        {
            title: 'User Support',
            path: '/support',
            icon: faHeadset
        },
        {
            title: 'Settings',
            path: '/settings',
            icon: faCog
        }
    ]

    const isActive = (path) => location.pathname === path

    return (
        <div className={`h-screen bg-white shadow-sm transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">O</span>
                    </div>
                    {!isCollapsed && <span className="text-lg font-medium text-gray-900">Owl</span>}
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <FontAwesomeIcon
                        icon={isCollapsed ? faChevronRight : faChevronLeft}
                        className="text-gray-600"
                    />
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="px-3 py-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(item.path)
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            } ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}`}
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            className={isActive(item.path) ? 'text-white' : 'text-gray-500'}
                        />
                        {!isCollapsed && <span>{item.title}</span>}
                    </button>
                ))}
            </nav>

            
        </div>
    )
}

export default Sidebar