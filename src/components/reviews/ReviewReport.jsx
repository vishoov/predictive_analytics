import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsAPI } from '../../utils/analytics.utils';
import ReportGraphUpload from './ReportGraphUpload.jsx';
import ReportStatusBadge from './ReportStatusBadge.jsx';

// ── Field components OUTSIDE ReviewReport to prevent remount on every keystroke ──

const InputField = ({ label, field, type = 'text', unit, min, max, info, disabled = false, value, onChange, error }) => {
    const getDisplayValue = () => {
        if (value === null || value === undefined) return '';
        return value;
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {unit && <span className="text-gray-500 text-xs">({unit})</span>}
                {info && (
                    <span className="ml-2 text-gray-400 cursor-help" title={info}>
                        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </span>
                )}
            </label>
            <input
                type={type}
                value={getDisplayValue()}
                onChange={(e) => onChange(field, e.target.value)}
                min={min}
                max={max}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                } ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};

const TextareaField = ({ label, field, info, disabled = false, value, onChange }) => {
    const getDisplayValue = () => {
        if (value === null || value === undefined) return '';
        return value;
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {info && (
                    <span className="ml-2 text-gray-400 cursor-help" title={info}>
                        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </span>
                )}
            </label>
            <textarea
                value={getDisplayValue()}
                onChange={(e) => onChange(field, e.target.value)}
                disabled={disabled}
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
            />
        </div>
    );
};

