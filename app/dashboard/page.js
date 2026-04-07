'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiHome,
    FiMail,
    FiAlertTriangle,
    FiCheckCircle,
    FiShield,
    FiClock,
    FiTrendingUp,
    FiTrendingDown,
    FiBarChart2,
    FiUsers,
    FiFlag,
    FiDownload,
    FiRefreshCw,
    FiEye,
    FiEyeOff,
    FiSearch,
    FiFilter,
    FiStar,
    FiCalendar,
    FiPieChart,
    FiActivity,
    FiTarget,
    FiAward,
    FiBell,
    FiBellOff,
    FiThumbsUp,
    FiThumbsDown,
    FiHelpCircle,
    FiInfo,
    FiLock,
    FiUnlock,
    FiGlobe,
    FiMapPin
} from 'react-icons/fi';
import {
    FaSkullCrossbones,
    FaExclamationTriangle,
    FaCheckCircle,
    FaBan,
    FaEnvelopeOpenText,
    FaEnvelope,
    FaEnvelopeOpen,
    FaSpider,
    FaVirus,
    FaShieldAlt,
    FaChartLine,
    FaChartPie,
    FaChartBar
} from 'react-icons/fa';
import { TbMailForward, TbMailOpened, TbMailPause } from 'react-icons/tb';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

