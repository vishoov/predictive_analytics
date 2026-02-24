import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { reportsAPI } from '../../utils/analytics.utils';

const LABELS = { filling: 'Filling Phase Graph', voiding: 'Voiding Phase Graph' };
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// ─── Single Upload Zone ───────────────────────────────────────────────────────
const UploadZone = memo(({ type, reportId, preview, fileName, onFileSelect, onClear }) => {
    const [isDragging, setIsDragging] = useState(false);
    const dropRef = useRef(null);

    const validateAndSelect = useCallback((file) => {
        if (!file) return null;
        if (!ALLOWED_TYPES.includes(file.type)) return 'Only JPEG, PNG, or WebP images are allowed.';
        if (file.size > MAX_SIZE) return 'File size must be under 5MB.';
        return file;
    }, []);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!dropRef.current?.contains(e.relatedTarget)) {
            setIsDragging(false);
        }
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        const result = validateAndSelect(file);
        onFileSelect(type, result);
    }, [type, validateAndSelect, onFileSelect]);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {LABELS[type]}
            </label>
            <div
                ref={dropRef}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative group rounded-lg border-2 border-dashed transition-all duration-200 ${
                    isDragging
                        ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
                        : preview
                        ? 'border-indigo-400 bg-indigo-50/30'
                        : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/20 bg-gray-50'
                }`}
            >
                {preview ? (
                    <div className="relative">
                        <img
                            src={preview}
                            alt={`${LABELS[type]} preview`}
                            className="w-full h-48 object-contain p-2 rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={onClear}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow transition-colors focus:outline-none"
                            aria-label={`Remove ${LABELS[type]}`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <p className="px-3 pb-2 text-xs text-indigo-600 font-medium truncate">{fileName}</p>
                    </div>
                ) : (
                    <label
                        htmlFor={`graph-${reportId}-${type}`}
                        className="flex flex-col items-center justify-center h-48 cursor-pointer gap-2 p-4"
                    >
                        {isDragging ? (
                            <>
                                <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center animate-bounce">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-indigo-600">Drop to upload</p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">
                                    Click, drag & drop, or paste
                                </p>
                                <p className="text-xs text-gray-400">PNG, JPG, WebP · Max 5MB</p>
                            </>
                        )}
                    </label>
                )}
                <input
                    id={`graph-${reportId}-${type}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        const result = validateAndSelect(file);
                        onFileSelect(type, result);
                    }}
                />
            </div>
        </div>
    );
});

