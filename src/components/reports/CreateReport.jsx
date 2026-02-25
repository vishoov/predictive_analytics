import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsAPI } from '../../utils/analytics.utils';

const InputField = ({ label, field, type = 'text', unit, min, max, info, value, onChange, error, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
            {unit && <span className="text-gray-500 text-xs ml-1">({unit})</span>}
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
            value={value ?? ''}
            onChange={(e) => onChange(field, e.target.value)}
            min={min}
            max={max}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const TextareaField = ({ label, field, info, value, onChange, rows = 3 }) => (
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
            value={value ?? ''}
            onChange={(e) => onChange(field, e.target.value)}
            rows={rows}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
    </div>
);

const CheckboxField = ({ label, field, info, value, onChange }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
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

const SelectField = ({ label, field, options, value, onChange, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
            value={value ?? ''}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
            <option value="">Select {label}</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

const Section = ({ title, icon, color, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className={`text-xl font-bold ${color} mb-5 flex items-center`}>
            <span className="text-2xl mr-2">{icon}</span>
            {title}
        </h2>
        {children}
    </div>
);

const initialFormData = {
    patientId: '',
    age: '',
    gender: '',
    dateOfStudy: '',
    ipssScore: '',
    previousInterventions: '',
    comorbidities: '',

    firstSensationVolume: '', firstSensationPves: '', firstSensationPdet: '',
    firstDesireVolume: '',    firstDesirePves: '',    firstDesirePdet: '',
    normalDesireVolume: '',   normalDesirePves: '',   normalDesirePdet: '',
    strongDesireVolume: '',   strongDesirePves: '',   strongDesirePdet: '',
    urgencyVolume: '',        urgencyPves: '',         urgencyPdet: '',
    maximumCystometricCapacity: '',
    detrusorPressureAtMCC: '',
    bladderCompliance: '',
    infusedVolume: '',
    involuntaryDetrusorContractions: false,

    voidedVolume: '',
    maximumFlowRateQmax: '',
    averageVoidingFlowRateQura: '',
    timeToQmax: '',
    voidingTime: '',
    detrusorPressureAtQmax: '',
    postVoidResidualVolume: '',
    voidingVesicalPressure: '',
    voidingAbdominalPressure: '',
    voidingDetrusorPressure: '',
    bladderContractilityIndex: '',
    bladderOutletObstructionIndex: '',
    AGNumber: '',

    pvesMax: '', pabdMax: '', pdetMax: '',

    sphincterEmgDuringFilling: '',
    sphincterEmgDuringVoiding: '',
    emgActivity: '',

    detrusorUnderactivityDUA: false,
    bladderOutletObstructionBOO: false,
    detrusorOveractivityDOA: false,
    detrusorExternalSphincterDyssynergiaDESD: false,
    diagnosticComments: '',

    treatingPhysician: '',
    urodynamicsTechnician: '',
    reviewedBy: '',
    ReportLink: '',
};

const CreateReport = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialFormData);
    const [saving, setSaving] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const validate = () => {
        const errors = {};

        if (!formData.patientId.trim())
            errors.patientId = 'Patient ID is required';

        if (!formData.gender)
            errors.gender = 'Gender is required';

        if (formData.age !== '' && (isNaN(formData.age) || Number(formData.age) < 0 || Number(formData.age) > 120))
            errors.age = 'Age must be between 0 and 120';

        if (formData.ipssScore !== '' && (isNaN(formData.ipssScore) || Number(formData.ipssScore) < 0 || Number(formData.ipssScore) > 35))
            errors.ipssScore = 'IPSS Score must be between 0 and 35';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            const firstErrorEl = document.querySelector('.border-red-500');
            if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                'voidingDetrusorPressure', 'bladderContractilityIndex', 'bladderOutletObstructionIndex',
                'AGNumber', // ✅ ADDED — was missing from numericFields
            ];

            numericFields.forEach(field => {
                cleanedData[field] =
                    cleanedData[field] === '' || cleanedData[field] == null
                        ? null
                        : Number(cleanedData[field]);
            });

            const response = await reportsAPI.create(cleanedData);
            const newReportId = response.data._id || response.data.report?._id;

            alert('Report created successfully!');
            navigate(`/admin-dashboard/reports/${newReportId}`);
        } catch (err) {
            console.error('Error creating report:', err);
            alert(err.response?.data?.message || 'Failed to create report');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (window.confirm('Reset all fields?')) {
            setFormData(initialFormData);
            setValidationErrors({});
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">New Urodynamic Report</h1>
                            <p className="text-indigo-100 text-sm">Fill in the patient data and urodynamic findings</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin-dashboard/reports')}
                            className="text-white opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Action Buttons (top) ── */}
                <div className="flex flex-wrap gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Create Report
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset
                    </button>
                    <button
                        onClick={() => navigate('/admin-dashboard/reports')}
                        className="flex items-center px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Cancel
                    </button>
                </div>

                {/* ── Patient Demographics ── */}
                <Section title="Patient Demographics" icon="👤" color="text-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Patient ID"   field="patientId"   value={formData.patientId}   onChange={handleChange} error={validationErrors.patientId}   required />
                        <InputField label="Age"          field="age"          type="number" unit="years" min={0} max={120} value={formData.age}          onChange={handleChange} error={validationErrors.age} />
                        <SelectField
                            label="Gender" field="gender" value={formData.gender} onChange={handleChange} required
                            options={[
                                { value: 'Male',   label: 'Male' },
                                { value: 'Female', label: 'Female' },
                                { value: 'Other',  label: 'Other' },
                            ]}
                        />
                        <InputField label="Date of Investigation" field="dateOfStudy" type="date" value={formData.dateOfStudy} onChange={handleChange} />
                        <InputField label="IPSS Score" field="ipssScore" type="number" unit="0–35" min={0} max={35} info="International Prostate Symptom Score" value={formData.ipssScore} onChange={handleChange} error={validationErrors.ipssScore} />
                        <div className="md:col-span-3">
                            <TextareaField label="Previous Interventions" field="previousInterventions" value={formData.previousInterventions} onChange={handleChange} rows={2} />
                        </div>
                        <div className="md:col-span-3">
                            <TextareaField label="Comorbidities" field="comorbidities" value={formData.comorbidities} onChange={handleChange} rows={2} />
                        </div>
                    </div>
                </Section>

                {/* ── Filling Phase ── */}
                <Section title="Filling Phase Cystometry" icon="📊" color="text-indigo-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="First Sensation Volume"  field="firstSensationVolume"  type="number" unit="ml"     info="Volume at which patient first feels bladder filling" value={formData.firstSensationVolume}  onChange={handleChange} />
                        <InputField label="First Sensation Pves"    field="firstSensationPves"    type="number" unit="cmH₂O"  value={formData.firstSensationPves}    onChange={handleChange} />
                        <InputField label="First Sensation Pdet"    field="firstSensationPdet"    type="number" unit="cmH₂O"  value={formData.firstSensationPdet}    onChange={handleChange} />
                        <InputField label="First Desire Volume"     field="firstDesireVolume"     type="number" unit="ml"     value={formData.firstDesireVolume}     onChange={handleChange} />
                        <InputField label="First Desire Pves"       field="firstDesirePves"       type="number" unit="cmH₂O"  value={formData.firstDesirePves}       onChange={handleChange} />
                        <InputField label="First Desire Pdet"       field="firstDesirePdet"       type="number" unit="cmH₂O"  value={formData.firstDesirePdet}       onChange={handleChange} />
                        <InputField label="Normal Desire Volume"    field="normalDesireVolume"    type="number" unit="ml"     value={formData.normalDesireVolume}    onChange={handleChange} />
                        <InputField label="Normal Desire Pves"      field="normalDesirePves"      type="number" unit="cmH₂O"  value={formData.normalDesirePves}      onChange={handleChange} />
                        <InputField label="Normal Desire Pdet"      field="normalDesirePdet"      type="number" unit="cmH₂O"  value={formData.normalDesirePdet}      onChange={handleChange} />
                        <InputField label="Strong Desire Volume"    field="strongDesireVolume"    type="number" unit="ml"     value={formData.strongDesireVolume}    onChange={handleChange} />
                        <InputField label="Strong Desire Pves"      field="strongDesirePves"      type="number" unit="cmH₂O"  value={formData.strongDesirePves}      onChange={handleChange} />
                        <InputField label="Strong Desire Pdet"      field="strongDesirePdet"      type="number" unit="cmH₂O"  value={formData.strongDesirePdet}      onChange={handleChange} />
                        <InputField label="Urgency Volume"          field="urgencyVolume"         type="number" unit="ml"     value={formData.urgencyVolume}         onChange={handleChange} />
                        <InputField label="Urgency Pves"            field="urgencyPves"           type="number" unit="cmH₂O"  value={formData.urgencyPves}           onChange={handleChange} />
                        <InputField label="Urgency Pdet"            field="urgencyPdet"           type="number" unit="cmH₂O"  value={formData.urgencyPdet}           onChange={handleChange} />
                        <InputField label="Maximum Cystometric Capacity" field="maximumCystometricCapacity" type="number" unit="ml" info="Maximum bladder capacity" value={formData.maximumCystometricCapacity} onChange={handleChange} />
                        <InputField label="Detrusor Pressure at MCC"     field="detrusorPressureAtMCC"     type="number" unit="cmH₂O" value={formData.detrusorPressureAtMCC}     onChange={handleChange} />
                        <InputField label="Bladder Compliance"           field="bladderCompliance"         type="number" unit="ml/cmH₂O" info="Change in volume / Change in pressure" value={formData.bladderCompliance} onChange={handleChange} />
                        <InputField label="Infused Volume"               field="infusedVolume"             type="number" unit="ml" value={formData.infusedVolume} onChange={handleChange} />
                    </div>
                    <div className="mt-4">
                        <CheckboxField label="Involuntary Detrusor Contractions Present" field="involuntaryDetrusorContractions" info="Uninhibited bladder contractions during filling" value={formData.involuntaryDetrusorContractions} onChange={handleChange} />
                    </div>
                </Section>

                {/* ── Voiding Phase ── */}
                <Section title="Voiding Phase & Flow Study" icon="💧" color="text-teal-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Voided Volume"                            field="voidedVolume"                  type="number" unit="ml"      value={formData.voidedVolume}                  onChange={handleChange} />
                        <InputField label="Maximum Flow Rate (Qmax)"                 field="maximumFlowRateQmax"           type="number" unit="ml/s"    info="Peak urinary flow rate" value={formData.maximumFlowRateQmax}           onChange={handleChange} />
                        <InputField label="Average Flow Rate (Qura)"                 field="averageVoidingFlowRateQura"    type="number" unit="ml/s"    value={formData.averageVoidingFlowRateQura}    onChange={handleChange} />
                        <InputField label="Time to Qmax"                             field="timeToQmax"                    type="number" unit="seconds" value={formData.timeToQmax}                    onChange={handleChange} />
                        <InputField label="Voiding Time"                             field="voidingTime"                   type="number" unit="seconds" value={formData.voidingTime}                   onChange={handleChange} />
                        <InputField label="Detrusor Pressure at Qmax"               field="detrusorPressureAtQmax"        type="number" unit="cmH₂O"   value={formData.detrusorPressureAtQmax}        onChange={handleChange} />
                        <InputField label="Post-Void Residual (PVR)"                 field="postVoidResidualVolume"        type="number" unit="ml"      info="Urine remaining after voiding" value={formData.postVoidResidualVolume}        onChange={handleChange} />
                        <InputField label="Voiding Vesical Pressure"                field="voidingVesicalPressure"        type="number" unit="cmH₂O"   value={formData.voidingVesicalPressure}        onChange={handleChange} />
                        <InputField label="Voiding Abdominal Pressure"              field="voidingAbdominalPressure"      type="number" unit="cmH₂O"   value={formData.voidingAbdominalPressure}      onChange={handleChange} />
                        <InputField label="Voiding Detrusor Pressure"               field="voidingDetrusorPressure"       type="number" unit="cmH₂O"   value={formData.voidingDetrusorPressure}       onChange={handleChange} />
                        <InputField label="Bladder Contractility Index (BCI)"       field="bladderContractilityIndex"     type="number" info="PdetQmax + 5 × Qmax (Normal: >100)" value={formData.bladderContractilityIndex}     onChange={handleChange} />
                        <InputField label="Bladder Outlet Obstruction Index (BOOI)" field="bladderOutletObstructionIndex" type="number" info="PdetQmax - 2 × Qmax (>40: Obstructed)" value={formData.bladderOutletObstructionIndex} onChange={handleChange} />
                        {/* ✅ FIXED — added type="number" */}
                        <InputField label="Abrams-Griffiths Number (AG)"            field="AGNumber"                      type="number" info="Alternative obstruction index" value={formData.AGNumber}                      onChange={handleChange} />
                    </div>
                </Section>

                {/* ── Pressure Measurements ── */}
                <Section title="Pressure Measurements" icon="⚡" color="text-purple-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Maximum Vesical Pressure (Pves.max)"   field="pvesMax" type="number" unit="cmH₂O" info="Peak bladder pressure"         value={formData.pvesMax} onChange={handleChange} />
                        <InputField label="Maximum Abdominal Pressure (Pabd.max)" field="pabdMax" type="number" unit="cmH₂O" info="Peak abdominal pressure"       value={formData.pabdMax} onChange={handleChange} />
                        <InputField label="Maximum Detrusor Pressure (Pdet.max)"  field="pdetMax" type="number" unit="cmH₂O" info="Peak detrusor muscle pressure" value={formData.pdetMax} onChange={handleChange} />
                    </div>
                </Section>

                {/* ── EMG ── */}
                <Section title="Electromyography (EMG) Activity" icon="📈" color="text-green-600">
                    <div className="space-y-4">
                        <TextareaField label="Sphincter EMG During Filling" field="sphincterEmgDuringFilling" info="External urethral sphincter activity during filling phase" value={formData.sphincterEmgDuringFilling} onChange={handleChange} />
                        <TextareaField label="Sphincter EMG During Voiding" field="sphincterEmgDuringVoiding" info="External urethral sphincter activity during voiding phase" value={formData.sphincterEmgDuringVoiding} onChange={handleChange} />
                        <TextareaField label="General EMG Activity"         field="emgActivity"               info="Overall electromyography findings"                        value={formData.emgActivity}               onChange={handleChange} />
                    </div>
                </Section>

                {/* ── Diagnostic Findings ── */}
                <Section title="Diagnostic Findings" icon="🏥" color="text-red-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <CheckboxField label="Detrusor Underactivity (DUA)"                   field="detrusorUnderactivityDUA"                 value={formData.detrusorUnderactivityDUA}                 onChange={handleChange} />
                        <CheckboxField label="Bladder Outlet Obstruction (BOO)"               field="bladderOutletObstructionBOO"              value={formData.bladderOutletObstructionBOO}              onChange={handleChange} />
                        <CheckboxField label="Detrusor Overactivity (DOA)"                    field="detrusorOveractivityDOA"                  value={formData.detrusorOveractivityDOA}                  onChange={handleChange} />
                        <CheckboxField label="Detrusor-External Sphincter Dyssynergia (DESD)" field="detrusorExternalSphincterDyssynergiaDESD" value={formData.detrusorExternalSphincterDyssynergiaDESD} onChange={handleChange} />
                    </div>
                    <TextareaField label="Diagnostic Comments" field="diagnosticComments" info="Detailed clinical interpretation" value={formData.diagnosticComments} onChange={handleChange} rows={4} />
                </Section>

                {/* ── Clinical Team ── */}
                <Section title="Clinical Team & Documentation" icon="👨‍⚕️" color="text-indigo-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Treating Physician"     field="treatingPhysician"     value={formData.treatingPhysician}     onChange={handleChange} />
                        <InputField label="Urodynamics Technician" field="urodynamicsTechnician" value={formData.urodynamicsTechnician} onChange={handleChange} />
                        <InputField label="Reviewed By"            field="reviewedBy"            value={formData.reviewedBy}            onChange={handleChange} />
                        <div className="md:col-span-3">
                            <InputField label="External Report Link" field="ReportLink" value={formData.ReportLink} onChange={handleChange} />
                        </div>
                    </div>
                </Section>

                {/* ── Bottom Actions ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex-1 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-base"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Report...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Create Report
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-base"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset All
                        </button>
                        <button
                            onClick={() => navigate('/admin-dashboard/reports')}
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

export default CreateReport;
