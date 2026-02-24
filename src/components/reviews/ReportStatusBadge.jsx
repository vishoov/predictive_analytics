import React, { useState, memo } from 'react';
import { reportsAPI } from '../../utils/analytics.utils';

const STATUS_CONFIG = {
    'Pending': {
        label: 'Pending',
        icon: '⏳',
        classes: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        dotColor: 'bg-yellow-400',
    },
    'Needs Review': {
        label: 'Needs Review',
        icon: '🖼️',
        classes: 'bg-blue-100 text-blue-800 border-blue-200',
        dotColor: 'bg-blue-400',
    },
    'Verified': {
        label: 'Verified',
        icon: '✅',
        classes: 'bg-green-100 text-green-800 border-green-200',
        dotColor: 'bg-green-400',
    },
    'Rejected': {
        label: 'Rejected',
        icon: '❌',
        classes: 'bg-red-100 text-red-800 border-red-200',
        dotColor: 'bg-red-400',
    },
};

// What each status can transition to
const TRANSITIONS = {
    'Pending':      ['Needs Review', 'Verified', 'Rejected'],
    'Needs Review': ['Pending', 'Verified', 'Rejected'],
    'Verified':     ['Pending', 'Needs Review', 'Rejected'],
    'Rejected':     ['Pending', 'Needs Review', 'Verified'],
};

const ReportStatusBadge = memo(({ reportId, status, onStatusChange, readonly = false }) => {
    const [updating, setUpdating] = useState(false);
    const [open, setOpen] = useState(false);

    // Fallback to Pending if an unrecognised status comes in
    const safeStatus = STATUS_CONFIG[status] ? status : 'Pending';
    const config = STATUS_CONFIG[safeStatus];

    const handleChange = async (newStatus) => {
        if (newStatus === safeStatus) return setOpen(false);
        setUpdating(true);
        setOpen(false);
        try {
            const res = await reportsAPI.updateStatus(reportId, newStatus);
            onStatusChange?.(res.data.status);
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setUpdating(false);
        }
    };

    // ── Read-only variant — just a display badge, no dropdown ────────────────
    if (readonly) {
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.classes}`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotColor}`} />
                {config.icon} {config.label}
            </span>
        );
    }

    // ── Interactive variant — dropdown to change status ───────────────────────
    return (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={() => !updating && setOpen(prev => !prev)}
                disabled={updating}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${config.classes} ${
                    updating
                        ? 'opacity-60 cursor-not-allowed'
                        : 'cursor-pointer hover:brightness-95 hover:shadow-sm'
                }`}
            >
                {updating ? (
                    <svg className="w-3 h-3 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                ) : (
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotColor}`} />
                )}
                {config.icon} {config.label}
                {!updating && (
                    <svg className={`w-3 h-3 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Click outside to close */}
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider px-3 pt-2.5 pb-1">
                            Change status to
                        </p>
                        {TRANSITIONS[safeStatus].map((s) => {
                            const c = STATUS_CONFIG[s];
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => handleChange(s)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dotColor}`} />
                                    <span className="text-sm font-medium text-gray-700">
                                        {c.icon} {c.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
});

export default ReportStatusBadge;
export { STATUS_CONFIG };
