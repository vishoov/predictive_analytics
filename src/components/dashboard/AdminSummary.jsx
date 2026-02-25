import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../utils/analytics.utils';

const AdminSummary = () => {
    const [stats, setStats] = useState({
        totalPatients:    0,
        totalTests:       0,
        pendingReviews:   0,
        needsReviewCount: 0,
        growthPercentage: 0
    });
    const [recentTests, setRecentTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [statsResponse, recentTestsResponse] = await Promise.all([
                    dashboardAPI.getStats(),
                    dashboardAPI.getRecentTests(4)
                ]);

                if (isMounted) {
                    setStats(statsResponse.data);
                    setRecentTests(recentTestsResponse.data);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                if (isMounted) {
                    setError(err.response?.data?.message || 'Failed to load dashboard data');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDashboardData();
        return () => { isMounted = false; };
    }, []);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60)    return 'Just now';
        if (seconds < 3600)  return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    };

    // Verified = totalTests - pendingReviews - needsReviewCount
    const verifiedCount = stats.totalTests - stats.pendingReviews - (stats.needsReviewCount ?? 0);
    const completionRate = stats.totalTests > 0
        ? ((verifiedCount / stats.totalTests) * 100).toFixed(1)
        : 0;

    // Status badge config for the new status string
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Verified':     return 'bg-green-100 text-green-700';
            case 'Needs Review': return 'bg-blue-100 text-blue-700';
            case 'Rejected':     return 'bg-red-100 text-red-700';
            default:             return 'bg-yellow-100 text-yellow-700'; // Pending
        }
    };

    // ── Skeleton ──────────────────────────────────────────────────────────────
    const SkeletonCard = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                    <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            </div>
        </div>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* ── Welcome ── */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Urodynamics Reports Verification Portal</h1>
                <p className="text-blue-100 text-sm md:text-base">
                    Welcome back, Doc! Here’s a quick overview of the latest stats and activity. Click on any card for more details or use the quick actions below to manage reports and users.
                </p>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg" role="alert">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {loading ? (
                    <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
                ) : (
                    <>
                        {/* Total Patients */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {stats.totalPatients.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Unique patients
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Total Tests */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Tests</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {stats.totalTests.toLocaleString()}
                                    </p>
                                    <p className={`text-xs mt-1 flex items-center ${
                                        stats.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d={stats.growthPercentage >= 0
                                                    ? "M5 10l7-7m0 0l7 7m-7-7v18"
                                                    : "M19 14l-7 7m0 0l-7-7m7 7V3"}
                                            />
                                        </svg>
                                        {stats.growthPercentage >= 0 ? '+' : ''}{stats.growthPercentage}% from last month
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Pending + Needs Review — combined attention card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {stats.pendingReviews + (stats.needsReviewCount ?? 0)}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-yellow-600 font-medium">
                                            {stats.pendingReviews} pending
                                        </span>
                                        <span className="text-gray-300">·</span>
                                        <span className="text-xs text-blue-600 font-medium">
                                            {stats.needsReviewCount ?? 0} in review
                                        </span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Completion Rate */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{completionRate}%</p>
                                    <p className="text-xs text-green-600 mt-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {verifiedCount} verified reports
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ── Recent Activity + Quick Actions ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Tests */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
                        <button
                            onClick={() => window.location.href = '/admin-dashboard/reports'}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 animate-pulse">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                                            <div className="h-3 bg-gray-200 rounded w-20" />
                                        </div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                                </div>
                            ))
                        ) : recentTests.length > 0 ? (
                            recentTests.map((test) => (
                                <div
                                    key={test._id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                    onClick={() => window.location.href = `/admin-dashboard/reports/${test._id}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold text-sm">
                                                {test.patientId.substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Patient: {test.patientId}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatTimeAgo(test.updatedAt)}</p>
                                        </div>
                                    </div>
                                    {/* ── status string badge, not boolean ── */}
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(test.status)}`}>
                                        {test.status ?? 'Pending'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500 text-sm">No recent tests found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => window.location.href = '/admin-dashboard/create-report'}
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all transform hover:scale-105"
                        >
                            <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">New Report</span>
                        </button>

                        <button
                            onClick={() => window.location.href = '/admin-dashboard/reports'}
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all transform hover:scale-105"
                        >
                            <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">All Reports</span>
                        </button>

                        {/* ── URL updated from ?verified=false to ?status=Pending ── */}
                        <button
                            onClick={() => window.location.href = '/admin-dashboard/reports?status=Pending'}
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-lg transition-all transform hover:scale-105"
                        >
                            <svg className="w-8 h-8 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">Pending Reviews</span>
                        </button>

                        <button
                            onClick={() => window.location.href = '/admin-dashboard/upload'}
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all transform hover:scale-105"
                        >
                            <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">Upload CSV</span>
                        </button>

                        <button
                            onClick={() => window.location.href = '/admin-dashboard/analytics'}
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-lg transition-all transform hover:scale-105"
                        >
                            <svg className="w-8 h-8 text-indigo-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">Analytics</span>
                        </button>

                        <button
                            onClick={() => window.location.href = '/admin-dashboard/users'}
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 rounded-lg transition-all transform hover:scale-105"
                        >
                            <svg className="w-8 h-8 text-pink-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">Manage Users</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSummary;
