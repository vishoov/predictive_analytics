import React, { useState, useEffect, useCallback, memo } from 'react';
import { reportsAPI } from '../../utils/analytics.utils'; // ✅ same as ReportsList
import axios from 'axios';

// ─── Graph Upload Card ────────────────────────────────────────────────────────
const GraphUploadCard = memo(({ report, onUpdate }) => {
  const [files, setFiles] = useState({ filling: null, voiding: null });
  const [previews, setPreviews] = useState({ filling: null, voiding: null });
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const LABELS = { filling: 'Filling Phase', voiding: 'Voiding Phase' };

  // Get disease badges — same logic as ReportsList
  const getReportDiseases = (report) => {
    const diseases = [];
    if (report.detrusorExternalSphincterDyssynergiaDESD) diseases.push('DESD');
    if (report.detrusorUnderactivityDUA) diseases.push('DUA');
    if (report.detrusorOveractivityDOA) diseases.push('DOA');
    if (report.bladderOutletObstructionBOO) diseases.push('BOO');
    return diseases;
  };

  const getDiseaseBadgeColor = (code) => {
    const colors = {
      DESD: 'bg-blue-100 text-blue-800',
      DUA: 'bg-purple-100 text-purple-800',
      DOA: 'bg-green-100 text-green-800',
      BOO: 'bg-orange-100 text-orange-800',
    };
    return colors[code] || 'bg-gray-100 text-gray-800';
  };

  const handleFileChange = useCallback((type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) return setError('Only JPEG, PNG, WebP allowed.');
    if (file.size > 5 * 1024 * 1024) return setError('Max file size is 5MB.');
    setError('');
    setFiles(prev => ({ ...prev, [type]: file }));
    setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
  }, []);

  const clearFile = useCallback((type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setPreviews(prev => ({ ...prev, [type]: null }));
    setError('');
  }, []);

  const handleUpload = useCallback(async () => {
    if (!files.filling && !files.voiding)
      return setError('Select at least one graph to upload.');

    setUploading(true); setError(''); setSuccess('');
    const formData = new FormData();
    if (files.filling) formData.append('images', files.filling);
    if (files.voiding) formData.append('images', files.voiding);

    try {
      const res = await axios.post(`/reports/upload/${report._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Graphs uploaded successfully!');
      setFiles({ filling: null, voiding: null });
      setPreviews({ filling: null, voiding: null });
      onUpdate(report._id, res.data.images, null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [files, report._id, onUpdate]);

  const handleDelete = useCallback(async (publicId) => {
    if (!window.confirm('Are you sure you want to delete this graph?')) return;
    setDeletingId(publicId); setError('');
    try {
      await axios.delete(
        `/api/reports/${report._id}/images/${encodeURIComponent(publicId)}`
      );
      onUpdate(report._id, null, publicId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete image.');
    } finally {
      setDeletingId(null);
    }
  }, [report._id, onUpdate]);

  const diseases = getReportDiseases(report);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">

      {/* Card Header — same indigo style as ReportsList */}
      <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-9 w-9 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {report.patientId?.substring(0, 2).toUpperCase() || 'NA'}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{report.patientId || 'Unknown'}</p>
              <p className="text-blue-100 text-xs">
                {report.age ? `Age ${report.age}` : 'Age N/A'} ·{' '}
                {report.gender || 'N/A'}
              </p>
            </div>
          </div>
          {/* Graphs count badge */}
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            report.images?.length >= 2
              ? 'bg-green-400/30 text-green-100'
              : report.images?.length === 1
              ? 'bg-yellow-400/30 text-yellow-100'
              : 'bg-white/20 text-white/80'
          }`}>
            {report.images?.length || 0}/2 Graphs
          </span>
        </div>

        {/* Disease badges */}
        {diseases.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {diseases.map(d => (
              <span key={d}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white">
                {d}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Upload Zones */}
        <div className="grid grid-cols-2 gap-3">
          {['filling', 'voiding'].map((type) => (
            <div key={type} className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {LABELS[type]}
              </p>
              <div className={`relative group rounded-xl border-2 border-dashed transition-all duration-200 ${
                previews[type]
                  ? 'border-indigo-400 bg-indigo-50/30'
                  : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/20 bg-gray-50'
              }`}>
                {previews[type] ? (
                  <div className="relative">
                    <img src={previews[type]} alt={`${LABELS[type]} preview`}
                      className="w-full h-28 object-contain rounded-xl p-1.5" />
                    <button onClick={() => clearFile(type)}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow transition-colors focus:outline-none"
                      aria-label={`Remove ${LABELS[type]}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label htmlFor={`${report._id}-${type}`}
                    className="flex flex-col items-center justify-center h-28 cursor-pointer gap-1.5 p-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500 group-hover:text-indigo-600 transition-colors font-medium">
                      Click to upload
                    </p>
                    <p className="text-[10px] text-gray-400">PNG, JPG · Max 5MB</p>
                  </label>
                )}
                <input id={`${report._id}-${type}`} type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileChange(type, e)} />
              </div>
            </div>
          ))}
        </div>

        {/* Feedback */}
        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        {/* Upload Button */}
        <button onClick={handleUpload}
          disabled={(!files.filling && !files.voiding) || uploading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          {uploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              Upload Graphs
            </>
          )}
        </button>

        {/* Saved Graphs */}
        {report.images?.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Saved Graphs</p>
            <div className="grid grid-cols-2 gap-2">
              {report.images.map((img, i) => (
                <div key={img.publicId || i}
                  className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                  <img src={img.url} alt={img.description || `Graph ${i + 1}`}
                    className="w-full h-24 object-contain p-1.5" />
                  <div className="px-2 py-1.5 flex items-center justify-between">
                    <p className="text-[10px] text-gray-500 truncate max-w-[60%]">
                      {img.description || `Graph ${i + 1}`}
                    </p>
                    <button onClick={() => handleDelete(img.publicId)}
                      disabled={deletingId === img.publicId}
                      className="text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors focus:outline-none"
                      aria-label="Delete graph">
                      {deletingId === img.publicId ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// ─── Main Page ────────────────────────────────────────────────────────────────
const GraphUpload = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const itemsPerPage = 12; // grid layout fits 12 well

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Uses exact same reportsAPI.search as ReportsList
        const response = await reportsAPI.search({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });

        if (isMounted) {
          // ✅ Correct shape: response.data.reports
          setReports(response.data.reports);
          setTotalPages(response.data.totalPages);
          setTotalReports(response.data.totalReports);
        }
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load reports');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchReports, 300);
    return () => { isMounted = false; clearTimeout(debounceTimer); };
  }, [currentPage, searchTerm]);

  const handleUpdate = useCallback((reportId, newImages, deletedPublicId) => {
    setReports(prev => prev.map(r => {
      if (r._id !== reportId) return r;
      if (deletedPublicId) {
        return { ...r, images: (r.images || []).filter(img => img.publicId !== deletedPublicId) };
      }
      return { ...r, images: [...(r.images || []), ...newImages] };
    }));
  }, []);

  // Stats from current page data
  const withGraphs = reports.filter(r => r.images?.length >= 2).length;
  const partial = reports.filter(r => r.images?.length === 1).length;
  const noGraphs = reports.filter(r => !r.images?.length).length;

  // Skeleton Card
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300" />
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="h-28 bg-gray-100 rounded-xl" />
          <div className="h-28 bg-gray-100 rounded-xl" />
        </div>
        <div className="h-9 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header — matches ReportsList gradient style */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Graph Upload</h1>
            <p className="text-blue-100 text-sm md:text-base">
              Attach filling & voiding phase graphs to urodynamic reports
            </p>
          </div>
          <div className="hidden md:flex w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Error Alert — identical to ReportsList */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg" role="alert">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards — same as ReportsList */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: totalReports, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-blue-100 text-blue-600' },
          { label: 'Complete (2/2)', value: withGraphs, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-green-100 text-green-600' },
          { label: 'Partial (1/2)', value: partial, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-yellow-100 text-yellow-600' },
          { label: 'No Graphs', value: noGraphs, icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', color: 'bg-red-100 text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${stat.color}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input type="text" value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by Patient ID..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-sm font-medium">
              {searchTerm ? 'No reports match your search' : 'No reports found'}
            </p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                Clear search
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {reports.map(report => (
            <GraphUploadCard key={report._id} report={report} onUpdate={handleUpdate} />
          ))}
        </div>
      )}

      {/* Pagination — identical pattern to ReportsList */}
      {!loading && totalPages > 1 && (
        <div className="bg-white px-4 py-3 border border-gray-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalReports)}</span> of{' '}
              <span className="font-medium">{totalReports}</span> reports
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                First
              </button>
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Previous
              </button>
              <div className="hidden sm:flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button key={i} onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}>
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Next
              </button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Last
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphUpload;