const CheckboxField = ({ label, field, info, value, onChange }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(field, e.target.checked)}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label className="text-sm font-medium text-gray-700">
            {label}
            {info && (
                <span className="ml-2 text-gray-400 cursor-help" title={info}>
                    <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
            )}
        </label>
    </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const ReviewReport = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();

    const [originalReport, setOriginalReport] = useState(null);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const getCurrentUser = () => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                return parsedUser.name || parsedUser.username || parsedUser.email || 'Unknown User';
            } catch (e) {
                console.error('Error parsing user:', e);
            }
        }
        return localStorage.getItem('username') || localStorage.getItem('name') || '';
    };

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        let isMounted = true;

        const fetchReport = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await reportsAPI.getById(reportId);

                if (isMounted) {
                    const reportData = response.data;

                    if (!reportData.reviewedBy || reportData.reviewedBy === '' || reportData.reviewedBy === '-') {
                        reportData.reviewedBy = getCurrentUser();
                    }

                    setOriginalReport(reportData);
                    setFormData(reportData);
                }
            } catch (err) {
                console.error('Error fetching report:', err);
                if (isMounted) {
                    setError(err.response?.data?.message || 'Failed to load report');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchReport();
        return () => { isMounted = false; };
    }, [reportId]);

    // ── Change detection — ignore images/status/verifiedAt ───────────────────
    useEffect(() => {
        if (originalReport && formData) {
            const strip = ({ images, status, verifiedAt, ...rest }) => rest;
            const changed = JSON.stringify(strip(originalReport)) !== JSON.stringify(strip(formData));
            setHasChanges(changed);
        }
    }, [formData, originalReport]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleImagesUpdate = (updatedImages, newStatus) => {
        const patch = {
            images: updatedImages,
            ...(newStatus ? { status: newStatus } : {}),
        };
        setFormData(prev => ({ ...prev, ...patch }));
        setOriginalReport(prev => ({ ...prev, ...patch }));
    };

    const handleStatusChange = (newStatus) => {
        setFormData(prev => ({ ...prev, status: newStatus }));
        setOriginalReport(prev => ({ ...prev, status: newStatus }));
    };

    const validateForm = () => {
        const errors = {};
        if (formData.ipssScore !== null && formData.ipssScore !== undefined && formData.ipssScore !== '') {
            const score = Number(formData.ipssScore);
            if (isNaN(score) || score < 0 || score > 35) {
                errors.ipssScore = 'IPSS Score must be between 0 and 35';
            }
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all changes?')) {
            setFormData(originalReport);
            setValidationErrors({});
            setHasChanges(false);
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            alert('Please fix validation errors before saving');
            return;
        }

        try {
            setSaving(true);

            const cleanedData = { ...formData };

            const numericFields = [
                'age', 'ipssScore',
                'firstSensationVolume', 'firstDesireVolume', 'normalDesireVolume',
                'strongDesireVolume', 'urgencyVolume', 'maximumCystometricCapacity',
                'voidedVolume', 'postVoidResidualVolume', 'infusedVolume',
                'maximumFlowRateQmax', 'averageVoidingFlowRateQura', 'timeToQmax', 'voidingTime',
                'detrusorPressureAtMCC', 'detrusorPressureAtQmax', 'bladderCompliance',
                'pvesMax', 'pabdMax', 'pdetMax',
                'firstSensationPves', 'firstSensationPdet', 'firstDesirePves', 'firstDesirePdet',
                'normalDesirePves', 'normalDesirePdet', 'strongDesirePves', 'strongDesirePdet',
                'urgencyPves', 'urgencyPdet', 'voidingVesicalPressure', 'voidingAbdominalPressure',
                'voidingDetrusorPressure', 'bladderContractilityIndex', 'bladderOutletObstructionIndex'
            ];

            numericFields.forEach(field => {
                cleanedData[field] =
                    cleanedData[field] === '' || cleanedData[field] == null
                        ? null
                        : Number(cleanedData[field]);
            });

            delete cleanedData.status;
            delete cleanedData.verifiedAt;
            delete cleanedData.images;

            await reportsAPI.update(reportId, cleanedData);

            setOriginalReport(prev => ({ ...prev, ...cleanedData }));

            alert('Report updated successfully!');
            navigate(`/admin-dashboard/reports/${reportId}`);
        } catch (err) {
            console.error('Error updating report:', err);
            alert(err.response?.data?.message || 'Failed to update report');
        } finally {
            setSaving(false);
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-48" />
                        <div className="bg-white rounded-xl p-6 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-64" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !formData) {
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
                        <p className="text-red-700 mb-4">{error || 'Report not found'}</p>
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

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">Review & Edit Report</h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <p className="text-sm text-gray-600">
                                    Patient ID: <span className="font-semibold">{formData.patientId}</span>
                                </p>
                                <ReportStatusBadge
                                    reportId={reportId}
                                    status={formData.status ?? 'Pending'}
                                    onStatusChange={handleStatusChange}
                                />
                                {hasChanges && (
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                                        Unsaved Changes
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/admin-dashboard/reports/${reportId}`)}
                            className="text-gray-400 hover:text-gray-700 transition-colors mt-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Top Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={!hasChanges}
                            className="flex items-center px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset Changes
                        </button>
                        <button
                            onClick={() => navigate(`/admin-dashboard/reports/${reportId}`)}
                            className="flex items-center px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Cancel
                        </button>
                    </div>
                </div>

                {/* ── Patient Demographics (Read-only) ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Patient Demographics (Read-Only)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Patient ID" field="patientId" disabled value={formData.patientId} onChange={handleInputChange} />
                        <InputField label="Age" field="age" type="number" unit="years" disabled value={formData.age} onChange={handleInputChange} />
                        <InputField label="Gender" field="gender" disabled value={formData.gender} onChange={handleInputChange} />
                    </div>
                </div>

                {/* ── Filling Phase ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center">
                        <span className="text-2xl mr-2">📊</span>
                        Filling Phase Cystometry
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="First Sensation Volume" field="firstSensationVolume" type="number" unit="ml" info="Volume at which patient first feels bladder filling" value={formData.firstSensationVolume} onChange={handleInputChange} />
                        <InputField label="First Sensation Pves" field="firstSensationPves" type="number" unit="cmH₂O" value={formData.firstSensationPves} onChange={handleInputChange} />
                        <InputField label="First Sensation Pdet" field="firstSensationPdet" type="number" unit="cmH₂O" value={formData.firstSensationPdet} onChange={handleInputChange} />
                        <InputField label="First Desire Volume" field="firstDesireVolume" type="number" unit="ml" value={formData.firstDesireVolume} onChange={handleInputChange} />
                        <InputField label="First Desire Pves" field="firstDesirePves" type="number" unit="cmH₂O" value={formData.firstDesirePves} onChange={handleInputChange} />
                        <InputField label="First Desire Pdet" field="firstDesirePdet" type="number" unit="cmH₂O" value={formData.firstDesirePdet} onChange={handleInputChange} />
                        <InputField label="Normal Desire Volume" field="normalDesireVolume" type="number" unit="ml" value={formData.normalDesireVolume} onChange={handleInputChange} />
                        <InputField label="Normal Desire Pves" field="normalDesirePves" type="number" unit="cmH₂O" value={formData.normalDesirePves} onChange={handleInputChange} />
                        <InputField label="Normal Desire Pdet" field="normalDesirePdet" type="number" unit="cmH₂O" value={formData.normalDesirePdet} onChange={handleInputChange} />
                        <InputField label="Strong Desire Volume" field="strongDesireVolume" type="number" unit="ml" value={formData.strongDesireVolume} onChange={handleInputChange} />
                        <InputField label="Strong Desire Pves" field="strongDesirePves" type="number" unit="cmH₂O" value={formData.strongDesirePves} onChange={handleInputChange} />
                        <InputField label="Strong Desire Pdet" field="strongDesirePdet" type="number" unit="cmH₂O" value={formData.strongDesirePdet} onChange={handleInputChange} />
                        <InputField label="Urgency Volume" field="urgencyVolume" type="number" unit="ml" value={formData.urgencyVolume} onChange={handleInputChange} />
                        <InputField label="Urgency Pves" field="urgencyPves" type="number" unit="cmH₂O" value={formData.urgencyPves} onChange={handleInputChange} />
                        <InputField label="Urgency Pdet" field="urgencyPdet" type="number" unit="cmH₂O" value={formData.urgencyPdet} onChange={handleInputChange} />
                        <InputField label="Maximum Cystometric Capacity" field="maximumCystometricCapacity" type="number" unit="ml" info="Maximum bladder capacity" value={formData.maximumCystometricCapacity} onChange={handleInputChange} />
                        <InputField label="Detrusor Pressure at MCC" field="detrusorPressureAtMCC" type="number" unit="cmH₂O" value={formData.detrusorPressureAtMCC} onChange={handleInputChange} />
                        <InputField label="Bladder Compliance" field="bladderCompliance" type="number" unit="ml/cmH₂O" info="Change in volume / Change in pressure" value={formData.bladderCompliance} onChange={handleInputChange} />
                        <InputField label="Infused Volume" field="infusedVolume" type="number" unit="ml" value={formData.infusedVolume} onChange={handleInputChange} />
                    </div>
                    <div className="mt-4">
                        <CheckboxField
                            label="Involuntary Detrusor Contractions Present"
                            field="involuntaryDetrusorContractions"
                            info="Uninhibited bladder contractions during filling"
                            value={formData.involuntaryDetrusorContractions}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* ── Voiding Phase ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-teal-600 mb-4 flex items-center">
                        <span className="text-2xl mr-2">💧</span>
                        Voiding Phase & Flow Study
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Voided Volume" field="voidedVolume" type="number" unit="ml" value={formData.voidedVolume} onChange={handleInputChange} />
                        <InputField label="Maximum Flow Rate (Qmax)" field="maximumFlowRateQmax" type="number" unit="ml/s" info="Peak urinary flow rate" value={formData.maximumFlowRateQmax} onChange={handleInputChange} />
                        <InputField label="Average Flow Rate (Qura)" field="averageVoidingFlowRateQura" type="number" unit="ml/s" value={formData.averageVoidingFlowRateQura} onChange={handleInputChange} />
                        <InputField label="Time to Qmax" field="timeToQmax" type="number" unit="seconds" value={formData.timeToQmax} onChange={handleInputChange} />
                        <InputField label="Voiding Time" field="voidingTime" type="number" unit="seconds" value={formData.voidingTime} onChange={handleInputChange} />
                        <InputField label="Detrusor Pressure at Qmax" field="detrusorPressureAtQmax" type="number" unit="cmH₂O" value={formData.detrusorPressureAtQmax} onChange={handleInputChange} />
                        <InputField label="Post-Void Residual (PVR)" field="postVoidResidualVolume" type="number" unit="ml" info="Urine remaining after voiding" value={formData.postVoidResidualVolume} onChange={handleInputChange} />
                        <InputField label="Voiding Vesical Pressure" field="voidingVesicalPressure" type="number" unit="cmH₂O" value={formData.voidingVesicalPressure} onChange={handleInputChange} />
                        <InputField label="Voiding Abdominal Pressure" field="voidingAbdominalPressure" type="number" unit="cmH₂O" value={formData.voidingAbdominalPressure} onChange={handleInputChange} />
                        <InputField label="Voiding Detrusor Pressure" field="voidingDetrusorPressure" type="number" unit="cmH₂O" value={formData.voidingDetrusorPressure} onChange={handleInputChange} />
                        <InputField label="Bladder Contractility Index (BCI)" field="bladderContractilityIndex" type="number" info="PdetQmax + 5 × Qmax (Normal: >100)" value={formData.bladderContractilityIndex} onChange={handleInputChange} />
                        <InputField label="Bladder Outlet Obstruction Index (BOOI)" field="bladderOutletObstructionIndex" type="number" info="PdetQmax - 2 × Qmax (>40: Obstructed)" value={formData.bladderOutletObstructionIndex} onChange={handleInputChange} />
                        <InputField label="Abrams-Griffiths Number" field="AGNumber" info="Alternative obstruction index" value={formData.AGNumber} onChange={handleInputChange} />
                    </div>
                </div>

                {/* ── Pressure Measurements ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                        <span className="text-2xl mr-2">⚡</span>
                        Pressure Measurements
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Maximum Vesical Pressure (Pves.max)" field="pvesMax" type="number" unit="cmH₂O" info="Peak bladder pressure" value={formData.pvesMax} onChange={handleInputChange} />
                        <InputField label="Maximum Abdominal Pressure (Pabd.max)" field="pabdMax" type="number" unit="cmH₂O" info="Peak abdominal pressure" value={formData.pabdMax} onChange={handleInputChange} />
                        <InputField label="Maximum Detrusor Pressure (Pdet.max)" field="pdetMax" type="number" unit="cmH₂O" info="Peak detrusor muscle pressure" value={formData.pdetMax} onChange={handleInputChange} />
                    </div>
                </div>

                {/* ── EMG Activity ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center">
                        <span className="text-2xl mr-2">📈</span>
                        Electromyography (EMG) Activity
                    </h2>
                    <div className="space-y-4">
                        <TextareaField label="Sphincter EMG During Filling" field="sphincterEmgDuringFilling" info="External urethral sphincter activity during filling phase" value={formData.sphincterEmgDuringFilling} onChange={handleInputChange} />
                        <TextareaField label="Sphincter EMG During Voiding" field="sphincterEmgDuringVoiding" info="External urethral sphincter activity during voiding phase" value={formData.sphincterEmgDuringVoiding} onChange={handleInputChange} />
                        <TextareaField label="General EMG Activity" field="emgActivity" info="Overall electromyography findings" value={formData.emgActivity} onChange={handleInputChange} />
                    </div>
                </div>

                {/* ── Diagnostic Findings ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                        <span className="text-2xl mr-2">🏥</span>
                        Diagnostic Findings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <CheckboxField label="Detrusor Underactivity (DUA)" field="detrusorUnderactivityDUA" value={formData.detrusorUnderactivityDUA} onChange={handleInputChange} />
                        <CheckboxField label="Bladder Outlet Obstruction (BOO)" field="bladderOutletObstructionBOO" value={formData.bladderOutletObstructionBOO} onChange={handleInputChange} />
                        <CheckboxField label="Detrusor Overactivity (DOA)" field="detrusorOveractivityDOA" value={formData.detrusorOveractivityDOA} onChange={handleInputChange} />
                        <CheckboxField label="Detrusor-External Sphincter Dyssynergia (DESD)" field="detrusorExternalSphincterDyssynergiaDESD" value={formData.detrusorExternalSphincterDyssynergiaDESD} onChange={handleInputChange} />
                    </div>
                    <TextareaField label="Diagnostic Comments" field="diagnosticComments" info="Detailed clinical interpretation" value={formData.diagnosticComments} onChange={handleInputChange} />
                </div>

                {/* ── Clinical Team ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center">
                        <span className="text-2xl mr-2">👨‍⚕️</span>
                        Clinical Team & Documentation
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Treating Physician" field="treatingPhysician" value={formData.treatingPhysician} onChange={handleInputChange} />
                        <InputField label="Urodynamics Technician" field="urodynamicsTechnician" value={formData.urodynamicsTechnician} onChange={handleInputChange} />
                        <div>
                            <InputField
                                label="Reviewed By"
                                field="reviewedBy"
                                info="Auto-populated with your name"
                                value={formData.reviewedBy}
                                onChange={handleInputChange}
                            />
                            <p className="mt-1 text-xs text-gray-500">✓ Current User</p>
                        </div>
                        <div className="md:col-span-3">
                            <InputField label="External Report Link" field="ReportLink" value={formData.ReportLink} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>

                {/* ── Graph Upload ── */}
                <ReportGraphUpload
                    reportId={reportId}
                    images={formData.images || []}
                    onImagesUpdate={handleImagesUpdate}
                />

                {/* ── Report Status ── */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md border-2 border-green-200 p-6">
                    <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                        <span className="text-2xl mr-2">✅</span>
                        Report Status
                    </h2>
                    <div className="bg-white rounded-lg p-6 border border-green-200">
                        <p className="text-sm text-gray-500 mb-5">
                            Status updates instantly — no need to click Save Changes.
                        </p>

                        <ReportStatusBadge
                            reportId={reportId}
                            status={formData.status ?? 'Pending'}
                            onStatusChange={handleStatusChange}
                        />

                        <div className="mt-5 pt-5 border-t border-gray-100">
                            {formData.status === 'Verified' && (
                                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-green-800">Report Verified</p>
                                        <p className="text-xs text-green-700 mt-0.5">
                                            By: <span className="font-semibold">{formData.reviewedBy || getCurrentUser()}</span>
                                            {formData.verifiedAt && (
                                                <span className="ml-2 opacity-75">
                                                    · {new Date(formData.verifiedAt).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {formData.status === 'Rejected' && (
                                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-red-800">Report Rejected</p>
                                        <p className="text-xs text-red-600 mt-0.5">
                                            This report has been flagged and requires correction or re-submission.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {formData.status === 'Needs Review' && (
                                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-800">Awaiting Review</p>
                                        <p className="text-xs text-blue-600 mt-0.5">
                                            Images uploaded. Ready for physician review.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {(formData.status === 'Pending' || !formData.status) && (
                                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-yellow-800">Pending</p>
                                        <p className="text-xs text-yellow-600 mt-0.5">
                                            Upload phase graphs above to advance this report to Needs Review.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Bottom Actions ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            className="flex-1 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-base"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={!hasChanges}
                            className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-base"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset Changes
                        </button>
                        <button
                            onClick={() => navigate(`/admin-dashboard/reports/${reportId}`)}
                            className="flex-1 flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-base"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReviewReport;
