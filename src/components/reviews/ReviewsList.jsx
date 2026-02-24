import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsAPI } from '../../utils/analytics.utils';
import ReportStatusBadge from './ReportStatusBadge.jsx';

const ReviewsList = () => {
    const navigate = useNavigate();

    const [allReports, setAllReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [currentPage, setCurrentPage] = useState(1);
    const [stats, setStats] = useState({
        totalReports:      0,
        verifiedCount:     0,
        needsReviewCount:  0,
        pendingCount:      0,
        verificationRate:  0,
    });

    const itemsPerPage = 10;

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        let isMounted = true;

        const fetchReports = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await reportsAPI.getAll(1, 1000);

                let reports = [];
                if (response.data) {
                    if (Array.isArray(response.data))                         reports = response.data;
                    else if (Array.isArray(response.data.reports))            reports = response.data.reports;
                    else if (Array.isArray(response.data.data))               reports = response.data.data;
                }

                if (isMounted) {
                    setAllReports(reports);
                
                    // ✅ Use server's totalReports, not reports.length
                    const serverTotal = response.data.totalReports ?? reports.length;
                
                    const verified    = reports.filter(r => r.status === 'Verified').length;
                    const needsReview = reports.filter(r => r.status === 'Needs Review').length;
                    const pending     = reports.filter(r => !r.status || r.status === 'Pending').length;
                
                    setStats({
                        totalReports:     serverTotal,      // ← fix
                        verifiedCount:    verified,
                        needsReviewCount: needsReview,
                        pendingCount:     pending,
                        verificationRate: serverTotal > 0
                            ? Math.round((verified / serverTotal) * 100)
                            : 0,
                    });
                }
                
            } catch (err) {
                console.error('Error fetching reports:', err);
                if (isMounted) {
                    setError(err.response?.data?.message || 'Failed to load reports');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchReports();
        return () => { isMounted = false; };
    }, []);

    // ── Inline status change — no refetch needed ──────────────────────────────
    const handleStatusChange = (reportId, newStatus) => {
        setAllReports(prev => {
            const updated = prev.map(r =>
                r._id === reportId ? { ...r, status: newStatus } : r
            );

            // Recompute stats from the updated array
            const verified    = updated.filter(r => r.status === 'Verified').length;
            const needsReview = updated.filter(r => r.status === 'Needs Review').length;
            const pending     = updated.filter(r => !r.status || r.status === 'Pending').length;

            setStats({
                totalReports:     updated.length,
                verifiedCount:    verified,
                needsReviewCount: needsReview,
                pendingCount:     pending,
                verificationRate: updated.length > 0
                    ? Math.round((verified / updated.length) * 100)
                    : 0,
            });

            return updated;
        });
    };

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredReports = allReports.filter(report => {
        // Status filter
        if (filterStatus !== 'all') {
            const s = report.status ?? 'Pending';
            if (filterStatus === 'Verified'     && s !== 'Verified')     return false;
            if (filterStatus === 'Needs Review'  && s !== 'Needs Review') return false;
            if (filterStatus === 'Pending'       && s !== 'Pending')      return false;
            if (filterStatus === 'Rejected'      && s !== 'Rejected')     return false;
        }

        // Search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            return (
                report.patientId?.toLowerCase().includes(search) ||
                report.reviewedBy?.toLowerCase().includes(search) ||
                report.treatingPhysician?.toLowerCase().includes(search) ||
                report.urodynamicsTechnician?.toLowerCase().includes(search)
            );
        }

        return true;
    });

    // ── Sort ──────────────────────────────────────────────────────────────────
    const sortedReports = [...filteredReports].sort((a, b) => {
        switch (sortBy) {
            case 'recent':  return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
            case 'oldest':  return new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt);
            case 'patient': return (a.patientId || '').localeCompare(b.patientId || '');
            default:        return 0;
        }
    });

    // ── Pagination ────────────────────────────────────────────────────────────
    const totalPages      = Math.ceil(sortedReports.length / itemsPerPage);
    const paginatedReports = sortedReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus, sortBy]);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const formatTimeAgo = (date) => {
        if (!date) return 'N/A';
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60)    return 'Just now';
        if (seconds < 3600)  return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    };

    const getDiseases = (report) => {
        const diseases = [];
        if (report.detrusorExternalSphincterDyssynergiaDESD) diseases.push('DESD');
        if (report.detrusorUnderactivityDUA)                  diseases.push('DUA');
        if (report.detrusorOveractivityDOA)                   diseases.push('DOA');
        if (report.bladderOutletObstructionBOO)               diseases.push('BOO');
        return diseases;
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

    // ── Loading / Error states ────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                    </div>
                    <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Reports — Review Status</h1>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">View and manage all report verifications</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin-dashboard/reports')}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-fit text-sm"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Back to Reports
                    </button>
                </div>

                {/* ── Stats — 4 cards covering all statuses ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Total */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{stats.totalReports}</p>
                                <p className="text-xs text-gray-500 mt-1">All reports in system</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Verified */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Verified</p>
                                <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">{stats.verifiedCount}</p>
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {stats.verificationRate}% completion rate
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Needs Review */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Needs Review</p>
                                <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2">{stats.needsReviewCount}</p>
                                <p className="text-xs text-blue-600 mt-1 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {stats.needsReviewCount > 0 ? 'Awaiting review' : 'None pending'}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Pending */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl md:text-3xl font-bold text-orange-600 mt-2">{stats.pendingCount}</p>
                                <p className="text-xs text-orange-600 mt-1 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {stats.pendingCount > 0 ? 'Needs attention' : 'All caught up'}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Filters ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row gap-4">

                        {/* Search */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by patient ID, reviewer, physician..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Status Filter — all 4 statuses */}
                        <div className="lg:w-52">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Reports</option>
                                <option value="Pending">Pending</option>
                                <option value="Needs Review">Needs Review</option>
                                <option value="Verified">Verified</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="lg:w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest First</option>
                                <option value="patient">Patient ID</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        Showing <span className="font-semibold">{paginatedReports.length}</span> of{' '}
                        <span className="font-semibold">{sortedReports.length}</span> reports
                    </div>
                </div>

                {/* ── Report Cards ── */}
                {paginatedReports.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'No reports available yet'}
                        </p>
                        {(searchTerm || filterStatus !== 'all') && (
                            <button
                                onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {paginatedReports.map((report) => {
                            const diseases = getDiseases(report);
                            return (
                                <div
                                    key={report._id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/admin-dashboard/reports/${report._id}`)}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                                        {/* Left */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                                                    {report.patientId?.substring(0, 2).toUpperCase() || 'N/A'}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                                                            Patient {report.patientId}
                                                        </h3>

                                                        {/* ── Live status badge — stops card click propagation ── */}
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <ReportStatusBadge
                                                                reportId={report._id}
                                                                status={report.status ?? 'Pending'}
                                                                onStatusChange={(newStatus) =>
                                                                    handleStatusChange(report._id, newStatus)
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-gray-600">
                                                        {report.reviewedBy && report.reviewedBy !== '-' && (
                                                            <div className="flex items-center">
                                                                <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                                <span className="font-medium">Reviewed by:</span>
                                                                <span className="ml-1 text-gray-900 truncate">{report.reviewedBy}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="font-medium">Updated:</span>
                                                            <span className="ml-1">{formatTimeAgo(report.updatedAt || report.createdAt)}</span>
                                                        </div>
                                                        {report.treatingPhysician && report.treatingPhysician !== '-' && (
                                                            <div className="flex items-center">
                                                                <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                </svg>
                                                                <span className="font-medium">Physician:</span>
                                                                <span className="ml-1 truncate">{report.treatingPhysician}</span>
                                                            </div>
                                                        )}
                                                        {report.urodynamicsTechnician && report.urodynamicsTechnician !== '-' && (
                                                            <div className="flex items-center">
                                                                <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                                </svg>
                                                                <span className="font-medium">Technician:</span>
                                                                <span className="ml-1 truncate">{report.urodynamicsTechnician}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {diseases.length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {diseases.map((disease) => (
                                                                <span key={disease} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-md">
                                                                    {disease}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right — action buttons */}
                                        <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/admin-dashboard/reports/${report._id}`); }}
                                                className="flex-1 lg:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/admin-dashboard/reports/${report._id}/review`); }}
                                                className="flex-1 lg:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                            >
                                                {report.status === 'Verified' ? 'Edit Review' : 'Review Report'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                Page <span className="font-semibold">{currentPage}</span> of{' '}
                                <span className="font-semibold">{totalPages}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                >
                                    Previous
                                </button>

                                <div className="hidden sm:flex items-center gap-1">
                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5)                    pageNum = i + 1;
                                        else if (currentPage <= 3)              pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else                                    pageNum = currentPage - 2 + i;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors text-sm ${
                                                    currentPage === pageNum
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReviewsList;