// ─── Main Component ───────────────────────────────────────────────────────────
const ReportGraphUpload = memo(({ reportId, images = [], onImagesUpdate }) => {
    const [graphFiles, setGraphFiles] = useState({ filling: null, voiding: null });
    const [graphPreviews, setGraphPreviews] = useState({ filling: null, voiding: null });
    const [graphUploading, setGraphUploading] = useState(false);
    const [graphError, setGraphError] = useState('');
    const [graphSuccess, setGraphSuccess] = useState('');
    const [deletingGraphId, setDeletingGraphId] = useState(null);

    // ── Paste handler ─────────────────────────────────────────────────────────
    useEffect(() => {
        const handlePaste = (e) => {
            const items = Array.from(e.clipboardData?.items || []);
            const imageItem = items.find(item => item.type.startsWith('image/'));
            if (!imageItem) return;

            const file = imageItem.getAsFile();
            if (!file) return;

            if (file.size > MAX_SIZE) {
                setGraphError('Pasted image exceeds 5MB limit.');
                return;
            }

            const targetType = !graphFiles.filling ? 'filling' : 'voiding';
            setGraphError('');
            setGraphSuccess('');
            setGraphFiles(prev => ({ ...prev, [targetType]: file }));
            setGraphPreviews(prev => ({
                ...prev,
                [targetType]: URL.createObjectURL(file),
            }));
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [graphFiles]);

    // ── File select ───────────────────────────────────────────────────────────
    const handleFileSelect = useCallback((type, result) => {
        if (typeof result === 'string') return setGraphError(result);
        if (!result) return;
        setGraphError('');
        setGraphSuccess('');
        setGraphFiles(prev => ({ ...prev, [type]: result }));
        setGraphPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(result) }));
    }, []);

    const clearGraphFile = useCallback((type) => {
        setGraphFiles(prev => ({ ...prev, [type]: null }));
        setGraphPreviews(prev => ({ ...prev, [type]: null }));
        setGraphError('');
    }, []);

    // ── Upload ────────────────────────────────────────────────────────────────
    const handleGraphUpload = useCallback(async () => {
        if (!graphFiles.filling && !graphFiles.voiding) {
            return setGraphError('Please select at least one graph to upload.');
        }

        setGraphUploading(true);
        setGraphError('');
        setGraphSuccess('');

        // Collect only selected files in order
        const filesToUpload = [graphFiles.filling, graphFiles.voiding].filter(Boolean);

        try {
            const res = await reportsAPI.uploadImages(reportId, filesToUpload);

            setGraphSuccess('Graphs uploaded successfully!');
            setGraphFiles({ filling: null, voiding: null });
            setGraphPreviews({ filling: null, voiding: null });

            // Pass updated images + new status back to parent
            onImagesUpdate(
                [...images, ...res.data.images],
                res.data.status
            );
        } catch (err) {
            setGraphError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setGraphUploading(false);
        }
    }, [graphFiles, reportId, images, onImagesUpdate]);

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleGraphDelete = useCallback(async (publicId) => {
        if (!window.confirm('Are you sure you want to delete this graph?')) return;

        setDeletingGraphId(publicId);
        setGraphError('');
        setGraphSuccess('');

        try {
            const res = await reportsAPI.deleteImage(reportId, publicId);

            // Pass updated images + potentially rolled-back status to parent
            onImagesUpdate(res.data.images, res.data.status);
        } catch (err) {
            setGraphError(err.response?.data?.message || 'Failed to delete graph.');
        } finally {
            setDeletingGraphId(null);
        }
    }, [reportId, images, onImagesUpdate]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <h2 className="text-xl font-bold text-blue-600 mb-1 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                Phase Graphs
            </h2>
            <p className="text-xs text-gray-400 mb-5">
                Click to browse · Drag & drop an image · or{' '}
                <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600 font-mono text-xs">
                    Ctrl+V
                </kbd>{' '}
                to paste from clipboard
            </p>

            {/* Upload Zones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {['filling', 'voiding'].map((type) => (
                    <UploadZone
                        key={type}
                        type={type}
                        reportId={reportId}
                        preview={graphPreviews[type]}
                        fileName={graphFiles[type]?.name}
                        onFileSelect={handleFileSelect}
                        onClear={() => clearGraphFile(type)}
                    />
                ))}
            </div>

            {/* Paste hint */}
            {graphFiles.filling && !graphFiles.voiding && (
                <p className="text-xs text-indigo-500 mb-4 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Paste again to fill the Voiding Phase slot
                </p>
            )}

            {/* Feedback */}
            {graphError && (
                <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {graphError}
                </div>
            )}
            {graphSuccess && (
                <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {graphSuccess}
                </div>
            )}

            {/* Upload Button */}
            <button
                type="button"
                onClick={handleGraphUpload}
                disabled={(!graphFiles.filling && !graphFiles.voiding) || graphUploading}
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
                {graphUploading ? (
                    <>
                        <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Uploading...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                        Upload Graphs
                    </>
                )}
            </button>

            {/* Saved Graphs */}
            {images.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Saved Graphs ({images.length})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {images.map((img, i) => (
                            <div
                                key={img.publicId || i}
                                className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={img.url}
                                    alt={img.description || `Graph ${i + 1}`}
                                    className="w-full h-48 object-contain p-2"
                                />
                                <div className="px-4 py-2.5 flex items-center justify-between border-t border-gray-100">
                                    <p className="text-xs text-gray-600 font-medium truncate max-w-[70%]">
                                        {img.description || `Graph ${i + 1}`}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleGraphDelete(img.publicId)}
                                        disabled={deletingGraphId === img.publicId}
                                        className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-40 focus:outline-none"
                                        aria-label="Delete graph"
                                    >
                                        {deletingGraphId === img.publicId ? (
                                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

export default ReportGraphUpload;
