import React from 'react';

const analyticsData = {
  totalPatients: 682,
  demographics: [
    { gender: 'Male', reports: 905, avgAge: 45.9 },
    { gender: 'Female', reports: 352, avgAge: 46 }
  ],
  diseasePrevalence: {
    BOO_pct: 18.9,
    DUA_pct: 31.5,
    DOA_pct: 7.8,
    DESD_pct: 1.8
  },
  keyMetrics: {
    Qmax: 6.6,
    PVR: 152.3,
    capacity: 272.6,
    compliance: 87.7,
    BOOI: 34.3,
    BCI: 82.3
  },
  sensoryProfile: [
    { _id: 'Hypersensitive', count: 965 },
    { _id: 'Normosensitive', count: 245 },
    { _id: 'Hyposensitive', count: 47 }
  ],
  complianceRisk: [
    { _id: 'Poor (<10)', count: 472 },
    { _id: 'Borderline (10–20)', count: 162 },
    { _id: 'Normal (>20)', count: 623 }
  ],
  qualityMetrics: {
    verified_pct: 0.2
  }
};

const StatCard = ({ label, value, unit }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-900 mt-2">
      {value}
      {unit && <span className="text-sm font-medium text-gray-500 ml-1">{unit}</span>}
    </p>
  </div>
);

const ProgressBar = ({ label, value, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-800">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
      <div
        className={`${color} h-2 rounded-full transition-all`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const Analytics = () => {
  const {
    demographics,
    diseasePrevalence,
    keyMetrics,
    sensoryProfile,
    complianceRisk,
    qualityMetrics
  } = analyticsData;

  return (
    <div className="space-y-8 mt-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Urodynamic Analytics Overview</h2>
        <p className="text-indigo-100 text-sm mt-1">
          Population trends, disease burden and key functional metrics
        </p>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demographics.map((d) => (
          <div
            key={d.gender}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">{d.gender} Patients</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {d.reports}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Avg Age: {d.avgAge} yrs
            </p>
          </div>
        ))}
      </div>

      {/* Disease Prevalence */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Disease Prevalence (% of reports)
        </h3>

        <div className="space-y-4">
          <ProgressBar label="Bladder Outlet Obstruction (BOO)" value={diseasePrevalence.BOO_pct} color="bg-orange-500" />
          <ProgressBar label="Detrusor Underactivity (DUA)" value={diseasePrevalence.DUA_pct} color="bg-purple-500" />
          <ProgressBar label="Detrusor Overactivity (DOA)" value={diseasePrevalence.DOA_pct} color="bg-green-500" />
          <ProgressBar label="DESD" value={diseasePrevalence.DESD_pct} color="bg-blue-500" />
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Key Urodynamic Metrics (Averages)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Qmax" value={keyMetrics.Qmax} unit="ml/s" />
          <StatCard label="PVR" value={keyMetrics.PVR} unit="ml" />
          <StatCard label="Capacity" value={keyMetrics.capacity} unit="ml" />
          <StatCard label="Compliance" value={keyMetrics.compliance} unit="ml/cmH₂O" />
          <StatCard label="BOOI" value={keyMetrics.BOOI} />
          <StatCard label="BCI" value={keyMetrics.BCI} />
        </div>
      </div>

      {/* Sensory Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Sensory Classification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sensoryProfile.map((s) => (
            <div
              key={s._id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <p className="text-sm text-gray-500">{s._id}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {s.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Risk */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Compliance Risk Stratification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {complianceRisk.map((c) => (
            <div
              key={c._id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <p className="text-sm text-gray-500">{c._id}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {c.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-lg">
        <p className="text-sm text-gray-300">Verification Rate</p>
        <p className="text-4xl font-bold mt-2">
          {qualityMetrics.verified_pct}%
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Reports reviewed & verified
        </p>
      </div>

    </div>
  );
};

export default Analytics;
