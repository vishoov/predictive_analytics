import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsAPI } from '../../utils/analytics.utils';
import ReportStatusBadge from '../reviews/ReportStatusBadge.jsx';

const ReportView = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('patient');

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        let isMounted = true;

        const fetchReport = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await reportsAPI.getById(reportId);
                if (isMounted) setReport(response.data);
            } catch (err) {
                console.error('Error fetching report:', err);
                if (isMounted) setError(err.response?.data?.message || 'Failed to load report');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchReport();
        return () => { isMounted = false; };
    }, [reportId]);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    const formatValue = (value) => {
        if (value === null || value === undefined || value === '') return 'N/A';
        if (value === '-') return 'Not specified';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        return value;
    };

    const getDiseases = (reportData) => {
        if (!reportData) return [];
        const diseases = [];
        if (reportData.detrusorExternalSphincterDyssynergiaDESD) diseases.push({ code: 'DESD', name: 'Detrusor External Sphincter Dyssynergia', color: 'bg-blue-100 text-blue-800 border-blue-200' });
        if (reportData.detrusorUnderactivityDUA)                  diseases.push({ code: 'DUA',  name: 'Detrusor Underactivity',                   color: 'bg-purple-100 text-purple-800 border-purple-200' });
        if (reportData.detrusorOveractivityDOA)                   diseases.push({ code: 'DOA',  name: 'Detrusor Overactivity',                     color: 'bg-green-100 text-green-800 border-green-200' });
        if (reportData.bladderOutletObstructionBOO)               diseases.push({ code: 'BOO',  name: 'Bladder Outlet Obstruction',                color: 'bg-orange-100 text-orange-800 border-orange-200' });
        return diseases;
    };

    // ── Status helper — uses new status string, not old boolean ──────────────
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Verified':     return 'bg-green-100 text-green-800 border-green-200';
            case 'Needs Review': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Rejected':     return 'bg-red-100 text-red-800 border-red-200';
            default:             return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Pending
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Verified':     return '✓';
            case 'Needs Review': return '👁';
            case 'Rejected':     return '✕';
            default:             return '⏳';
        }
    };

    // ── Data sections — memoized so it doesn't rebuild every render ───────────
    const dataSections = useMemo(() => {
        if (!report) return {};
        return {
            patient: {
                title: 'Patient Demographics & History',
                icon: '👤',
                color: 'text-blue-600',
                fields: [
                    { label: 'Patient ID',              value: report.patientId,              highlight: true },
                    { label: 'Age',                     value: report.age,                    unit: 'years' },
                    { label: 'Gender',                  value: report.gender },
                    { label: 'Date of Investigation',   value: formatDate(report.dateOfStudy) },
                    { label: 'IPSS Score',              value: report.ipssScore,              unit: '(0–35)', info: 'International Prostate Symptom Score' },
                    { label: 'Previous Interventions',  value: report.previousInterventions,  fullWidth: true },
                    { label: 'Comorbidities',           value: report.comorbidities,          fullWidth: true },
                ]
            },
            filling: {
                title: 'Filling Phase Cystometry',
                icon: '📊',
                color: 'text-indigo-600',
                fields: [
                    { label: 'First Sensation Volume',         value: report.firstSensationVolume,      unit: 'ml',       info: 'Volume at which patient first feels bladder filling' },
                    { label: 'First Sensation Pves',           value: report.firstSensationPves,        unit: 'cmH₂O',    secondary: true },
                    { label: 'First Sensation Pdet',           value: report.firstSensationPdet,        unit: 'cmH₂O',    secondary: true },
                    { label: 'First Desire Volume',            value: report.firstDesireVolume,         unit: 'ml',       info: 'Volume at first desire to void' },
                    { label: 'First Desire Pves',              value: report.firstDesirePves,           unit: 'cmH₂O',    secondary: true },
                    { label: 'First Desire Pdet',              value: report.firstDesirePdet,           unit: 'cmH₂O',    secondary: true },
                    { label: 'Normal Desire Volume',           value: report.normalDesireVolume,        unit: 'ml',       info: 'Volume at normal desire to void' },
                    { label: 'Normal Desire Pves',             value: report.normalDesirePves,          unit: 'cmH₂O',    secondary: true },
                    { label: 'Normal Desire Pdet',             value: report.normalDesirePdet,          unit: 'cmH₂O',    secondary: true },
                    { label: 'Strong Desire Volume',           value: report.strongDesireVolume,        unit: 'ml',       info: 'Volume at strong desire to void' },
                    { label: 'Strong Desire Pves',             value: report.strongDesirePves,          unit: 'cmH₂O',    secondary: true },
                    { label: 'Strong Desire Pdet',             value: report.strongDesirePdet,          unit: 'cmH₂O',    secondary: true },
                    { label: 'Urgency Volume',                 value: report.urgencyVolume,             unit: 'ml',       info: 'Volume at urgency' },
                    { label: 'Urgency Pves',                   value: report.urgencyPves,               unit: 'cmH₂O',    secondary: true },
                    { label: 'Urgency Pdet',                   value: report.urgencyPdet,               unit: 'cmH₂O',    secondary: true },
                    { label: 'Maximum Cystometric Capacity',   value: report.maximumCystometricCapacity,unit: 'ml',       highlight: true, info: 'Maximum bladder capacity' },
                    { label: 'Detrusor Pressure at MCC',       value: report.detrusorPressureAtMCC,     unit: 'cmH₂O',   highlight: true },
                    { label: 'Bladder Compliance',             value: report.bladderCompliance,         unit: 'ml/cmH₂O', highlight: true, info: 'Change in volume / Change in pressure' },
                    { label: 'Infused Volume',                 value: report.infusedVolume,             unit: 'ml',       info: 'Total volume infused during filling' },
                    { label: 'Involuntary Detrusor Contractions', value: report.involuntaryDetrusorContractions ? 'Present' : 'Absent', highlight: report.involuntaryDetrusorContractions, info: 'Uninhibited bladder contractions during filling' },
                ]
            },
            voiding: {
                title: 'Voiding Phase & Flow Study',
                icon: '💧',
                color: 'text-teal-600',
                fields: [
                    { label: 'Voided Volume',                          value: report.voidedVolume,                unit: 'ml',     highlight: true },
                    { label: 'Maximum Flow Rate (Qmax)',                value: report.maximumFlowRateQmax,         unit: 'ml/s',   highlight: true, info: 'Peak urinary flow rate' },
                    { label: 'Average Flow Rate (Qura)',                value: report.averageVoidingFlowRateQura,  unit: 'ml/s',   info: 'Average urinary flow rate during voiding' },
                    { label: 'Time to Qmax',                           value: report.timeToQmax,                  unit: 'seconds', info: 'Time from start of voiding to maximum flow' },
                    { label: 'Voiding Time',                           value: report.voidingTime,                 unit: 'seconds' },
                    { label: 'Detrusor Pressure at Qmax (PdetQmax)',   value: report.detrusorPressureAtQmax,      unit: 'cmH₂O',  highlight: true, info: 'Detrusor pressure at maximum flow' },
                    { label: 'Post-Void Residual (PVR)',               value: report.postVoidResidualVolume,      unit: 'ml',     highlight: true, info: 'Urine remaining after voiding' },
                    { label: 'Voiding Vesical Pressure (Pves)',        value: report.voidingVesicalPressure,      unit: 'cmH₂O' },
                    { label: 'Voiding Abdominal Pressure (Pabd)',      value: report.voidingAbdominalPressure,    unit: 'cmH₂O' },
                    { label: 'Voiding Detrusor Pressure (Pdet)',       value: report.voidingDetrusorPressure,     unit: 'cmH₂O' },
                    { label: 'Bladder Contractility Index (BCI)',      value: report.bladderContractilityIndex,   highlight: true, info: 'PdetQmax + 5 × Qmax (Normal: >100)' },
                    { label: 'Bladder Outlet Obstruction Index (BOOI)',value: report.bladderOutletObstructionIndex, highlight: true, info: 'PdetQmax - 2 × Qmax (>40: Obstructed)' },
                    { label: 'Abrams-Griffiths Number (AG)',           value: report.AGNumber,                    highlight: true, info: 'Alternative obstruction index' },
                ]
            },
            pressures: {
                title: 'Pressure Measurements',
                icon: '⚡',
                color: 'text-purple-600',
                fields: [
                    { label: 'Maximum Vesical Pressure (Pves.max)',    value: report.pvesMax, unit: 'cmH₂O', highlight: true, info: 'Peak bladder pressure' },
                    { label: 'Maximum Abdominal Pressure (Pabd.max)',  value: report.pabdMax, unit: 'cmH₂O', highlight: true, info: 'Peak abdominal pressure' },
                    { label: 'Maximum Detrusor Pressure (Pdet.max)',   value: report.pdetMax, unit: 'cmH₂O', highlight: true, info: 'Peak detrusor muscle pressure (Pves - Pabd)' },
                ]
            },
            emg: {
                title: 'Electromyography (EMG)',
                icon: '📈',
                color: 'text-green-600',
                fields: [
                    { label: 'Sphincter EMG During Filling',  value: report.sphincterEmgDuringFilling,  fullWidth: true, multiline: true, info: 'External urethral sphincter activity during filling phase' },
                    { label: 'Sphincter EMG During Voiding',  value: report.sphincterEmgDuringVoiding,  fullWidth: true, multiline: true, info: 'External urethral sphincter activity during voiding phase' },
                    { label: 'General EMG Activity',          value: report.emgActivity,                fullWidth: true, multiline: true, info: 'Overall electromyography findings' },
                ]
            },
            diagnosis: {
                title: 'Diagnostic Findings',
                icon: '🏥',
                color: 'text-red-600',
                fields: [
                    { label: 'Detrusor Underactivity (DUA)',                   value: report.detrusorUnderactivityDUA                   ? 'Positive' : 'Negative', highlight: report.detrusorUnderactivityDUA,                   badge: report.detrusorUnderactivityDUA                   ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600' },
                    { label: 'Bladder Outlet Obstruction (BOO)',               value: report.bladderOutletObstructionBOO                ? 'Positive' : 'Negative', highlight: report.bladderOutletObstructionBOO,                badge: report.bladderOutletObstructionBOO                ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600' },
                    { label: 'Detrusor Overactivity (DOA)',                    value: report.detrusorOveractivityDOA                    ? 'Positive' : 'Negative', highlight: report.detrusorOveractivityDOA,                    badge: report.detrusorOveractivityDOA                    ? 'bg-green-100 text-green-800'  : 'bg-gray-100 text-gray-600' },
                    { label: 'Detrusor-External Sphincter Dyssynergia (DESD)', value: report.detrusorExternalSphincterDyssynergiaDESD   ? 'Positive' : 'Negative', highlight: report.detrusorExternalSphincterDyssynergiaDESD,   badge: report.detrusorExternalSphincterDyssynergiaDESD   ? 'bg-blue-100 text-blue-800'    : 'bg-gray-100 text-gray-600' },
                    { label: 'Diagnostic Comments', value: report.diagnosticComments, fullWidth: true, multiline: true, info: 'Detailed clinical interpretation' },
                ]
            },
            clinical: {
                title: 'Clinical Team & Documentation',
                icon: '👨‍⚕️',
                color: 'text-indigo-600',
                fields: [
                    { label: 'Treating Physician',      value: report.treatingPhysician,    icon: '👨‍⚕️' },
                    { label: 'Urodynamics Technician',  value: report.urodynamicsTechnician, icon: '👩‍🔬' },
                    { label: 'Reviewed By',             value: report.reviewedBy,           icon: '✓' },
                    // ✅ Uses status string — not old verified boolean
                    { label: 'Report Status',           value: report.status ?? 'Pending',  badge: getStatusStyle(report.status) },
                    { label: 'Verified At',             value: formatDate(report.verifiedAt) },
                    { label: 'Report Created',          value: formatDate(report.createdAt) },
                    { label: 'Last Updated',            value: formatDate(report.updatedAt) },
                    { label: 'External Report Link',    value: report.ReportLink,           isLink: true, fullWidth: true },
                ]
            },
            // ✅ Images tab — was completely missing
            images: {
                title: 'Phase Graphs & Images',
                icon: '🖼️',
                color: 'text-pink-600',
                fields: [],   // rendered separately below
                isImageTab: true,
            }
        };
    }, [report]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-48" />
                    <div className="bg-white rounded-xl p-6 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-64" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                            <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <h3 className="text-lg font-semibold text-red-800">Error Loading Report</h3>
                        </div>
                        <p className="text-red-700 mb-4">{error}</p>
                        <button onClick={() => navigate('/admin-dashboard/reports')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
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
                    <button onClick={() => navigate('/admin-dashboard/reports')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Back to Reports
                    </button>
                </div>
            </div>
        );
    }

    const diseases    = getDiseases(report);
    const reportStatus = report.status ?? 'Pending';

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── Header Navigation ── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
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
                            Review & Edit
                        </button>
                        {/* ✅ Status badge using status string — not verified boolean */}
                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm border ${getStatusStyle(reportStatus)}`}>
                            {getStatusIcon(reportStatus)} {reportStatus}
                        </span>
                    </div>
                </div>

                {/* ── Patient Header Card ── */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-6 md:p-8 text-white">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-3xl font-bold text-white">
                                {report.patientId ? report.patientId.substring(0, 2).toUpperCase() : 'NA'}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-1">Patient {report.patientId || 'N/A'}</h1>
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
                            <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider mb-1">Age</p>
                            <p className="text-white text-2xl font-bold">{report.age || 'N/A'}</p>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider mb-1">Gender</p>
                            <p className="text-white text-2xl font-bold">{report.gender || 'N/A'}</p>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider mb-1">Date of Investigation</p>
                            <p className="text-white text-sm font-semibold">
                                {report.dateOfStudy ? new Date(report.dateOfStudy).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider mb-1">Status</p>
                            <p className="text-white text-sm font-semibold">{reportStatus}</p>
                        </div>
                    </div>

                    {/* Diagnosed Conditions */}
                    <div className="mt-6 pt-6 border-t border-white border-opacity-20">
                        {diseases.length > 0 ? (
                            <>
                                <p className="text-indigo-100 text-sm font-semibold mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    Diagnosed Conditions
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {diseases.map((disease) => (
                                        <div key={disease.code} className={`px-4 py-3 ${disease.color} rounded-xl font-semibold text-sm shadow-md border-2 flex items-center space-x-2`}>
                                            <span className="text-lg">⚕️</span>
                                            <div>
                                                <div className="font-bold">{disease.code}</div>
                                                <div className="text-xs opacity-90">{disease.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-indigo-100 text-sm flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                No urodynamic abnormalities detected
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200 overflow-x-auto print:hidden">
                        <nav className="flex space-x-1 p-2 min-w-max">
                            {Object.keys(dataSections).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                                        activeTab === key
                                            ? 'bg-indigo-600 text-white shadow-md scale-105'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="text-lg">{dataSections[key].icon}</span>
                                    <span>{dataSections[key].title}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* ── Tab Content ── */}
                    <div className="p-6 md:p-8">
                        <h2 className={`text-2xl font-bold ${dataSections[activeTab].color} flex items-center mb-6`}>
                            <span className="text-3xl mr-3">{dataSections[activeTab].icon}</span>
                            {dataSections[activeTab].title}
                        </h2>

                        {/* ── Images tab — special render ── */}
                        {dataSections[activeTab].isImageTab ? (
                            <div>
                                {report.images && report.images.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {report.images.map((img, idx) => (
                                            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                <img
                                                    src={img.url}
                                                    alt={img.label || `Graph ${idx + 1}`}
                                                    className="w-full object-contain max-h-64 bg-white"
                                                    onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                                                />
                                                {img.label && (
                                                    <div className="p-3 border-t border-gray-100">
                                                        <p className="text-sm font-medium text-gray-700">{img.label}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-lg font-medium text-gray-500">No graphs uploaded yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Go to Review & Edit to upload phase graphs</p>
                                        <button
                                            onClick={() => navigate(`/admin-dashboard/reports/${reportId}/review`)}
                                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                        >
                                            Upload Graphs
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // ── Standard fields grid ──
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {dataSections[activeTab].fields.map((field, index) => {
                                    const displayValue = formatValue(field.value);
                                    const isNA = displayValue === 'N/A' || displayValue === 'Not specified';

                                    return (
                                        <div
                                            key={index}
                                            className={`${field.fullWidth ? 'md:col-span-2 lg:col-span-3' : ''} ${field.highlight && !isNA ? 'ring-2 ring-indigo-200 rounded-xl' : ''}`}
                                        >
                                            <div className={`${field.secondary ? 'bg-gray-50' : 'bg-gradient-to-br from-gray-50 to-gray-100'} rounded-xl p-4 h-full border border-gray-200 hover:shadow-md transition-shadow`}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <p className={`text-xs font-semibold uppercase tracking-wide ${field.secondary ? 'text-gray-400' : 'text-gray-600'} flex items-center`}>
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
                                                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        View External Report
                                                    </a>
                                                ) : (
                                                    <p className={`${field.multiline ? 'text-base whitespace-pre-wrap' : 'text-xl'} font-bold ${isNA ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                                                        {displayValue}
                                                        {field.unit && !isNA && (
                                                            <span className="text-sm text-gray-500 font-normal ml-2">{field.unit}</span>
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Bottom Actions ── */}
                <div className="flex flex-col sm:flex-row gap-3 pb-6 print:hidden">
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
                        onClick={() => navigate(`/admin-dashboard/reports/${reportId}/review`)}
                        className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Review & Edit Report
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

            <style>{`
                @media print {
                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default ReportView;
