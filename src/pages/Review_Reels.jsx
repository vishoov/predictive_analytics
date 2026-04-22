// src/pages/Review_Reels.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios.utils';
import ReportStatusBadge from '../components/reviews/ReportStatusBadge.jsx';


const IconEdit = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DISEASES = [
  { key: 'detrusorUnderactivityDUA', label: 'DUA', cls: 'bg-purple-500 text-white border-purple-300/30' },
  { key: 'bladderOutletObstructionBOO', label: 'BOO', cls: 'bg-orange-500 text-white border-orange-300/30' },
  { key: 'detrusorOveractivityDOA', label: 'DOA', cls: 'bg-emerald-500 text-white border-emerald-300/30' },
  { key: 'detrusorExternalSphincterDyssynergiaDESD', label: 'DESD', cls: 'bg-sky-500 text-white border-sky-300/30' },
];

const METRICS = [
  { key: 'ipssScore', label: 'IPSS', unit: '' },
  { key: 'maximumFlowRateQmax', label: 'Qmax', unit: 'ml/s' },
  { key: 'postVoidResidualVolume', label: 'PVR', unit: 'ml' },
];

const getImageList = (report) => {
  if (!report?.images?.length) return [];
  return report.images.map((img) => img?.url).filter(Boolean).slice(0, 2);
};


const ReelCard = ({ report, onStatusChange, onEdit, index, activeIndex }) => {
  const images = getImageList(report);
  const isActive = index === activeIndex;

  return (
    // ✅ removed snap-start — now just sticky with smooth free scroll
    <div
      className="sticky top-0 w-full px-3 py-4 transition-all duration-300"
      style={{
        zIndex: index + 1,
        transform: isActive ? 'scale(1)' : 'scale(0.97)',
        opacity: isActive ? 1 : 0.6,
      }}
    >
      <div className="rounded-[28px] bg-gradient-to-b from-[#111827] to-[#020617] text-white border border-white/10 shadow-[0_18px_50px_rgba(15,23,42,0.45)] transition-all duration-300">

        {/* ── Header ── */}
        <div className="px-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold leading-tight truncate">
                {report.patientId}
              </div>
              <div className="mt-1 text-[11px] text-white/55">
                {report.age} years · {report.gender}
              </div>
            </div>
            <ReportStatusBadge
              reportId={report._id}
              status={report.status ?? 'Pending'}
              onStatusChange={(newStatus) => onStatusChange(report._id, newStatus)}
            />
          </div>
        </div>

        {/* ── Images ── */}
        <div className="pt-4 space-y-3">
          {images.length > 0 ? (
            images.map((src, idx) => (
              <div key={idx} className="overflow-hidden bg-black ring-1 ring-white/10 shadow-md">
                <img
                  src={src}
                  alt={`Graph ${idx + 1}`}
                  className="w-full h-[210px] object-contain bg-black"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-8 text-center text-sm text-white/55">
              No graph images available
            </div>
          )}
        </div>

        {/* ── Metrics ── */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-1 gap-2">
            {METRICS.map(({ key, label, unit }) => {
              const val = report[key];
              if (val == null) return null;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-2xl bg-white/7 px-4 py-3 ring-1 ring-white/10"
                >
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</div>
                  <div className="text-sm font-semibold text-white">
                    {Number(val).toFixed(1)}
                    {unit && <span className="ml-1 text-xs text-white/60">{unit}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Disease tags ── */}
        <div className="px-5 pt-4">
          <div className="flex flex-wrap gap-2">
            {DISEASES.map(({ key, label, cls }) =>
              report[key] ? (
                <span
                  key={key}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-sm ${cls}`}
                >
                  {label}
                </span>
              ) : null
            )}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="px-5 pt-5 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onEdit}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white ring-1 ring-white/10 hover:bg-white/15 transition-colors active:scale-[0.99]"
            >
              <IconEdit />
              View Report
            </button>
            <div className="flex-1 flex items-center justify-center rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
              <ReportStatusBadge
                reportId={report._id}
                status={report.status ?? 'Pending'}
                onStatusChange={(newStatus) => onStatusChange(report._id, newStatus)}
                readonly
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


const Review_Reels = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    let mounted = true;

    const fetchReports = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/view/uro_reports/');
        const data = Array.isArray(res?.data?.reports) ? res.data.reports : [];
        if (mounted) setReports(data);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || err.message || 'Failed to load reports');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReports();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - containerTop);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [reports]);

  const handleStatusChange = (reportId, newStatus) => {
    setReports((prev) =>
      prev.map((r) => r._id === reportId ? { ...r, status: newStatus } : r)
    );
  };

  const openEdit = (reportId) => navigate(`/admin-dashboard/reports/${reportId}`);

  const pendingReports = reports.filter(
    (r) => String(r.status || '').trim().toLowerCase() !== 'verified'
  );

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300/40 border-t-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full p-6 bg-slate-50">
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 flex items-center justify-center py-3">

      <div className="h-full w-full max-w-[430px] flex flex-col rounded-[28px] shadow-[0_24px_70px_rgba(0,0,0,0.25)] border border-black/8 overflow-hidden">

        {/* ── Scroll container ── */}
        <div
          ref={scrollRef}
          // ✅ removed snap-y snap-mandatory — free smooth scroll now
          className="flex-1 overflow-y-auto bg-slate-100"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',   // ✅ native smooth scroll
          }}
        >
          {pendingReports.length > 0 ? (
            pendingReports.map((report, index) => (
              <div
                key={report._id}
                ref={(el) => (cardRefs.current[index] = el)}
                className="h-full relative"
              >
                <ReelCard
                  report={report}
                  index={index}
                  activeIndex={activeIndex}
                  onStatusChange={handleStatusChange}
                  onEdit={() => openEdit(report._id)}
                />
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-400">
              No reports pending review.
            </div>
          )}
        </div>

        {/* ── Dot indicator ── */}
        {pendingReports.length > 1 && (
          <div className="shrink-0 flex items-center justify-center gap-1.5 py-3 bg-white/80 backdrop-blur-sm border-t border-black/5">
            {pendingReports.map((_, i) => (
              <button
                key={i}
                onClick={() => cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth' })}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-5 h-2 bg-indigo-500' : 'w-2 h-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Review_Reels;