export default function DashboardPage() {
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week');
    const [showDetails, setShowDetails] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchUserData();
        fetchDashboardData();
    }, [timeRange]);

    const fetchUserData = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                router.push('/auth/login');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/dashboard?period=${timeRange}`);
            if (res.ok) {
                const data = await res.json();
                setDashboardData(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setRefreshing(false);
    };

    const getRoleBasedContent = () => {
        if (!user || !dashboardData) return null;

        switch (user.role) {
            case 'admin':
                return <AdminDashboard data={dashboardData} timeRange={timeRange} />;
            case 'security_analyst':
                return <SecurityAnalystDashboard data={dashboardData} timeRange={timeRange} />;
            case 'user':
                return <UserDashboard data={dashboardData} timeRange={timeRange} />;
            default:
                return <DefaultDashboard data={dashboardData} timeRange={timeRange} />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                        <FiShield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 w-8 h-8" />
                    </div>
                    <p className="mt-4 text-gray-600">Loading security dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FiShield className="mr-2 text-blue-600" />
                        Security Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Real-time email threat detection and analysis
                    </p>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    {/* Time Range Selector */}
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">Last 3 Months</option>
                        <option value="year">This Year</option>
                    </select>

                    {/* Refresh Button */}
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <FiRefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>

                    {/* User Badge */}
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg">
                        <FiShield className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Role-based Dashboard Content */}
            {getRoleBasedContent()}
        </div>
    );
}

// Admin Dashboard - Full Access
function AdminDashboard({ data, timeRange }) {
    const overviewCards = [
        {
            title: 'Total Emails',
            value: data?.overview?.totalEmails?.toLocaleString() || '0',
            icon: <FiMail className="text-blue-600" size={24} />,
            color: 'bg-blue-50 border-blue-200',
            trend: '+12.5%',
            trendUp: true
        },
        {
            title: 'Threats Detected',
            value: data?.overview?.threatsDetected?.toLocaleString() || '0',
            icon: <FaSkullCrossbones className="text-red-600" size={24} />,
            color: 'bg-red-50 border-red-200',
            trend: '+5.2%',
            trendUp: true
        },
        {
            title: 'Safe Emails',
            value: data?.overview?.safeEmails?.toLocaleString() || '0',
            icon: <FiCheckCircle className="text-green-600" size={24} />,
            color: 'bg-green-50 border-green-200',
            trend: '+8.3%',
            trendUp: true
        },
        {
            title: 'Detection Rate',
            value: `${data?.overview?.detectionRate || 0}%`,
            icon: <FiTarget className="text-purple-600" size={24} />,
            color: 'bg-purple-50 border-purple-200',
            trend: '+2.1%',
            trendUp: true
        },
        {
            title: 'Active Users',
            value: data?.overview?.activeUsers?.toLocaleString() || '0',
            icon: <FiUsers className="text-orange-600" size={24} />,
            color: 'bg-orange-50 border-orange-200',
            trend: '+18',
            trendUp: true
        },
        {
            title: 'Avg Confidence',
            value: `${data?.overview?.avgConfidence || 0}%`,
            icon: <FiActivity className="text-indigo-600" size={24} />,
            color: 'bg-indigo-50 border-indigo-200',
            trend: '-3.2%',
            trendUp: false
        },
    ];

    // Chart Data
    const threatTrendData = {
        labels: data?.trends?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Phishing',
                data: data?.trends?.phishing || [65, 72, 80, 78, 85, 90, 95],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Suspicious',
                data: data?.trends?.suspicious || [45, 52, 48, 55, 60, 58, 62],
                borderColor: 'rgb(245, 158, 11)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Safe',
                data: data?.trends?.safe || [120, 135, 142, 138, 150, 155, 160],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const threatTypeData = {
        labels: ['Phishing', 'Scams', 'Suspicious', 'Spam', 'Malware'],
        datasets: [
            {
                data: data?.threatTypes || [35, 25, 20, 15, 5],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                ],
                borderWidth: 0
            }
        ]
    };

    const detectionReasonsData = {
        labels: data?.topReasons?.map(r => r.category) || [],
        datasets: [
            {
                label: 'Occurrences',
                data: data?.topReasons?.map(r => r.count) || [],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 6
            }
        ]
    };

    return (
        <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {overviewCards.map((card, index) => (
                    <div
                        key={index}
                        className={`${card.color} border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-white rounded-lg">
                                {card.icon}
                            </div>
                            <div className={`flex items-center text-xs ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                {card.trendUp ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                                {card.trend}
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                        <p className="text-xs text-gray-600 mt-1">{card.title}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Threat Trend Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <FaChartLine className="mr-2 text-blue-600" />
                            Threat Trends
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {timeRange === 'today' ? 'Hourly' : 'Daily'} Trends
                        </span>
                    </div>
                    <div className="h-64">
                        <Line 
                            data={threatTrendData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>

                {/* Threat Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <FaChartPie className="mr-2 text-blue-600" />
                            Threat Distribution
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            By Type
                        </span>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                        <Pie 
                            data={threatTypeData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detection Reasons */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <FiFlag className="mr-2 text-blue-600" />
                            Top Detection Reasons
                        </h3>
                        <Link href="/reasons" className="text-sm text-blue-600 hover:text-blue-800">
                            View All
                        </Link>
                    </div>
                    <div className="h-64">
                        <Bar 
                            data={detectionReasonsData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                indexAxis: 'y',
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>

                {/* Recent Alerts */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <FiBell className="mr-2 text-blue-600" />
                            Recent Alerts
                        </h3>
                        <Link href="/alerts" className="text-sm text-blue-600 hover:text-blue-800">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {data?.recentAlerts?.map((alert, index) => (
                            <div key={index} className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                                <div className={`p-2 rounded-full mr-3 ${
                                    alert.severity === 'critical' ? 'bg-red-100' :
                                    alert.severity === 'high' ? 'bg-orange-100' :
                                    alert.severity === 'medium' ? 'bg-yellow-100' :
                                    'bg-blue-100'
                                }`}>
                                    {alert.severity === 'critical' ? <FaSkullCrossbones className="text-red-600" /> :
                                     alert.severity === 'high' ? <FiAlertTriangle className="text-orange-600" /> :
                                     alert.severity === 'medium' ? <FiClock className="text-yellow-600" /> :
                                     <FiInfo className="text-blue-600" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{alert.title}</p>
                                    <p className="text-xs text-gray-500">{alert.time}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                    alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {alert.severity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Threats */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <FaSkullCrossbones className="mr-2 text-red-600" />
                            Recent Threats
                        </h3>
                        <Link href="/threats" className="text-sm text-blue-600 hover:text-blue-800">
                            View All
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data?.recentThreats?.map((threat) => (
                                    <tr key={threat._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <div className="font-medium">{threat.subject}</div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {threat.sender}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                threat.type === 'phishing' ? 'bg-red-100 text-red-800' :
                                                threat.type === 'scam' ? 'bg-orange-100 text-orange-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {threat.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium mr-2">{threat.confidenceScore}%</span>
                                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                    <div 
                                                        className={`h-1.5 rounded-full ${
                                                            threat.confidenceScore >= 70 ? 'bg-red-600' :
                                                            threat.confidenceScore >= 40 ? 'bg-yellow-600' :
                                                            'bg-green-600'
                                                        }`}
                                                        style={{ width: `${threat.confidenceScore}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <Link 
                                                href={`/analyze/${threat._id}`}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Senders */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <FiGlobe className="mr-2 text-blue-600" />
                            Top Suspicious Senders
                        </h3>
                        <Link href="/senders" className="text-sm text-blue-600 hover:text-blue-800">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {data?.topSenders?.map((sender, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                        <FiAlertTriangle className="w-4 h-4 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{sender.email}</p>
                                        <p className="text-xs text-gray-500">{sender.domain}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{sender.count}</p>
                                    <p className="text-xs text-gray-500">threats</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                        <FiActivity className="mr-2 text-blue-600" />
                        Security Activity Timeline
                    </h3>
                    <Link href="/activity" className="text-sm text-blue-600 hover:text-blue-800">
                        View All
                    </Link>
                </div>
                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-4 ml-8">
                        {data?.timeline?.map((event, index) => (
                            <div key={index} className="relative">
                                <div className={`absolute -left-8 mt-1.5 w-4 h-4 rounded-full ${
                                    event.type === 'threat' ? 'bg-red-500' :
                                    event.type === 'analysis' ? 'bg-blue-500' :
                                    'bg-green-500'
                                }`}></div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-sm">{event.description}</p>
                                        <span className="text-xs text-gray-500">{event.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">{event.details}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

// Security Analyst Dashboard - Detailed Analysis Focus
function SecurityAnalystDashboard({ data, timeRange }) {
    return (
        <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending Review</p>
                            <p className="text-2xl font-bold text-gray-800">{data?.pendingReview || 23}</p>
                        </div>
                        <FiClock className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Critical Alerts</p>
                            <p className="text-2xl font-bold text-red-600">{data?.criticalAlerts || 7}</p>
                        </div>
                        <FiAlertTriangle className="w-8 h-8 text-yellow-600" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Analyzed Today</p>
                            <p className="text-2xl font-bold text-gray-800">{data?.analyzedToday || 156}</p>
                        </div>
                        <FiCheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Accuracy Rate</p>
                            <p className="text-2xl font-bold text-gray-800">{data?.accuracyRate || 98.5}%</p>
                        </div>
                        <FiTarget className="w-8 h-8 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Analysis Queue */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FiMail className="mr-2 text-blue-600" />
                    Pending Analysis Queue
                </h3>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                                    <FiClock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Suspicious email from unknown sender</p>
                                    <p className="text-xs text-gray-500">from: security-alert@paypa1.com • 5 min ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Priority: High</span>
                                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                    Analyze
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Threat Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Emerging Threats</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="p-3 border-l-4 border-red-500 bg-red-50 rounded">
                                <p className="font-medium text-sm">New Phishing Campaign Detected</p>
                                <p className="text-xs text-gray-600 mt-1">Targeting financial institutions • 2,345 emails blocked</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Threat Intelligence Feed</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-start p-2 border-b">
                                <FiShield className="mr-2 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-sm">New IOC detected: malicious domain pool-update.com</p>
                                    <p className="text-xs text-gray-500">5 min ago • Confidence: 95%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

// Regular User Dashboard - Personal View
function UserDashboard({ data, timeRange }) {
    const [emailInput, setEmailInput] = useState('');

    const personalStats = [
        {
            title: 'Emails Checked',
            value: data?.personal?.emailsChecked || 47,
            icon: <FiMail className="text-blue-600" />,
            color: 'bg-blue-100'
        },
        {
            title: 'Threats Found',
            value: data?.personal?.threatsFound || 12,
            icon: <FaSkullCrossbones className="text-red-600" />,
            color: 'bg-red-100'
        },
        {
            title: 'Safe Emails',
            value: data?.personal?.safeEmails || 35,
            icon: <FiCheckCircle className="text-green-600" />,
            color: 'bg-green-100'
        },
        {
            title: 'Security Score',
            value: `${data?.personal?.securityScore || 85}%`,
            icon: <FiAward className="text-purple-600" />,
            color: 'bg-purple-100'
        }
    ];

    return (
        <>
            {/* Quick Analysis */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Quick Email Analysis</h2>
                <p className="text-blue-200 mb-4">Paste an email to check for threats instantly</p>
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Paste email content or forward to check@phishdetect.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button className="px-6 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center">
                        <FiShield className="mr-2" />
                        Analyze Now
                    </button>
                </div>
            </div>

            {/* Personal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {personalStats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 ${stat.color} rounded-lg`}>
                                {stat.icon}
                            </div>
                            <FiTrendingUp className="text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Recent Checks */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FiClock className="mr-2 text-blue-600" />
                    Recent Email Checks
                </h3>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                                    item % 3 === 0 ? 'bg-red-100' : 
                                    item % 3 === 1 ? 'bg-yellow-100' : 
                                    'bg-green-100'
                                }`}>
                                    {item % 3 === 0 ? <FaSkullCrossbones className="w-5 h-5 text-red-600" /> :
                                     item % 3 === 1 ? <FiAlertTriangle className="w-5 h-5 text-yellow-600" /> :
                                     <FiCheckCircle className="w-5 h-5 text-green-600" />}
                                </div>
                                <div>
                                    <p className="font-medium">Email from {item % 3 === 0 ? 'security@paypal-update.com' : 
                                                                     item % 3 === 1 ? 'newsletter@marketing.io' : 
                                                                     'contact@company.com'}</p>
                                    <p className="text-xs text-gray-500">Subject: {item % 3 === 0 ? 'Urgent: Account Suspended' : 
                                                                                 item % 3 === 1 ? 'Special Offer Inside' : 
                                                                                 'Meeting Confirmation'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-sm font-medium ${
                                    item % 3 === 0 ? 'text-red-600' : 
                                    item % 3 === 1 ? 'text-yellow-600' : 
                                    'text-green-600'
                                }`}>
                                    {item % 3 === 0 ? 'Phishing' : 
                                     item % 3 === 1 ? 'Suspicious' : 
                                     'Safe'}
                                </span>
                                <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security Tips */}
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <FiShield className="mr-2" />
                    Security Tip of the Day
                </h4>
                <p className="text-blue-700 text-sm">
                    Always verify the sender's email address carefully. Phishing emails often use 
                    addresses that look similar to legitimate ones (e.g., @paypa1.com instead of @paypal.com).
                </p>
            </div>
        </>
    );
}

// Default Dashboard
function DefaultDashboard({ data, timeRange }) {
    return (
        <div className="text-center py-12">
            <FiShield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to PhishDetect</h3>
            <p className="text-gray-600 mb-6">
                Start analyzing emails to protect yourself from phishing attacks
            </p>
            <Link
                href="/analyze"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                <FiMail className="mr-2" />
                Analyze First Email
            </Link>
        </div>
    );
}