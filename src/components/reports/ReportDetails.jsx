import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsAPI } from '../../utils/analytics.utils';

const ReportDetail = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();
    
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('patient');

    // Fetch report details
    useEffect(() => {
        let isMounted = true;

        const fetchReport = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await reportsAPI.getById(reportId);
                
                if (isMounted) {
                    setReport(response.data);
                }
            } catch (err) {
                console.error('Error fetching report:', err);
                if (isMounted) {
                    setError(err.response?.data?.message || 'Failed to load report');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchReport();

        return () => {
            isMounted = false;
        };
    }, [reportId]);

    // Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format value display
    const formatValue = (value) => {
        if (value === null || value === undefined || value === '') return 'N/A';
        if (value === '-') return 'Not specified';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'number') return value;
        return value;
    };

    // Get disease badges
    const getDiseases = (reportData) => {
        if (!reportData) return [];
        const diseases = [];
        if (reportData.detrusorExternalSphincterDyssynergiaDESD) {
            diseases.push({ 
                code: 'DESD', 
                name: 'Detrusor External Sphincter Dyssynergia', 
                color: 'bg-blue-100 text-blue-800 border-blue-200' 
            });
        }
        if (reportData.detrusorUnderactivityDUA) {
            diseases.push({ 
                code: 'DUA', 
                name: 'Detrusor Underactivity', 
                color: 'bg-purple-100 text-purple-800 border-purple-200' 
            });
        }
        if (reportData.detrusorOveractivityDOA) {
            diseases.push({ 
                code: 'DOA', 
                name: 'Detrusor Overactivity', 
                color: 'bg-green-100 text-green-800 border-green-200' 
            });
        }
        if (reportData.bladderOutletObstructionBOO) {
            diseases.push({ 
                code: 'BOO', 
                name: 'Bladder Outlet Obstruction', 
                color: 'bg-orange-100 text-orange-800 border-orange-200' 
            });
        }
        return diseases;
    };

    // Define data sections
    const getDataSections = (reportData) => ({
        patient: {
            title: 'Patient Demographics & History',
            icon: '👤',
            color: 'text-blue-600',
            fields: [
                { label: 'Patient ID', value: reportData?.patientId, highlight: true },
                { label: 'Age', value: reportData?.age, unit: 'years' },
                { label: 'Gender', value: reportData?.gender },
                { label: 'Date of Study', value: formatDate(reportData?.dateOfStudy) },
                { label: 'IPSS Score', value: reportData?.ipssScore, unit: '(0-35)', info: 'International Prostate Symptom Score' },
                { label: 'Previous Interventions', value: reportData?.previousInterventions, fullWidth: true },
                { label: 'Comorbidities', value: reportData?.comorbidities, fullWidth: true },
            ]
        },
        filling: {
            title: 'Filling Phase Cystometry',
            icon: '📊',
            color: 'text-indigo-600',
            fields: [
                { label: 'First Sensation Volume', value: reportData?.firstSensationVolume, unit: 'ml', info: 'Volume at which patient first feels bladder filling' },
                { label: 'First Sensation Pves', value: reportData?.firstSensationPves, unit: 'cmH₂O', secondary: true },
                { label: 'First Sensation Pdet', value: reportData?.firstSensationPdet, unit: 'cmH₂O', secondary: true },
                { label: 'First Desire Volume', value: reportData?.firstDesireVolume, unit: 'ml', info: 'Volume at first desire to void' },
                { label: 'First Desire Pves', value: reportData?.firstDesirePves, unit: 'cmH₂O', secondary: true },
                { label: 'First Desire Pdet', value: reportData?.firstDesirePdet, unit: 'cmH₂O', secondary: true },
                { label: 'Normal Desire Volume', value: reportData?.normalDesireVolume, unit: 'ml', info: 'Volume at normal desire to void' },
                { label: 'Normal Desire Pves', value: reportData?.normalDesirePves, unit: 'cmH₂O', secondary: true },
                { label: 'Normal Desire Pdet', value: reportData?.normalDesirePdet, unit: 'cmH₂O', secondary: true },
                { label: 'Strong Desire Volume', value: reportData?.strongDesireVolume, unit: 'ml', info: 'Volume at strong desire to void' },
                { label: 'Strong Desire Pves', value: reportData?.strongDesirePves, unit: 'cmH₂O', secondary: true },
                { label: 'Strong Desire Pdet', value: reportData?.strongDesirePdet, unit: 'cmH₂O', secondary: true },
                { label: 'Urgency Volume', value: reportData?.urgencyVolume, unit: 'ml', info: 'Volume at urgency' },
                { label: 'Urgency Pves', value: reportData?.urgencyPves, unit: 'cmH₂O', secondary: true },
                { label: 'Urgency Pdet', value: reportData?.urgencyPdet, unit: 'cmH₂O', secondary: true },
                { label: 'Maximum Cystometric Capacity (MCC)', value: reportData?.maximumCystometricCapacity, unit: 'ml', highlight: true, info: 'Maximum bladder capacity' },
                { label: 'Detrusor Pressure at MCC', value: reportData?.detrusorPressureAtMCC, unit: 'cmH₂O', highlight: true },
                { label: 'Bladder Compliance', value: reportData?.bladderCompliance, unit: 'ml/cmH₂O', highlight: true, info: 'Change in volume / Change in pressure' },
                { label: 'Infused Volume', value: reportData?.infusedVolume, unit: 'ml', info: 'Total volume infused during filling' },
                { label: 'Involuntary Detrusor Contractions', value: reportData?.involuntaryDetrusorContractions ? 'Present' : 'Absent', highlight: reportData?.involuntaryDetrusorContractions, info: 'Uninhibited bladder contractions during filling' },
            ]
        },
        voiding: {
            title: 'Voiding Phase & Flow Study',
            icon: '💧',
            color: 'text-teal-600',
            fields: [
                { label: 'Voided Volume', value: reportData?.voidedVolume, unit: 'ml', highlight: true, info: 'Total volume voided' },
                { label: 'Maximum Flow Rate (Qmax)', value: reportData?.maximumFlowRateQmax, unit: 'ml/s', highlight: true, info: 'Peak urinary flow rate' },
                { label: 'Average Flow Rate (Qura)', value: reportData?.averageVoidingFlowRateQura, unit: 'ml/s', info: 'Average urinary flow rate during voiding' },
                { label: 'Time to Qmax', value: reportData?.timeToQmax, unit: 'seconds', info: 'Time from start of voiding to maximum flow' },
                { label: 'Voiding Time', value: reportData?.voidingTime, unit: 'seconds', info: 'Total duration of voiding' },
                { label: 'Detrusor Pressure at Qmax (PdetQmax)', value: reportData?.detrusorPressureAtQmax, unit: 'cmH₂O', highlight: true, info: 'Detrusor pressure at maximum flow' },
                { label: 'Post-Void Residual (PVR)', value: reportData?.postVoidResidualVolume, unit: 'ml', highlight: true, info: 'Urine remaining after voiding' },
                { label: 'Voiding Vesical Pressure (Pves)', value: reportData?.voidingVesicalPressure, unit: 'cmH₂O' },
                { label: 'Voiding Abdominal Pressure (Pabd)', value: reportData?.voidingAbdominalPressure, unit: 'cmH₂O' },
                { label: 'Voiding Detrusor Pressure (Pdet)', value: reportData?.voidingDetrusorPressure, unit: 'cmH₂O' },
                { label: 'Bladder Contractility Index (BCI)', value: reportData?.bladderContractilityIndex, highlight: true, info: 'PdetQmax + 5 × Qmax (Normal: >100)' },
                { label: 'Bladder Outlet Obstruction Index (BOOI)', value: reportData?.bladderOutletObstructionIndex, highlight: true, info: 'PdetQmax - 2 × Qmax (>40: Obstructed, <20: Unobstructed)' },
                { label: 'Abrams-Griffiths Number (AG)', value: reportData?.AGNumber, highlight: true, info: 'Alternative obstruction index' },
            ]
        },
        pressures: {
            title: 'Pressure Measurements',
            icon: '⚡',
            color: 'text-purple-600',
            fields: [
                { label: 'Maximum Vesical Pressure (Pves.max)', value: reportData?.pvesMax, unit: 'cmH₂O', highlight: true, info: 'Peak bladder pressure' },
                { label: 'Maximum Abdominal Pressure (Pabd.max)', value: reportData?.pabdMax, unit: 'cmH₂O', highlight: true, info: 'Peak abdominal pressure' },
                { label: 'Maximum Detrusor Pressure (Pdet.max)', value: reportData?.pdetMax, unit: 'cmH₂O', highlight: true, info: 'Peak detrusor muscle pressure (Pves - Pabd)' },
            ]
        },
        emg: {
            title: 'Electromyography (EMG) Activity',
            icon: '📈',
            color: 'text-green-600',
            fields: [
                { label: 'Sphincter EMG During Filling', value: reportData?.sphincterEmgDuringFilling, fullWidth: true, info: 'External urethral sphincter activity during filling phase' },
                { label: 'Sphincter EMG During Voiding', value: reportData?.sphincterEmgDuringVoiding, fullWidth: true, info: 'External urethral sphincter activity during voiding phase' },
                { label: 'General EMG Activity', value: reportData?.emgActivity, fullWidth: true, info: 'Overall electromyography findings' },
            ]
        },
        diagnosis: {
            title: 'Diagnostic Findings',
            icon: '🏥',
            color: 'text-red-600',
            fields: [
                { label: 'Detrusor Underactivity (DUA)', value: reportData?.detrusorUnderactivityDUA ? 'Positive' : 'Negative', highlight: reportData?.detrusorUnderactivityDUA, badge: reportData?.detrusorUnderactivityDUA ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600' },
                { label: 'Bladder Outlet Obstruction (BOO)', value: reportData?.bladderOutletObstructionBOO ? 'Positive' : 'Negative', highlight: reportData?.bladderOutletObstructionBOO, badge: reportData?.bladderOutletObstructionBOO ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600' },
                { label: 'Detrusor Overactivity (DOA)', value: reportData?.detrusorOveractivityDOA ? 'Positive' : 'Negative', highlight: reportData?.detrusorOveractivityDOA, badge: reportData?.detrusorOveractivityDOA ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600' },
                { label: 'Detrusor-External Sphincter Dyssynergia (DESD)', value: reportData?.detrusorExternalSphincterDyssynergiaDESD ? 'Positive' : 'Negative', highlight: reportData?.detrusorExternalSphincterDyssynergiaDESD, badge: reportData?.detrusorExternalSphincterDyssynergiaDESD ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600' },
                { label: 'Diagnostic Comments', value: reportData?.diagnosticComments, fullWidth: true, multiline: true, info: 'Detailed clinical interpretation' },
            ]
        },
        clinical: {
            title: 'Clinical Team & Documentation',
            icon: '👨‍⚕️',
            color: 'text-indigo-600',
            fields: [
                { label: 'Treating Physician', value: reportData?.treatingPhysician, icon: '👨‍⚕️' },
                { label: 'Urodynamics Technician', value: reportData?.urodynamicsTechnician, icon: '👩‍🔬' },
                { label: 'Reviewed By', value: reportData?.reviewedBy, icon: '✓' },
                { label: 'Verification Status', value: reportData?.verified ? 'Verified' : 'Pending Review', badge: reportData?.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' },
                { label: 'Verified At', value: formatDate(reportData?.verifiedAt) },
                { label: 'Report Created', value: formatDate(reportData?.createdAt) },
                { label: 'Last Updated', value: formatDate(reportData?.updatedAt) },
                { label: 'External Report Link', value: reportData?.ReportLink, isLink: true, fullWidth: true },
            ]
        }
    });

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-48"></div>
                        <div className="bg-white rounded-xl p-6 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-64"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                            <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                            <h3 className="text-lg font-semibold text-red-800">Error Loading Report</h3>
                        </div>
                        <p className="text-red-700 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/admin-dashboard/reports')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Back to Reports
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto text-center py-12">
                    <p className="text-gray-500">Report not found</p>
                    <button
                        onClick={() => navigate('/admin-dashboard/reports')}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Back to Reports
                    </button>
                </div>
            </div>
        );
    }

    const diseases = getDiseases(report);
    const dataSections = getDataSections(report);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <button
                        onClick={() => navigate('/admin-dashboard/reports')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium">Back to Reports</span>
                    </button>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => navigate(`/admin-dashboard/reports/${reportId}/review`)}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Review Report
                        </button>
                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm ${
                            report.verified 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                            {report.verified ? '✓ Verified' : '⏳ Pending Review'}
                        </span>
                    </div>
                </div>

                {/* Rest of the component stays the same... */}
                {/* Patient Header Card */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-6 md:p-8 text-white">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex-1 w-full">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-3xl font-bold text-indigo-500">
                                        {report.patientId.substring(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-1">Patient {report.patientId}</h1>
                                    <p className="text-indigo-100 text-sm md:text-base flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Urodynamic Study Report
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                                    <p className="text-indigo-900 text-xs font-medium uppercase tracking-wider mb-1">Age</p>
                                    <p className="text-black text-2xl font-bold">{report.age || 'N/A'}</p>
                                </div>
                                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                                    <p className="text-indigo-900 text-xs font-medium uppercase tracking-wider mb-1">Gender</p>
                                    <p className="text-black text-2xl font-bold">{report.gender || 'N/A'}</p>
                                </div>
                                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                                    <p className="text-indigo-900 text-xs font-medium uppercase tracking-wider mb-1">Study Date</p>
                                    <p className="text-gray-900 text-sm font-semibold">
                                        {report.dateOfStudy ? new Date(report.dateOfStudy).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                                    <p className="text-indigo-900 text-xs font-medium uppercase tracking-wider mb-1">Created</p>
                                    <p className="text-gray-900 text-sm font-semibold">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Diagnosed Conditions */}
                    {diseases.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-white border-opacity-20">
                            <p className="text-indigo-100 text-sm font-semibold mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Diagnosed Conditions
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {diseases.map((disease) => (
                                    <div
                                        key={disease.code}
                                        className={`px-4 py-3 ${disease.color} rounded-xl font-semibold text-sm shadow-md border-2 flex items-center space-x-2`}
                                    >
                                        <span className="text-lg">⚕️</span>
                                        <div>
                                            <div className="font-bold">{disease.code}</div>
                                            <div className="text-xs opacity-90">{disease.name}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {diseases.length === 0 && (
                        <div className="mt-6 pt-6 border-t border-white border-opacity-20">
                            <p className="text-indigo-100 text-sm flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                No urodynamic abnormalities detected
                            </p>
                        </div>
                    )}
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
                        <nav className="flex space-x-1 p-2 min-w-max">
                            {Object.keys(dataSections).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                                        activeTab === key
                                            ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="text-lg">{dataSections[key].icon}</span>
                                    <span>{dataSections[key].title}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 md:p-8">
                        <div className="mb-6">
                            <h2 className={`text-2xl font-bold ${dataSections[activeTab].color} flex items-center`}>
                                <span className="text-3xl mr-3">{dataSections[activeTab].icon}</span>
                                {dataSections[activeTab].title}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dataSections[activeTab].fields.map((field, index) => {
                                const displayValue = formatValue(field.value);
                                const isNA = displayValue === 'N/A' || displayValue === 'Not specified';

                                return (
                                    <div 
                                        key={index}
                                        className={`${
                                            field.fullWidth ? 'md:col-span-2 lg:col-span-3' : ''
                                        } ${
                                            field.highlight && !isNA ? 'ring-2 ring-indigo-200' : ''
                                        }`}
                                    >
                                        <div className={`${
                                            field.secondary ? 'bg-gray-50' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                                        } rounded-xl p-4 h-full border border-gray-200 hover:shadow-md transition-shadow`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <p className={`text-xs font-semibold uppercase tracking-wide ${
                                                    field.secondary ? 'text-gray-400' : 'text-gray-600'
                                                } flex items-center`}>
                                                    {field.icon && <span className="mr-2">{field.icon}</span>}
                                                    {field.label}
                                                </p>
                                                {field.info && (
                                                    <div className="group relative">
                                                        <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-10">
                                                            {field.info}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {field.badge ? (
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${field.badge}`}>
                                                    {displayValue}
                                                </span>
                                            ) : field.isLink && !isNA ? (
                                                <a
                                                    href={displayValue}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold underline break-all text-sm flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    View External Report
                                                </a>
                                            ) : (
                                                <p className={`${
                                                    field.multiline ? 'text-base' : 'text-xl'
                                                } font-bold ${
                                                    isNA ? 'text-gray-400 italic' : 'text-gray-900'
                                                } ${
                                                    field.multiline ? 'whitespace-pre-wrap' : ''
                                                }`}>
                                                    {displayValue}
                                                    {field.unit && !isNA && (
                                                        <span className="text-sm text-gray-500 font-normal ml-2">
                                                            {field.unit}
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pb-6">
                    <button
                        onClick={() => navigate('/admin-dashboard/reports')}
                        className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                        Back to Reports List
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Report
                    </button>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    nav { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default ReportDetail;
