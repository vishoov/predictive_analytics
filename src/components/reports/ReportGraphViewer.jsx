import React, { useState, useEffect, useCallback, memo } from 'react';

const ReportGraphViewer = memo(({ images = [] }) => {
    const [lightbox, setLightbox] = useState(null); // index of open image

    const LABELS = { 0: 'Filling Phase Graph', 1: 'Voiding Phase Graph' };

    // Close on Escape key
    useEffect(() => {
        if (lightbox === null) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') setLightbox(null);
            if (e.key === 'ArrowRight') setLightbox(prev => (prev + 1) % images.length);
            if (e.key === 'ArrowLeft') setLightbox(prev => (prev - 1 + images.length) % images.length);
        };
        window.addEventListener('keydown', handleKey);
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [lightbox, images.length]);

    const openLightbox = useCallback((index) => setLightbox(index), []);
    const closeLightbox = useCallback(() => setLightbox(null), []);
    const prevImage = useCallback((e) => {
        e.stopPropagation();
        setLightbox(prev => (prev - 1 + images.length) % images.length);
    }, [images.length]);
    const nextImage = useCallback((e) => {
        e.stopPropagation();
        setLightbox(prev => (prev + 1) % images.length);
    }, [images.length]);

    if (!images.length) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📊</span>
                    Phase Graphs
                </h2>
                <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500">No graphs uploaded yet</p>
                    <p className="text-xs text-gray-400 mt-1">Graphs can be added in the Review section</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center">
                        <span className="text-2xl mr-2">📊</span>
                        Phase Graphs
                    </h2>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                        {images.length} {images.length === 1 ? 'Graph' : 'Graphs'}
                    </span>
                </div>

                {/* Graph Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {images.map((img, i) => (
                        <div
                            key={img.publicId || i}
                            className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 hover:shadow-lg transition-all duration-200 cursor-pointer"
                            onClick={() => openLightbox(i)}
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden bg-white">
                                <img
                                    src={img.url}
                                    alt={img.description || LABELS[i] || `Graph ${i + 1}`}
                                    className="w-full h-56 object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-all duration-200 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-3 shadow-lg">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {LABELS[i] || img.description || `Graph ${i + 1}`}
                                    </p>
                                    {img.description && img.description !== LABELS[i] && (
                                        <p className="text-xs text-gray-400 truncate max-w-[180px] mt-0.5">
                                            {img.description}
                                        </p>
                                    )}
                                </div>
                                <span className="flex items-center gap-1 text-xs text-indigo-500 font-medium">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                    Click to expand
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Empty slot placeholder if only 1 graph */}
                    {images.length === 1 && (
                        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center h-56 gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Voiding Phase Graph</p>
                            <p className="text-[10px] text-gray-300">Not yet uploaded</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Lightbox ─────────────────────────────────────────────────────── */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none z-10"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Keyboard hint */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/50 text-xs">
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60 font-mono">←</kbd>
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60 font-mono">→</kbd>
                        <span>navigate</span>
                        <span className="mx-1">·</span>
                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60 font-mono">Esc</kbd>
                        <span>close</span>
                    </div>

                    {/* Prev Button */}
                    {images.length > 1 && (
                        <button
                            onClick={prevImage}
                            className="absolute left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
                            aria-label="Previous image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Image Container */}
                    <div
                        className="relative max-w-5xl w-full mx-16 flex flex-col items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[lightbox]?.url}
                            alt={images[lightbox]?.description || `Graph ${lightbox + 1}`}
                            className="max-h-[80vh] w-full object-contain rounded-xl shadow-2xl"
                        />

                        {/* Caption */}
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-white font-semibold text-base">
                                {LABELS[lightbox] || images[lightbox]?.description || `Graph ${lightbox + 1}`}
                            </p>
                            {images[lightbox]?.description && (
                                <p className="text-white/50 text-sm">{images[lightbox].description}</p>
                            )}
                            {/* Dot indicators */}
                            {images.length > 1 && (
                                <div className="flex gap-2 mt-2">
                                    {images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setLightbox(i)}
                                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                                i === lightbox ? 'bg-white w-4' : 'bg-white/40'
                                            }`}
                                            aria-label={`Go to graph ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Open in new tab */}
                        <a
                            href={images[lightbox]?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-xs transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open full size in new tab
                        </a>
                    </div>

                    {/* Next Button */}
                    {images.length > 1 && (
                        <button
                            onClick={nextImage}
                            className="absolute right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
                            aria-label="Next image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </>
    );
});

export default ReportGraphViewer;
