import React, { useState, useMemo, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import { analyticsAPI } from '../../utils/analytics.utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS  (clinical — never from DB)
// ─────────────────────────────────────────────────────────────────────────────
const DISEASE_COLORS = {
    BOO:  '#f97316',
    DUA:  '#a855f7',
    DOA:  '#22c55e',
    DESD: '#3b82f6',
};

const ICS_RANGES = {
    Qmax:              { normal: '15–25 ml/s',    normalBuckets: ['15–20','20–25','25+']  },
    PdetQmax:          { normal: '20–60 cmH₂O',   normalBuckets: ['20–40','40–60']        },
    bladderCompliance: { normal: '>20 ml/cmH₂O',  normalBuckets: ['20–40','40–60','60+']  },
    PVR:               { normal: '<50 ml',         normalBuckets: ['0–50']                 },
};

const PARAM_META = {
    Qmax:              { label: 'Max Flow Rate (Qmax)',     unit: 'ml/s',     color: '#6366f1' },
    PdetQmax:          { label: 'Detrusor Pressure @ Qmax', unit: 'cmH₂O',    color: '#f97316' },
    bladderCompliance: { label: 'Bladder Compliance',       unit: 'ml/cmH₂O', color: '#a855f7' },
    PVR:               { label: 'Post-Void Residual (PVR)', unit: 'ml',       color: '#14b8a6' },
};

const COMPLIANCE_RISK_ORDER = ['Poor (<10)', 'Borderline (10–20)', 'Normal (>20)'];
const COMPLIANCE_COLORS     = ['bg-red-500', 'bg-yellow-400', 'bg-green-500'];

const HEATMAP_COLORS = (value) => {
    if (value >= 40) return 'bg-red-600 text-white';
    if (value >= 30) return 'bg-red-400 text-white';
    if (value >= 20) return 'bg-orange-400 text-white';
    if (value >= 10) return 'bg-yellow-300 text-gray-900';
    if (value >= 5)  return 'bg-yellow-100 text-gray-700';
    return 'bg-gray-50 text-gray-500';
};

const ICS_BORDER_COLOR = '#22c55e';

// ─────────────────────────────────────────────────────────────────────────────
// SMALL RE-USABLE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const SectionCard = ({ title, subtitle, icon, children }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-start gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const FilterPill = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            active
                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
        }`}
    >
        {label}
    </button>
);

const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

const SkeletonDashboard = () => (
    <div className="space-y-8 mt-8 pb-12">
        <Skeleton className="h-52 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
        </div>
        <Skeleton className="h-80" />
        <Skeleton className="h-72" />
        <Skeleton className="h-64" />
        <Skeleton className="h-80" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
        </div>
        <Skeleton className="h-28" />
    </div>
);

// ── Custom SVG Box Plot row ───────────────────────────────────────────────────
const BoxPlotRow = ({ data, maxVal = 35 }) => {
    const W = 280, H = 48, PAD = 10;
    const scale = (v) => PAD + ((v / maxVal) * (W - PAD * 2));

    return (
        <div className="flex items-center gap-4">
            <span className="w-12 text-xs font-bold text-gray-700 text-right shrink-0">
                {data.diagnosis}
            </span>
            <svg width={W} height={H} className="overflow-visible shrink-0">
                {/* Moderate IPSS reference band */}
                <rect x={scale(8)} y={8} width={scale(19) - scale(8)} height={H - 16}
                      fill="#6366f133" rx={2} />
                {/* Whisker */}
                <line x1={scale(data.min)} y1={H / 2} x2={scale(data.max)} y2={H / 2}
                      stroke="#94a3b8" strokeWidth={1.5} />
                {/* IQR box */}
                <rect x={scale(data.q1)} y={H / 2 - 10}
                      width={Math.max(scale(data.q3) - scale(data.q1), 2)} height={20}
                      fill="#e0e7ff" stroke="#6366f1" strokeWidth={1.5} rx={3} />
                {/* Median */}
                <line x1={scale(data.median)} y1={H / 2 - 10}
                      x2={scale(data.median)} y2={H / 2 + 10}
                      stroke="#4f46e5" strokeWidth={2.5} />
                {/* End caps */}
                <line x1={scale(data.min)} y1={H / 2 - 6} x2={scale(data.min)} y2={H / 2 + 6}
                      stroke="#94a3b8" strokeWidth={1.5} />
                <line x1={scale(data.max)} y1={H / 2 - 6} x2={scale(data.max)} y2={H / 2 + 6}
                      stroke="#94a3b8" strokeWidth={1.5} />
                {/* Outliers */}
                {(data.outliers || []).map((o, i) => (
                    <circle key={i} cx={scale(o)} cy={H / 2} r={3} fill="#ef4444" opacity={0.8} />
                ))}
                {/* Median label */}
                <text x={scale(data.median)} y={H / 2 - 14} textAnchor="middle"
                      fontSize={10} fill="#4f46e5" fontWeight="600">
                    {data.median}
                </text>
            </svg>
            <span className="text-xs text-gray-400 shrink-0">
                {data.q1}–{data.q3} <span className="text-gray-300">IQR</span>
            </span>
        </div>
    );
};

// ── Horizontal histogram with ICS highlight ───────────────────────────────────
const HistogramBar = ({ data, normalBuckets = [], color }) => {
    const max = Math.max(...data.map(d => d.count), 1);
    return (
        <div className="space-y-2">
            {data.map((d) => {
                const isNormal = normalBuckets.includes(d.bucket);
                const pct      = Math.round((d.count / max) * 100);
                return (
                    <div key={d.bucket} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-16 text-right shrink-0">{d.bucket}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                            <div
                                className="h-5 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                                style={{
                                    width:           `${pct}%`,
                                    backgroundColor: isNormal ? ICS_BORDER_COLOR : color,
                                    opacity:         isNormal ? 1 : 0.65,
                                    minWidth:        d.count > 0 ? '2rem' : 0,
                                }}
                            >
                                <span className="text-xs text-white font-semibold">{d.count}</span>
                            </div>
                        </div>
                        {isNormal && (
                            <span className="text-xs text-green-600 font-semibold shrink-0">✓ ICS</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Analytics = () => {
    const [data,        setData]        = useState(null);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [prevFilter,  setPrevFilter]  = useState('overall');
    const [activeParam, setActiveParam] = useState('Qmax');

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await analyticsAPI.getDashboard();
                if (isMounted) setData(res.data);
            } catch (err) {
                if (isMounted)
                    setError(err.response?.data?.message || 'Failed to load analytics');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        load();
        return () => { isMounted = false; };
    }, []);

    // ── Filtered prevalence (memoized) ────────────────────────────────────────
    const filteredPrevalence = useMemo(() => {
        if (!data) return { BOO_pct: 0, DUA_pct: 0, DOA_pct: 0, DESD_pct: 0 };

        if (prevFilter === 'overall') return data.diseasePrevalence;

        if (prevFilter === 'Male' || prevFilter === 'Female') {
            const raw = data.prevalenceByGender?.[prevFilter] || {};
            return { BOO_pct: raw.BOO ?? 0, DUA_pct: raw.DUA ?? 0, DOA_pct: raw.DOA ?? 0, DESD_pct: raw.DESD ?? 0 };
        }

        // IPSS band
        const raw = data.prevalenceByIPSS?.[prevFilter] || {};
        return { BOO_pct: raw.BOO ?? 0, DUA_pct: raw.DUA ?? 0, DOA_pct: raw.DOA ?? 0, DESD_pct: raw.DESD ?? 0 };
    }, [prevFilter, data]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) return <SkeletonDashboard />;

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error) return (
        <div className="mt-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
            <p className="text-red-700 font-semibold text-base">Failed to load analytics</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
                Retry
            </button>
        </div>
    );

    if (!data) return null;

    // ── Destructure live data ─────────────────────────────────────────────────
    const {
        demographics      = [],
        keyMetrics        = {},
        sensoryProfile    = [],
        complianceRisk    = [],
        qualityMetrics    = {},
        ageDiseaseHeatmap = [],
        ipssBoxPlot       = [],
        paramDistributions= {},
    } = data;

    const totalReports = demographics.reduce((s, d) => s + (d.reports || 0), 0);

    // Sort compliance risk into defined order
    const sortedCompliance = COMPLIANCE_RISK_ORDER
        .map((label, i) => ({
            ...(complianceRisk.find(c => c._id === label) || { _id: label, count: 0 }),
            colorClass: COMPLIANCE_COLORS[i],
        }));

    // ── 4a — prevalence bars + pie ────────────────────────────────────────────
    const prevalenceBars = [
        { key: 'BOO',  label: 'Bladder Outlet Obstruction (BOO)',               pct: filteredPrevalence.BOO_pct  ?? 0, color: DISEASE_COLORS.BOO  },
        { key: 'DUA',  label: 'Detrusor Underactivity (DUA)',                    pct: filteredPrevalence.DUA_pct  ?? 0, color: DISEASE_COLORS.DUA  },
        { key: 'DOA',  label: 'Detrusor Overactivity (DOA)',                      pct: filteredPrevalence.DOA_pct  ?? 0, color: DISEASE_COLORS.DOA  },
        { key: 'DESD', label: 'Detrusor-External Sphincter Dyssynergia (DESD)',  pct: filteredPrevalence.DESD_pct ?? 0, color: DISEASE_COLORS.DESD },
    ];

    const pieData = prevalenceBars
        .filter(d => d.pct > 0)
        .map(d => ({ name: d.key, value: d.pct, color: d.color }));

    // ── 4b — heatmap bar data ─────────────────────────────────────────────────
    const heatmapBarData = ageDiseaseHeatmap.map(row => ({
        ageGroup: row.ageGroup,
        BOO: row.BOO  ?? 0,
        DUA: row.DUA  ?? 0,
        DOA: row.DOA  ?? 0,
        DESD: row.DESD ?? 0,
    }));

    // ── 4d — current param data ───────────────────────────────────────────────
    const currentParamData  = paramDistributions[activeParam] || [];
    const currentICSNormals = ICS_RANGES[activeParam]?.normalBuckets || [];

    // ── Insight text helper ───────────────────────────────────────────────────
    const insightText = () => {
        const d = filteredPrevalence;
        const dominant = prevalenceBars.reduce((a, b) => a.pct > b.pct ? a : b);
        if (prevFilter === 'Male')            return `BOO is ${d.BOO_pct}% in males — typically 3× higher than females, consistent with BPH patterns.`;
        if (prevFilter === 'Female')          return `DUA (${d.DUA_pct}%) and DOA (${d.DOA_pct}%) dominate in females relative to males.`;
        if (prevFilter === 'Severe (20–35)') return `Severe IPSS patients show highest BOO (${d.BOO_pct}%) & DUA (${d.DUA_pct}%) overlap — indicating mixed pathology.`;
        return `${dominant.key} dominates at ${dominant.pct}% across this cohort.`;
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-8 mt-8 pb-12">

            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                <h2 className="text-2xl font-bold">Urodynamic Analytics Overview</h2>
                <p className="text-indigo-100 text-sm mt-1">
                    Population trends, disease burden and clinical insights
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                    {[
                        { label: 'Total Reports',      value: totalReports.toLocaleString() },
                        { label: 'Avg Qmax',           value: keyMetrics.Qmax ?? '—',   unit: 'ml/s'  },
                        { label: 'Avg PVR',            value: keyMetrics.PVR  ?? '—',   unit: 'ml'    },
                        { label: 'Verification Rate',  value: `${qualityMetrics.verified_pct ?? 0}%`  },
                    ].map(({ label, value, unit }) => (
                        <div key={label} className="bg-white bg-opacity-15 rounded-xl p-4">
                            <p className="text-indigo-800 text-xs font-medium">{label}</p>
                            <p className="text-black text-2xl md:text-3xl font-bold mt-1">
                                {value}
                                {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Demographics + Key Metrics ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <SectionCard title="Demographics" icon="👥" subtitle="Reports by gender">
                    {demographics.length === 0 ? (
                        <p className="text-sm text-gray-400">No demographic data available</p>
                    ) : (
                        demographics.map((d) => (
                            <div key={d.gender}
                                 className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg
                                        ${d.gender === 'Male' ? 'bg-blue-100' : 'bg-pink-100'}`}>
                                        {d.gender === 'Male' ? '♂' : '♀'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{d.gender || 'Unknown'}</p>
                                        <p className="text-xs text-gray-400">
                                            Avg age {d.avgAge ?? '—'} yrs
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">{d.reports}</p>
                                    <p className="text-xs text-gray-400">reports</p>
                                </div>
                            </div>
                        ))
                    )}
                </SectionCard>

                <SectionCard title="Key Urodynamic Averages" icon="📊" subtitle="Cohort mean values">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Qmax',       value: keyMetrics.Qmax,       unit: 'ml/s',      flag: (keyMetrics.Qmax ?? 999) < 10    },
                            { label: 'PVR',        value: keyMetrics.PVR,        unit: 'ml',        flag: (keyMetrics.PVR  ?? 0)   > 100   },
                            { label: 'MCC',        value: keyMetrics.capacity,   unit: 'ml',        flag: false                            },
                            { label: 'Compliance', value: keyMetrics.compliance, unit: 'ml/cmH₂O',  flag: false                            },
                            { label: 'BOOI',       value: keyMetrics.BOOI,       unit: '',          flag: (keyMetrics.BOOI ?? 0)   > 40    },
                            { label: 'BCI',        value: keyMetrics.BCI,        unit: '',          flag: (keyMetrics.BCI  ?? 999) < 100   },
                        ].map(m => (
                            <div key={m.label}
                                 className={`rounded-lg p-3 border ${m.flag
                                    ? 'border-orange-200 bg-orange-50'
                                    : 'border-gray-100 bg-gray-50'}`}>
                                <p className="text-xs text-gray-500">{m.label}</p>
                                <p className={`text-lg font-bold ${m.flag ? 'text-orange-600' : 'text-gray-900'}`}>
                                    {m.value ?? '—'}
                                    {m.unit && <span className="text-xs font-normal text-gray-400 ml-1">{m.unit}</span>}
                                </p>
                                {m.flag && <p className="text-xs text-orange-500 mt-0.5">⚠ Outside threshold</p>}
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                4a — DISEASE PREVALENCE TRACKER
            ══════════════════════════════════════════════════════════════════ */}
            <SectionCard
                title="Disease Prevalence Tracker"
                icon="🔬"
                subtitle="% of reports positive for each condition — filterable by gender and IPSS severity"
            >
                <div className="flex flex-wrap gap-2 mb-6">
                    {['overall','Male','Female','Mild (0–7)','Moderate (8–19)','Severe (20–35)'].map(f => (
                        <FilterPill
                            key={f}
                            label={f === 'overall' ? 'All Patients' : f}
                            active={prevFilter === f}
                            onClick={() => setPrevFilter(f)}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    {/* Animated bars */}
                    <div className="space-y-5">
                        {prevalenceBars.map(b => (
                            <div key={b.key} className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-700 font-medium flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full inline-block"
                                              style={{ background: b.color }} />
                                        {b.label}
                                    </span>
                                    <span className="font-bold text-gray-900">{b.pct}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                    <div
                                        className="h-3 rounded-full transition-all duration-700"
                                        style={{ width: `${b.pct}%`, backgroundColor: b.color }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                            <p className="text-xs text-indigo-700 font-medium">💡 {insightText()}</p>
                        </div>
                    </div>

                    {/* Donut */}
                    <div className="flex flex-col items-center">
                        {pieData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%" cy="50%"
                                            innerRadius={55} outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                            label={({ name, value }) => `${name} ${value}%`}
                                            labelLine={false}
                                        >
                                            {pieData.map((entry) => (
                                                <Cell key={entry.name} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v) => `${v}%`} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex flex-wrap justify-center gap-3 mt-1">
                                    {pieData.map(d => (
                                        <span key={d.name}
                                              className="flex items-center gap-1.5 text-xs text-gray-600">
                                            <span className="w-2.5 h-2.5 rounded-full"
                                                  style={{ background: d.color }} />
                                            {d.name}
                                        </span>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-400">No data for selected filter</p>
                        )}
                    </div>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════════
                4b — AGE–DISEASE HEATMAP
            ══════════════════════════════════════════════════════════════════ */}
            <SectionCard
                title="Age–Disease Correlation Heatmap"
                icon="🌡️"
                subtitle="Disease prevalence (%) per age group — darker = higher burden"
            >
                {ageDiseaseHeatmap.length === 0 ? (
                    <p className="text-sm text-gray-400">Insufficient data for heatmap</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* CSS heatmap table */}
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr>
                                            <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">
                                                Age
                                            </th>
                                            {['BOO','DUA','DOA','DESD'].map(d => (
                                                <th key={d}
                                                    className="text-center text-xs font-bold pb-3 px-3"
                                                    style={{ color: DISEASE_COLORS[d] }}>
                                                    {d}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ageDiseaseHeatmap.map(row => (
                                            <tr key={row.ageGroup}>
                                                <td className="text-xs font-semibold text-gray-600 pr-4 py-1.5 whitespace-nowrap">
                                                    {row.ageGroup}
                                                </td>
                                                {['BOO','DUA','DOA','DESD'].map(d => (
                                                    <td key={d} className="px-3 py-1.5 text-center">
                                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold
                                                            ${HEATMAP_COLORS(row[d] ?? 0)}`}>
                                                            {row[d] ?? 0}%
                                                        </span>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-2 mt-4 flex-wrap">
                                <span className="text-xs text-gray-400">Prevalence:</span>
                                {[
                                    { label: '<5%',   cls: 'bg-gray-50 text-gray-500 border border-gray-200' },
                                    { label: '5–10%', cls: 'bg-yellow-100 text-gray-700'  },
                                    { label: '10–20%',cls: 'bg-yellow-300 text-gray-900'  },
                                    { label: '20–30%',cls: 'bg-orange-400 text-white'     },
                                    { label: '30–40%',cls: 'bg-red-400 text-white'        },
                                    { label: '40%+',  cls: 'bg-red-600 text-white'        },
                                ].map(l => (
                                    <span key={l.label}
                                          className={`text-xs px-2 py-0.5 rounded ${l.cls}`}>
                                        {l.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Grouped bar chart */}
                        <div>
                            <p className="text-xs text-gray-500 mb-3">Grouped bar view</p>
                            <ResponsiveContainer width="100%" height={230}>
                                <BarChart data={heatmapBarData} barGap={2} barCategoryGap="30%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="ageGroup" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 60]} />
                                    <Tooltip formatter={(v) => `${v}%`} />
                                    <Legend iconType="circle" iconSize={8}
                                            wrapperStyle={{ fontSize: 11 }} />
                                    {['BOO','DUA','DOA','DESD'].map(d => (
                                        <Bar key={d} dataKey={d} fill={DISEASE_COLORS[d]}
                                             radius={[3,3,0,0]} />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-xs text-amber-700">
                        💡 BOO and DUA both rise steeply with age, consistent with BPH-related obstruction
                        and age-related detrusor degeneration. DOA typically peaks in younger patients (20–30).
                    </p>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════════
                4c — IPSS BOX PLOTS
            ══════════════════════════════════════════════════════════════════ */}
            <SectionCard
                title="IPSS Score Distribution by Diagnosis"
                icon="📋"
                subtitle="Box plots showing symptom score spread per diagnosis — outliers in red"
            >
                {ipssBoxPlot.length === 0 ? (
                    <p className="text-sm text-gray-400">Insufficient IPSS data</p>
                ) : (
                    <div className="space-y-4">
                        {/* X-axis scale */}
                        <div className="flex items-center gap-4 ml-16">
                            <div className="flex-1 flex justify-between text-xs text-gray-400 px-2">
                                {[0,5,10,15,20,25,30,35].map(n => (
                                    <span key={n}>{n}</span>
                                ))}
                            </div>
                        </div>

                        {ipssBoxPlot.map(d => (
                            <BoxPlotRow key={d.diagnosis} data={d} maxVal={35} />
                        ))}

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mt-2 pt-4 border-t border-gray-100 text-xs text-gray-500">
                            <span className="flex items-center gap-2">
                                <span className="inline-block w-8 h-4 bg-indigo-100 border border-indigo-400 rounded" />
                                IQR (25th–75th %ile)
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="inline-block w-0.5 h-4 bg-indigo-600 rounded" />
                                Median
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                                Outlier
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="inline-block w-8 h-4 bg-indigo-50 border border-dashed border-indigo-300 rounded" />
                                Moderate band (8–19)
                            </span>
                        </div>
                    </div>
                )}

                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-700">
                        💡 Wide IQR in DUA indicates symptom underreporting — patients may have significant
                        urodynamic abnormality despite low IPSS scores. DESD typically shows the highest
                        median IPSS, reflecting severe symptom burden.
                    </p>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════════
                4d — PARAMETER DISTRIBUTIONS
            ══════════════════════════════════════════════════════════════════ */}
            <SectionCard
                title="Urodynamic Parameter Distributions"
                icon="📈"
                subtitle="Patient count per measurement range — green = ICS normal range"
            >
                {/* Param selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {Object.entries(PARAM_META).map(([key, meta]) => (
                        <button
                            key={key}
                            onClick={() => setActiveParam(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                                activeParam === key
                                    ? 'text-white shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                            }`}
                            style={activeParam === key
                                ? { backgroundColor: meta.color, borderColor: meta.color }
                                : {}}
                        >
                            {meta.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Horizontal histogram */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-700">
                                {PARAM_META[activeParam].label}
                                <span className="text-gray-400 font-normal ml-1">
                                    ({PARAM_META[activeParam].unit})
                                </span>
                            </p>
                            <span className="text-xs px-2 py-1 bg-green-50 text-green-700
                                             rounded-full border border-green-200 font-medium">
                                {ICS_RANGES[activeParam]?.normal || '—'}
                            </span>
                        </div>
                        {currentParamData.length > 0 ? (
                            <HistogramBar
                                data={currentParamData}
                                normalBuckets={currentICSNormals}
                                color={PARAM_META[activeParam].color}
                            />
                        ) : (
                            <p className="text-sm text-gray-400">No data available</p>
                        )}
                        <p className="text-xs text-gray-400 mt-3">
                            ✓ Green bars = ICS normal range. Faded bars = outside reference.
                        </p>
                    </div>

                    {/* Recharts bar */}
                    <div>
                        <p className="text-xs text-gray-500 mb-3">Distribution chart</p>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={currentParamData} barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" radius={[4,4,0,0]}>
                                    {currentParamData.map((entry) => (
                                        <Cell
                                            key={entry.bucket}
                                            fill={currentICSNormals.includes(entry.bucket)
                                                ? ICS_BORDER_COLOR
                                                : PARAM_META[activeParam].color}
                                            opacity={currentICSNormals.includes(entry.bucket) ? 1 : 0.6}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ICS summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-100">
                    {Object.entries(PARAM_META).map(([key, meta]) => {
                        const dist        = paramDistributions[key] || [];
                        const normals     = ICS_RANGES[key]?.normalBuckets || [];
                        const normalCount = dist
                            .filter(d => normals.includes(d.bucket))
                            .reduce((s, d) => s + d.count, 0);
                        const totalCount  = dist.reduce((s, d) => s + d.count, 0);
                        const normalPct   = totalCount
                            ? Math.round((normalCount / totalCount) * 100)
                            : 0;
                        return (
                            <div
                                key={key}
                                onClick={() => setActiveParam(key)}
                                className={`rounded-xl p-4 border text-center cursor-pointer transition-all ${
                                    activeParam === key
                                        ? 'border-indigo-300 bg-indigo-50'
                                        : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                <p className="text-xs text-gray-500 mb-1">{meta.label}</p>
                                <p className="text-2xl font-bold" style={{ color: meta.color }}>
                                    {normalPct}%
                                </p>
                                <p className="text-xs text-gray-400">within ICS normal</p>
                            </div>
                        );
                    })}
                </div>
            </SectionCard>

            {/* ── Sensory + Compliance ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <SectionCard title="Sensory Classification" icon="🧠"
                             subtitle="Bladder sensory profile distribution">
                    {sensoryProfile.length === 0 ? (
                        <p className="text-sm text-gray-400">No data available</p>
                    ) : (() => {
                        const total = sensoryProfile.reduce((a, b) => a + b.count, 0);
                        return (
                            <div className="space-y-3">
                                {sensoryProfile.map((s) => {
                                    const pct = total ? Math.round((s.count / total) * 100) : 0;
                                    return (
                                        <div key={s._id}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700">{s._id}</span>
                                                <span className="font-semibold">
                                                    {s.count}
                                                    <span className="text-gray-400 font-normal ml-1">({pct}%)</span>
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2.5 rounded-full">
                                                <div className="h-2.5 rounded-full bg-indigo-500 transition-all"
                                                     style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </SectionCard>

                <SectionCard title="Compliance Risk Stratification" icon="⚠️"
                             subtitle="Bladder compliance risk distribution">
                    {sortedCompliance.every(c => c.count === 0) ? (
                        <p className="text-sm text-gray-400">No data available</p>
                    ) : (() => {
                        const total = sortedCompliance.reduce((a, b) => a + b.count, 0);
                        return (
                            <div className="space-y-3">
                                {sortedCompliance.map((c) => {
                                    const pct = total ? Math.round((c.count / total) * 100) : 0;
                                    return (
                                        <div key={c._id}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700">{c._id}</span>
                                                <span className="font-semibold">
                                                    {c.count}
                                                    <span className="text-gray-400 font-normal ml-1">({pct}%)</span>
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2.5 rounded-full">
                                                <div className={`h-2.5 rounded-full transition-all ${c.colorClass}`}
                                                     style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </SectionCard>
            </div>

            {/* ── Verification Rate ── */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white
                            shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-300">Verification Rate</p>
                    <p className="text-5xl font-bold mt-1">
                        {qualityMetrics.verified_pct ?? 0}%
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        {qualityMetrics.verified ?? 0} of {qualityMetrics.total ?? totalReports} reports
                        reviewed & verified
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 text-sm">Target</p>
                    <p className="text-3xl font-bold text-green-400">100%</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Use Review & Edit workflow to verify
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Analytics;
