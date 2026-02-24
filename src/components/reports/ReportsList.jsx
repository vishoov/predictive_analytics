import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../utils/analytics.utils';
import ReportStatusBadge from '../reviews/ReportStatusBadge.jsx';

const ReportsList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Server-side status counts
    const [verifiedCount, setVerifiedCount] = useState(0);
    const [needsReviewCount, setNeedsReviewCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

    // Search & Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [genderFilter, setGenderFilter] = useState('all');
    const [diseaseFilter, setDiseaseFilter] = useState('all');
    const [sortBy, setSortBy] = useState('dateOfStudy');
    const [sortOrder, setSortOrder] = useState('desc');

    const diseaseOptions = [
        { value: 'all',  label: 'All Diseases' },
        { value: 'DESD', label: 'DESD - Detrusor External Sphincter Dyssynergia' },
        { value: 'DUA',  label: 'DUA - Detrusor Underactivity' },
        { value: 'DOA',  label: 'DOA - Detrusor Overactivity' },
        { value: 'BOO',  label: 'BOO - Bladder Outlet Obstruction' },
    ];

    const statusOptions = [
        { value: 'all',          label: 'All Status' },
        { value: 'Pending',      label: 'Pending' },
        { value: 'Needs Review', label: 'Needs Review' },
        { value: 'Verified',     label: 'Verified' },
        { value: 'Rejected',     label: 'Rejected' },
    ];

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        let isMounted = true;

        const fetchReports = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {
                    page:     currentPage,
                    limit:    itemsPerPage,
                    search:   searchTerm,
                    status:   statusFilter  !== 'all' ? statusFilter  : undefined,
                    gender:   genderFilter  !== 'all' ? genderFilter  : undefined,
                    disease:  diseaseFilter !== 'all' ? diseaseFilter : undefined,
                    sortBy,
                    sortOrder,
                };

                const response = await reportsAPI.search(params);

                if (isMounted) {
                    setReports(response.data.reports);
                    setTotalPages(response.data.totalPages);
                    setTotalReports(response.data.totalReports);
                    setVerifiedCount(response.data.verifiedCount    ?? 0);
                    setNeedsReviewCount(response.data.needsReviewCount ?? 0);
                    setPendingCount(response.data.pendingCount      ?? 0);
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

        const debounceTimer = setTimeout(fetchReports, 300);
        return () => {
            isMounted = false;
            clearTimeout(debounceTimer);
        };
    }, [currentPage, itemsPerPage, searchTerm, statusFilter, genderFilter, diseaseFilter, sortBy, sortOrder]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setGenderFilter('all');
        setDiseaseFilter('all');
        setSortBy('dateOfStudy');
        setSortOrder('desc');
        setCurrentPage(1);
    };

    const handleStatusChange = (reportId, newStatus) => {
        setReports(prev =>
            prev.map(r => r._id === reportId ? { ...r, status: newStatus } : r)
        );
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    };

    const viewReport = (reportId) => {
        window.location.href = `/admin-dashboard/reports/${reportId}`;
    };

    const getReportDiseases = (report) => {
        const diseases = [];
        if (report.detrusorExternalSphincterDyssynergiaDESD) diseases.push('DESD');
        if (report.detrusorUnderactivityDUA)                  diseases.push('DUA');
        if (report.detrusorOveractivityDOA)                   diseases.push('DOA');
        if (report.bladderOutletObstructionBOO)               diseases.push('BOO');
        return diseases;
    };

    const getDiseaseBadgeColor = (code) => ({
        'DESD': 'bg-blue-100 text-blue-800',
        'DUA':  'bg-purple-100 text-purple-800',
        'DOA':  'bg-green-100 text-green-800',
        'BOO':  'bg-orange-100 text-orange-800',
    }[code] || 'bg-gray-100 text-gray-800');

    const hasActiveFilters = searchTerm || statusFilter !== 'all' || genderFilter !== 'all' || diseaseFilter !== 'all';

    // ── Skeleton ──────────────────────────────────────────────────────────────
    const SkeletonRow = () => (
        <tr className="animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                </td>
            ))}
        </tr>
    );

    const getSortIcon = (field) => {
        if (sortBy !== field) return (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
        );
        return sortOrder === 'asc' ? (
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Urodynamic Reports</h1>
                        <p className="text-blue-100 text-sm md:text-base">View and manage all patient reports</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/admin-dashboard/reports/new'}
                        className="hidden md:flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Report
                    </button>
                </div>
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

            {/* ── Filters ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Patient ID</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search by Patient ID..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Disease Filter */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Disease / Condition</label>
                        <select
                            value={diseaseFilter}
                            onChange={(e) => { setDiseaseFilter(e.target.value); setCurrentPage(1); }}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                            {diseaseOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Gender Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                            value={genderFilter}
                            onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                            <option value="all">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Reset */}
                    <div className="lg:col-span-6 flex justify-end">
                        <button
                            onClick={resetFilters}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset All Filters
                        </button>
                    </div>
                </div>

                {/* Active Filter Pills */}
                {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                            {searchTerm && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    Search: {searchTerm}
                                    <button onClick={() => setSearchTerm('')} className="ml-2">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </span>
                            )}
                            {diseaseFilter !== 'all' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Disease: {diseaseOptions.find(d => d.value === diseaseFilter)?.label.split(' - ')[0]}
                                    <button onClick={() => setDiseaseFilter('all')} className="ml-2">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </span>
                            )}
                            {statusFilter !== 'all' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Status: {statusFilter}
                                    <button onClick={() => setStatusFilter('all')} className="ml-2">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </span>
                            )}
                            {genderFilter !== 'all' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Gender: {genderFilter}
                                    <button onClick={() => setGenderFilter('all')} className="ml-2">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-medium">Filtered Reports</p>
                            <p className="text-xl font-bold text-gray-900">{totalReports}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-medium">Verified</p>
                            <p className="text-xl font-bold text-gray-900">{verifiedCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-medium">Needs Review</p>
                            <p className="text-xl font-bold text-gray-900">{needsReviewCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-medium">Pending</p>
                            <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th onClick={() => handleSort('patientId')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-1"><span>Patient ID</span>{getSortIcon('patientId')}</div>
                                </th>
                                <th onClick={() => handleSort('age')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-1"><span>Age</span>{getSortIcon('age')}</div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Gender
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Diseases
                                </th>
                                {/* ── Date of Investigation ── */}
                                <th onClick={() => handleSort('dateOfStudy')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-1"><span>Date of Investigation</span>{getSortIcon('dateOfStudy')}</div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                Array.from({ length: itemsPerPage }).map((_, i) => <SkeletonRow key={i} />)
                            ) : reports.length > 0 ? (
                                reports.map((report) => {
                                    const diseases = getReportDiseases(report);
                                    return (
                                        <tr
                                            key={report._id}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => viewReport(report._id)}
                                        >
                                            {/* Patient ID */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-indigo-600 font-semibold text-sm">
                                                            {report.patientId.substring(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4 text-sm font-medium text-gray-900">
                                                        {report.patientId}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Age */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {report.age || 'N/A'}
                                            </td>

                                            {/* Gender */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    report.gender === 'Male'   ? 'bg-blue-100 text-blue-800' :
                                                    report.gender === 'Female' ? 'bg-pink-100 text-pink-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {report.gender || 'N/A'}
                                                </span>
                                            </td>

                                            {/* Diseases */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {diseases.length > 0 ? diseases.map(d => (
                                                        <span key={d} className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDiseaseBadgeColor(d)}`}>
                                                            {d}
                                                        </span>
                                                    )) : (
                                                        <span className="text-xs text-gray-400 italic">None</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* ── Date of Investigation ── */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {report.dateOfStudy ? formatDate(report.dateOfStudy) : 'N/A'}
                                            </td>

                                            {/* Status badge */}
                                            <td
                                                className="px-6 py-4 whitespace-nowrap"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <ReportStatusBadge
                                                    reportId={report._id}
                                                    status={report.status ?? 'Pending'}
                                                    onStatusChange={(newStatus) =>
                                                        handleStatusChange(report._id, newStatus)
                                                    }
                                                />
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); viewReport(report._id); }}
                                                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-gray-500 text-sm">
                                                {hasActiveFilters ? 'No reports match your filters' : 'No reports found'}
                                            </p>
                                            {hasActiveFilters && (
                                                <button onClick={resetFilters} className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                                    Clear all filters
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                {!loading && totalPages > 0 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-2">
                                <label className="text-sm text-gray-700">Show:</label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-gray-700">per page</span>
                            </div>

                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalReports)}</span> of{' '}
                                <span className="font-medium">{totalReports}</span> results
                            </div>

                            <div className="flex items-center space-x-2">
                                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">First</button>
                                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>

                                <div className="hidden sm:flex items-center space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5)                    pageNum = i + 1;
                                        else if (currentPage <= 3)              pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else                                    pageNum = currentPage - 2 + i;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-3 py-1 border rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === pageNum
                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Last</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsList;
