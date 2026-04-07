'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiMail,
    FiSend,
    FiAlertTriangle,
    FiCheckCircle,
    FiShield,
    FiClock,
    FiLink,
    FiFileText,
    FiUser,
    FiCalendar,
    FiFlag,
    FiBarChart2,
    FiRefreshCw,
    FiDownload,
    FiShare2,
    FiCopy,
    FiCheck,
    FiX,
    FiInfo,
    FiAlertOctagon,
    FiLock,
    FiGlobe,
    FiPaperclip,
    FiEye,
    FiEyeOff,
    FiChevronDown,
    FiChevronUp,
    FiSearch,
    FiFilter,
    FiStar,
    FiTrash2,
    FiArchive,
    FiBell,
    FiBellOff,
    FiTrendingUp,
    FiTrendingDown
} from 'react-icons/fi';
import {
    FaPhp,
    FaSkullCrossbones,
    FaExclamationTriangle,
    FaBan,
    FaCheckCircle
} from 'react-icons/fa';
import { TbMailForward, TbMailOpened, TbMailPause } from 'react-icons/tb';
import { BiMessageAltDetail, BiLinkExternal } from 'react-icons/bi';

export default function AnalyzePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');
    const [showDetails, setShowDetails] = useState({});
    const [recentAnalyses, setRecentAnalyses] = useState([]);
    const [fetchingRecent, setFetchingRecent] = useState(true);
    const [stats, setStats] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        links: true,
        reasons: true,
        headers: false,
        attachments: false
    });

    const [formData, setFormData] = useState({
        sender: '',
        recipient: '',
        subject: '',
        body: '',
        includeHeaders: false,
        headers: '',
        checkLinks: true,
        deepScan: false
    });

    // Fetch recent analyses and stats on mount
    useEffect(() => {
        fetchRecentAnalyses();
        fetchStats();
    }, []);

    const fetchRecentAnalyses = async () => {
        setFetchingRecent(true);
        try {
            const response = await fetch('/api/analyze?limit=5');
            if (response.ok) {
                const data = await response.json();
                setRecentAnalyses(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching recent analyses:', error);
        } finally {
            setFetchingRecent(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/stats?period=week');
            if (response.ok) {
                const data = await response.json();
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setAnalysisResult(null);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setAnalysisResult(data.data);
                // Refresh recent analyses
                fetchRecentAnalyses();
                fetchStats();
            } else {
                setError(data.error || 'Analysis failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Analysis error:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const toggleDetails = (id) => {
        setShowDetails(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    const getStatusColor = (status) => {
        const colors = {
            safe: 'text-emerald-600 bg-emerald-50 border-emerald-200',
            suspicious: 'text-yellow-600 bg-yellow-50 border-yellow-200',
            phishing: 'text-red-600 bg-red-50 border-red-200',
            scam: 'text-red-600 bg-red-50 border-red-200',
            pending: 'text-gray-600 bg-gray-50 border-gray-200'
        };
        return colors[status] || colors.pending;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'safe':
                return <FiCheckCircle className="w-5 h-5" />;
            case 'suspicious':
                return <FiAlertTriangle className="w-5 h-5" />;
            case 'phishing':
            case 'scam':
                return <FaSkullCrossbones className="w-5 h-5" />;
            default:
                return <FiClock className="w-5 h-5" />;
        }
    };

    const getSeverityBadge = (severity) => {
        const colors = {
            low: 'bg-blue-100 text-blue-700 border-blue-200',
            medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            high: 'bg-orange-100 text-orange-700 border-orange-200',
            critical: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[severity] || colors.medium;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <FiShield className="mr-3 text-blue-600" />
                                Phishing Email Detector
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Analyze emails for phishing attempts, scams, and suspicious content using AI
                            </p>
                        </div>

                        {/* Quick Stats */}
                        {stats && (
                            <div className="flex space-x-3">
                                <div className="bg-white rounded-lg shadow-sm px-4 py-2 border border-gray-200">
                                    <p className="text-xs text-gray-500">Today's Threats</p>
                                    <p className="text-xl font-bold text-red-600">{stats.summary?.suspiciousCount || 0}</p>
                                </div>
                                <div className="bg-white rounded-lg shadow-sm px-4 py-2 border border-gray-200">
                                    <p className="text-xs text-gray-500">Detection Rate</p>
                                    <p className="text-xl font-bold text-emerald-600">{stats.summary?.threatScore || 0}%</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Analysis Form - Left Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-blue-800">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FiMail className="mr-2" />
                                    Email Analysis
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
                                        <p className="text-sm flex items-center">
                                            <FiAlertOctagon className="mr-2" />
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {/* Sender */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sender Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                required
                                                value={formData.sender}
                                                onChange={(e) => handleInputChange('sender', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="sender@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Recipient */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Recipient Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                required
                                                value={formData.recipient}
                                                onChange={(e) => handleInputChange('recipient', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="recipient@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.subject}
                                            onChange={(e) => handleInputChange('subject', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Email subject"
                                        />
                                    </div>

                                    {/* Body */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Body <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows="8"
                                            value={formData.body}
                                            onChange={(e) => handleInputChange('body', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                            placeholder="Paste the email content here..."
                                        />
                                    </div>

                                    {/* Advanced Options */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <button
                                            type="button"
                                            onClick={() => toggleSection('headers')}
                                            className="flex items-center justify-between w-full"
                                        >
                                            <span className="text-sm font-medium text-gray-700">Advanced Options</span>
                                            {expandedSections.headers ? (
                                                <FiChevronUp className="text-gray-500" />
                                            ) : (
                                                <FiChevronDown className="text-gray-500" />
                                            )}
                                        </button>

                                        {expandedSections.headers && (
                                            <div className="mt-4 space-y-3">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="includeHeaders"
                                                        checked={formData.includeHeaders}
                                                        onChange={(e) => handleInputChange('includeHeaders', e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="includeHeaders" className="ml-2 text-sm text-gray-700">
                                                        Include Email Headers
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="checkLinks"
                                                        checked={formData.checkLinks}
                                                        onChange={(e) => handleInputChange('checkLinks', e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="checkLinks" className="ml-2 text-sm text-gray-700">
                                                        Deep Link Analysis
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="deepScan"
                                                        checked={formData.deepScan}
                                                        onChange={(e) => handleInputChange('deepScan', e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="deepScan" className="ml-2 text-sm text-gray-700">
                                                        Deep Scan (Slower but more thorough)
                                                    </label>
                                                </div>

                                                {formData.includeHeaders && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Email Headers
                                                        </label>
                                                        <textarea
                                                            rows="4"
                                                            value={formData.headers}
                                                            onChange={(e) => handleInputChange('headers', e.target.value)}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                                                            placeholder="Paste email headers here..."
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <FiRefreshCw className="animate-spin mr-2" />
                                                Analyzing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <FiShield className="mr-2" />
                                                Analyze Email
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Analysis Results */}
                        {analysisResult && (
                            <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-blue-800">
                                    <h2 className="text-lg font-semibold text-white flex items-center">
                                        <FiBarChart2 className="mr-2" />
                                        Analysis Results
                                    </h2>
                                </div>

                                <div className="p-6">
                                    {/* Status Banner */}
                                    <div className={`mb-6 p-4 rounded-lg border-2 ${getStatusColor(analysisResult.status)}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {getStatusIcon(analysisResult.status)}
                                                <div>
                                                    <h3 className="font-semibold text-lg capitalize">
                                                        {analysisResult.status} Email Detected
                                                    </h3>
                                                    <p className="text-sm opacity-90">
                                                        Confidence Score: {analysisResult.confidenceScore}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => copyToClipboard(JSON.stringify(analysisResult, null, 2))}
                                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                                    title="Copy results"
                                                >
                                                    <FiCopy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {/* Share functionality */}}
                                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                                    title="Share"
                                                >
                                                    <FiShare2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {/* Download functionality */}}
                                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                                    title="Download report"
                                                >
                                                    <FiDownload className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mt-3 relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div>
                                                    <span className="text-xs font-semibold inline-block">
                                                        Threat Level
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-semibold inline-block">
                                                        {analysisResult.confidenceScore}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                <div
                                                    style={{ width: `${analysisResult.confidenceScore}%` }}
                                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                                        analysisResult.confidenceScore >= 70 ? 'bg-red-500' :
                                                        analysisResult.confidenceScore >= 40 ? 'bg-yellow-500' :
                                                        'bg-emerald-500'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detection Reasons */}
                                    {analysisResult.detectionReasons?.length > 0 && (
                                        <div className="mb-6">
                                            <button
                                                onClick={() => toggleSection('reasons')}
                                                className="flex items-center justify-between w-full mb-3"
                                            >
                                                <h3 className="font-semibold text-gray-900 flex items-center">
                                                    <FiFlag className="mr-2 text-blue-600" />
                                                    Detection Reasons
                                                </h3>
                                                {expandedSections.reasons ? (
                                                    <FiChevronUp className="text-gray-500" />
                                                ) : (
                                                    <FiChevronDown className="text-gray-500" />
                                                )}
                                            </button>

                                            {expandedSections.reasons && (
                                                <div className="space-y-3">
                                                    {analysisResult.detectionReasons.map((reason, index) => (
                                                        <div
                                                            key={index}
                                                            className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {reason.reason}
                                                                    </p>
                                                                    {reason.details && (
                                                                        <p className="text-xs text-gray-600 mt-1">
                                                                            Details: {Array.isArray(reason.details) 
                                                                                ? reason.details.join(', ') 
                                                                                : reason.details}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <span className={`ml-4 px-2 py-1 text-xs rounded-full ${getSeverityBadge(reason.severity)}`}>
                                                                    {reason.severity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Links Found */}
                                    {analysisResult.links?.length > 0 && (
                                        <div className="mb-6">
                                            <button
                                                onClick={() => toggleSection('links')}
                                                className="flex items-center justify-between w-full mb-3"
                                            >
                                                <h3 className="font-semibold text-gray-900 flex items-center">
                                                    <FiLink className="mr-2 text-blue-600" />
                                                    Links Found ({analysisResult.links.length})
                                                </h3>
                                                {expandedSections.links ? (
                                                    <FiChevronUp className="text-gray-500" />
                                                ) : (
                                                    <FiChevronDown className="text-gray-500" />
                                                )}
                                            </button>

                                            {expandedSections.links && (
                                                <div className="space-y-2">
                                                    {analysisResult.links.map((link, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <div className="flex-1">
                                                                <p className="text-sm font-mono truncate max-w-md">
                                                                    {link.url}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Domain: {link.domain}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                                    link.threatLevel === 'malicious' ? 'bg-red-100 text-red-700' :
                                                                    link.threatLevel === 'suspicious' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-emerald-100 text-emerald-700'
                                                                }`}>
                                                                    {link.threatLevel}
                                                                </span>
                                                                <a
                                                                    href={link.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-1 hover:bg-gray-200 rounded"
                                                                >
                                                                    <BiLinkExternal className="w-4 h-4 text-gray-500" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Metadata */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-gray-500">Analyzed</p>
                                            <p className="font-medium">{formatDate(analysisResult.analyzedAt)}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-gray-500">Analysis ID</p>
                                            <p className="font-medium font-mono text-xs">
                                                {analysisResult._id?.slice(-8)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Recent Analyses & Stats */}
                    <div className="space-y-6">
                        {/* Quick Tips */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden border border-blue-100">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-blue-800">
                                <h3 className="text-md font-semibold text-white flex items-center">
                                    <FiInfo className="mr-2" />
                                    Phishing Detection Tips
                                </h3>
                            </div>
                            <div className="p-4">
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start">
                                        <FiCheckCircle className="w-4 h-4 text-emerald-500 mr-2 mt-0.5" />
                                        <span className="text-gray-700">Check sender email domain carefully</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiAlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                                        <span className="text-gray-700">Look for urgent language demanding action</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaBan className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                                        <span className="text-gray-700">Never click suspicious links</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiLock className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                                        <span className="text-gray-700">Legitimate companies don't ask for passwords</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Recent Analyses */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-blue-800">
                                <h3 className="text-md font-semibold text-white flex items-center">
                                    <FiClock className="mr-2" />
                                    Recent Analyses
                                </h3>
                            </div>
                            <div className="p-4">
                                {fetchingRecent ? (
                                    <div className="flex justify-center py-8">
                                        <FiRefreshCw className="animate-spin text-gray-400" />
                                    </div>
                                ) : recentAnalyses.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentAnalyses.map((item, index) => (
                                            <div
                                                key={item._id || index}
                                                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => setAnalysisResult(item)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        item.status === 'safe' ? 'bg-emerald-100 text-emerald-700' :
                                                        item.status === 'suspicious' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {item.confidenceScore}%
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium truncate">{item.subject}</p>
                                                <p className="text-xs text-gray-500 mt-1">{item.sender}</p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {formatDate(item.createdAt)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-4 text-sm">
                                        No recent analyses
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Threat Statistics */}
                        {stats && (
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-blue-800">
                                    <h3 className="text-md font-semibold text-white flex items-center">
                                        <FiTrendingUp className="mr-2" />
                                        Threat Statistics
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Safe Emails</span>
                                            <span className="text-sm font-semibold text-emerald-600">
                                                {stats.summary?.safeCount || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Suspicious</span>
                                            <span className="text-sm font-semibold text-yellow-600">
                                                {stats.summary?.suspicious?.count || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Threats Detected</span>
                                            <span className="text-sm font-semibold text-red-600">
                                                {stats.summary?.suspiciousCount || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Detection Rate</span>
                                            <span className="text-sm font-semibold text-blue-600">
                                                {stats.summary?.threatScore || 0}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Top Detection Reasons */}
                                    {stats.topReasons?.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                                                Top Threats
                                            </h4>
                                            <div className="space-y-2">
                                                {stats.topReasons.slice(0, 3).map((reason, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-600 capitalize">
                                                            {reason.category.replace(/_/g, ' ')}
                                                        </span>
                                                        <span className="text-xs font-medium">
                                                            {reason.count}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}