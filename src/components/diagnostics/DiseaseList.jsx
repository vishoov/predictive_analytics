import React, { useState, useEffect } from 'react';
import { diseaseAPI } from '../../utils/analytics.utils';

const DiseaseStatistics = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchStatistics = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await diseaseAPI.getStatistics();
                
                if (isMounted) {
                    setStatistics(response.data);
                }
            } catch (err) {
                console.error('Error fetching statistics:', err);
                if (isMounted) {
                    setError(err.response?.data?.message || 'Failed to load statistics');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchStatistics();

        return () => {
            isMounted = false;
        };
    }, []);

    const viewDiseasePatients = (diseaseCode) => {
        window.location.href = `/diseases/patients/${diseaseCode}`;
    };

    const SkeletonCard = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
    );

    const getDiseaseColor = (code) => {
        const colors = {
            'DESD': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-200', solid: 'bg-blue-500' },
            'DUA': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-200', solid: 'bg-purple-500' },
            'DOA': { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-200', solid: 'bg-green-500' },
            'BOO': { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-200', solid: 'bg-orange-500' }
        };
        return colors[code] || colors['DESD'];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Disease Statistics
                </h1>
                <p className="text-indigo-100 text-sm md:text-base">
                    Overview of urodynamic conditions in the database
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg" role="alert">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* Total Patients Card */}
            {loading ? (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="h-4 bg-white bg-opacity-30 rounded w-32 mb-3"></div>
                            <div className="h-10 bg-white bg-opacity-30 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-white bg-opacity-30 rounded w-28"></div>
                        </div>
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg"></div>
                    </div>
                </div>
            ) : statistics && (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">Total Unique Patients</p>
                            <p className="text-4xl font-bold mt-2">
                                {(statistics.totalUniquePatients || 0).toLocaleString()}
                            </p>
                            <p className="text-indigo-100 text-sm mt-2">
                                in the database
                            </p>
                        </div>
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Disease Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : statistics?.diseases && statistics.diseases.length > 0 ? (
                    statistics.diseases.map((disease) => {
                        const colors = getDiseaseColor(disease.code);
                        const totalPatients = statistics.totalUniquePatients || 1;
                        const percentage = totalPatients > 0
                            ? ((disease.patientCount / totalPatients) * 100).toFixed(1)
                            : 0;

                        return (
                            <div
                                key={disease.code}
                                className={`bg-white rounded-xl shadow-sm border-2 ${colors.border} p-6 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105`}
                                onClick={() => viewDiseasePatients(disease.code)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-lg font-bold text-sm`}>
                                        {disease.code}
                                    </div>
                                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                                        <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <h3 className="text-gray-700 font-medium text-sm mb-3 line-clamp-2 min-h-[40px]">
                                    {disease.name}
                                </h3>
                                
                                <div className="space-y-2">
                                    <div className="flex items-end justify-between">
                                        <span className="text-3xl font-bold text-gray-900">
                                            {disease.patientCount || 0}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            patients
                                        </span>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`${colors.solid} h-2 rounded-full transition-all duration-700 ease-out`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    
                                    <p className="text-xs text-gray-500">
                                        {percentage}% of total patients
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        viewDiseasePatients(disease.code);
                                    }}
                                    className={`w-full mt-4 px-4 py-2 ${colors.bg} ${colors.text} rounded-lg font-medium text-sm ${colors.hover} transition-colors`}
                                >
                                    View Patients →
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-12">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 text-sm">No disease statistics available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiseaseStatistics;
