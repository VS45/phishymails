'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
    FiHome,
    FiMail,
    FiBarChart2,
    FiSettings,
    FiLogOut,
    FiShield,
    FiChevronDown,
    FiMenu,
    FiX,
    FiUser,
    FiBell,
    FiSearch,
    FiClock,
    FiAlertTriangle,
    FiCheckCircle,
    FiTrendingUp,
    FiUsers,
    FiFlag,
    FiHelpCircle,
    FiFileText,
    FiDownload,
    FiRefreshCw,
    FiStar
} from 'react-icons/fi';
import { TbMailForward, TbMailOpened, TbMailPause } from 'react-icons/tb';
import { FaSkullCrossbones } from 'react-icons/fa';

export default function AnalyzeLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [expandedMenus, setExpandedMenus] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [stats, setStats] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    // Navigation items for phishing detection system
    const navItems = [
        { 
            id: 'dashboard', 
            name: 'Dashboard', 
            href: '/dashboard', 
            icon: <FiHome size={20} />,
            description: 'Overview & Statistics'
        },
        {
            id: 'analyze',
            name: 'Email Analysis',
            href: '/analyze',
            icon: <FiMail size={20} />,
            description: 'Check emails for threats'
        },
        {
            id: 'threats',
            name: 'Threat Detection',
            icon: <FiAlertTriangle size={20} />,
            subItems: [
                { 
                    id: 'threats-all', 
                    name: 'All Threats', 
                    href: '/threats', 
                    icon: <FaSkullCrossbones size={18} />,
                    badge: stats?.summary?.suspiciousCount || 0
                },
                { 
                    id: 'threats-phishing', 
                    name: 'Phishing', 
                    href: '/threats/phishing', 
                    icon: <FiFlag size={18} /> 
                },
                { 
                    id: 'threats-scams', 
                    name: 'Scams', 
                    href: '/threats/scams', 
                    icon: <FiAlertTriangle size={18} /> 
                },
                { 
                    id: 'threats-suspicious', 
                    name: 'Suspicious', 
                    href: '/threats/suspicious', 
                    icon: <FiClock size={18} /> 
                }
            ]
        },
        {
            id: 'reports',
            name: 'Reports',
            icon: <FiBarChart2 size={20} />,
            subItems: [
                { 
                    id: 'reports-overview', 
                    name: 'Overview Reports', 
                    href: '/reports', 
                    icon: <FiTrendingUp size={18} /> 
                },
                { 
                    id: 'reports-detailed', 
                    name: 'Detailed Analysis', 
                    href: '/reports/detailed', 
                    icon: <FiFileText size={18} /> 
                },
                { 
                    id: 'reports-export', 
                    name: 'Export Data', 
                    href: '/reports/export', 
                    icon: <FiDownload size={18} /> 
                }
            ]
        },
        {
            id: 'users',
            name: 'User Management',
            icon: <FiUsers size={20} />,
            subItems: [
                { 
                    id: 'users-all', 
                    name: 'All Users', 
                    href: '/users', 
                    icon: <FiUsers size={18} /> 
                },
                { 
                    id: 'users-roles', 
                    name: 'Roles & Permissions', 
                    href: '/users/roles', 
                    icon: <FiShield size={18} /> 
                },
                { 
                    id: 'users-activity', 
                    name: 'User Activity', 
                    href: '/users/activity', 
                    icon: <FiClock size={18} /> 
                }
            ]
        },
        { 
            id: 'settings', 
            name: 'Settings', 
            href: '/settings', 
            icon: <FiSettings size={20} />,
            description: 'System Configuration'
        },
        { 
            id: 'help', 
            name: 'Help & Support', 
            href: '/help', 
            icon: <FiHelpCircle size={20} />,
            description: 'Documentation & Support'
        }
    ];

    // Quick actions for the analyze page
    const quickActions = [
        { name: 'New Analysis', href: '/analyze', icon: <FiMail />, color: 'bg-blue-500' },
        { name: 'View Threats', href: '/threats', icon: <FaSkullCrossbones />, color: 'bg-red-500' },
        { name: 'Statistics', href: '/reports', icon: <FiBarChart2 />, color: 'bg-emerald-500' },
        { name: 'Settings', href: '/settings', icon: <FiSettings />, color: 'bg-purple-500' }
    ];

    const toggleSubmenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (!response.ok) {
                router.push('/auth/login');
                return;
            }

            const userData = await response.json();
            setUser(userData.user);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Authentication error. Please login again.');
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        }
    };

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await fetch('/api/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch('/api/stats?period=today');
            if (response.ok) {
                const data = await response.json();
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
        fetchNotifications();
        fetchStats();

        const notificationsInterval = setInterval(fetchNotifications, 2 * 60 * 1000);
        const statsInterval = setInterval(fetchStats, 5 * 60 * 1000);

        return () => {
            clearInterval(notificationsInterval);
            clearInterval(statsInterval);
        };
    }, [fetchNotifications, fetchStats]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/auth/login');
    };

    const isActive = (href) => {
        if (!href) return false;
        return pathname?.startsWith(href) || false;
    };

    const getActiveTitle = () => {
        const item = navItems.find(item =>
            item.href ? isActive(item.href) :
                item.subItems?.some(sub => sub.href && isActive(sub.href))
        );
        return item?.name || 'Email Security';
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-blue-700">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto"></div>
                        <FiShield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-8 h-8" />
                    </div>
                    <p className="mt-4 text-white text-lg">Loading Security Dashboard...</p>
                    <p className="text-blue-200 text-sm mt-2">Verifying credentials</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-blue-700">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-md">
                    <div className="text-center">
                        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <FiAlertTriangle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="animate-pulse text-sm text-gray-500">Redirecting to login...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-2xl relative z-20`}>
                {/* Logo */}
                <div className="p-4 flex items-center justify-between border-b border-blue-700">
                    {sidebarOpen ? (
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <FiShield size={24} className="text-blue-200" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">PhishDetect</h1>
                                <p className="text-blue-300 text-xs">AI Security Platform</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto">
                            <FiShield size={24} className="text-blue-200" />
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                    </button>
                </div>

                {/* Search Bar */}
                {sidebarOpen && (
                    <div className="p-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-blue-800/50 border border-blue-700 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.id} className="mb-1">
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center p-3 rounded-lg transition-all ${
                                            isActive(item.href) 
                                                ? 'bg-blue-700 shadow-lg' 
                                                : 'hover:bg-blue-700/50'
                                        }`}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        {sidebarOpen && (
                                            <div className="flex-1">
                                                <span className="block text-sm font-medium">{item.name}</span>
                                                {item.description && (
                                                    <span className="text-xs text-blue-300">{item.description}</span>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                ) : (
                                    <div>
                                        <button
                                            onClick={() => toggleSubmenu(item.id)}
                                            className={`flex items-center w-full p-3 rounded-lg transition-all ${
                                                item.subItems?.some(sub => sub.href && isActive(sub.href))
                                                    ? 'bg-blue-700 shadow-lg'
                                                    : 'hover:bg-blue-700/50'
                                            }`}
                                        >
                                            <span className="mr-3">{item.icon}</span>
                                            {sidebarOpen && (
                                                <>
                                                    <span className="flex-1 text-left text-sm font-medium">{item.name}</span>
                                                    <FiChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-200 ${
                                                            expandedMenus[item.id] ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </>
                                            )}
                                        </button>
                                        
                                        {sidebarOpen && expandedMenus[item.id] && item.subItems && (
                                            <ul className="ml-6 mt-1 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <li key={subItem.id}>
                                                        <Link
                                                            href={subItem.href}
                                                            className={`flex items-center p-2 rounded-lg text-sm transition-all ${
                                                                isActive(subItem.href)
                                                                    ? 'bg-blue-600 shadow'
                                                                    : 'hover:bg-blue-700/50'
                                                            }`}
                                                        >
                                                            <span className="mr-2">{subItem.icon}</span>
                                                            <span className="flex-1">{subItem.name}</span>
                                                            {subItem.badge > 0 && (
                                                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                                                    {subItem.badge}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Quick Stats */}
                {sidebarOpen && stats && (
                    <div className="p-4 border-t border-blue-700">
                        <div className="bg-blue-800/50 rounded-lg p-3">
                            <div className="flex items-center justify-between text-xs text-blue-300 mb-2">
                                <span>Today's Threats</span>
                                <span className="font-bold text-white">{stats.summary?.suspiciousCount || 0}</span>
                            </div>
                            <div className="w-full bg-blue-900 rounded-full h-1.5">
                                <div 
                                    className="bg-red-500 h-1.5 rounded-full" 
                                    style={{ width: `${stats.summary?.threatScore || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Profile */}
                <div className="p-4 border-t border-blue-700">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-semibold text-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        {sidebarOpen && (
                            <div className="ml-3 flex-1">
                                <p className="font-medium text-sm">{user?.name}</p>
                                <p className="text-xs text-blue-300">Security Analyst</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`mt-3 flex items-center w-full p-2 rounded-lg hover:bg-red-600/80 transition-colors ${
                            sidebarOpen ? 'justify-start' : 'justify-center'
                        }`}
                    >
                        <FiLogOut size={18} />
                        {sidebarOpen && <span className="ml-2 text-sm">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
                    <div className="px-6 py-3">
                        <div className="flex items-center justify-between">
                            {/* Breadcrumb */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <FiShield className="mr-2 text-blue-600" />
                                    {getActiveTitle()}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {pathname === '/analyze' ? 'Email Analysis & Threat Detection' : pathname}
                                </p>
                            </div>

                            {/* Header Actions */}
                            <div className="flex items-center space-x-4">
                                {/* Quick Actions */}
                                <div className="hidden md:flex items-center space-x-2">
                                    {quickActions.map((action, index) => (
                                        <Link
                                            key={index}
                                            href={action.href}
                                            className={`p-2 ${action.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
                                            title={action.name}
                                        >
                                            {action.icon}
                                        </Link>
                                    ))}
                                </div>

                                {/* Search */}
                                <div className="hidden md:block">
                                    <div className="relative">
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search emails..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                                        />
                                    </div>
                                </div>

                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FiBell size={20} />
                                        {unreadNotifications > 0 && (
                                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                {unreadNotifications}
                                            </span>
                                        )}
                                    </button>

                                    {/* Notifications Dropdown */}
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                            <div className="p-3 border-b border-gray-200">
                                                <h3 className="font-semibold text-gray-800">Notifications</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification, index) => (
                                                        <div
                                                            key={index}
                                                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                                                !notification.read ? 'bg-blue-50' : ''
                                                            }`}
                                                        >
                                                            <p className="text-sm text-gray-800">{notification.message}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-gray-500 text-sm">
                                                        No notifications
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* User Menu */}
                                <div className="flex items-center space-x-3">
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                                        <span className="text-white font-semibold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 px-6 py-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                            <span>© 2024 PhishDetect AI Security Platform</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>v2.1.0</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
                            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
                            <Link href="/help" className="hover:text-blue-600 transition-colors">Help</Link>
                            <button 
                                onClick={fetchStats}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Refresh stats"
                            >
                                <FiRefreshCw size={14} />
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}