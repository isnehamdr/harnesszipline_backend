import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// For v10.3.0, we need to configure the worker differently
import { pdfjs } from 'react-pdf';
import AdminWrapper from '@/AdminWrapper/AdminWrapper';

// For v10.x, we need to set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const ReactPdfViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPageInView, setCurrentPageInView] = useState(1);
  
  const containerRef = useRef(null);
  const pageRefs = useRef([]);

  // PDF file path - update this with your actual PDF filename
  const pdfFile = '/images/pdf.pdf';

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    pageRefs.current = pageRefs.current.slice(0, numPages);
  }, []);

  const onDocumentLoadError = useCallback((error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please check if the file exists in the public/images folder.');
    setLoading(false);
  }, []);

  // Intersection Observer to track which page is currently visible
  useEffect(() => {
    if (!numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageIndex = parseInt(entry.target.dataset.page, 10);
            setCurrentPageInView(pageIndex + 1);
          }
        });
      },
      { threshold: 0.5, rootMargin: '0px' }
    );

    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      pageRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [numPages, scale]); // Re-run when scale changes as pages might re-render

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.6));
  const resetZoom = () => setScale(1.0);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    <AdminWrapper>
    <div className="">
      {/* Minimal header */}
      <div className="sticky top-0 z-10  backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">PDF Viewer</span>
              <span className="text-xs text-gray-400">continuous scroll</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Page indicator */}
              {numPages && (
                <div className="flex items-center mr-4">
                  <span className="text-xs text-gray-500">
                    Page <span className="font-medium text-gray-700">{currentPageInView}</span> of {numPages}
                  </span>
                </div>
              )}
              
              {/* Zoom controls */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={zoomOut}
                  className="p-1.5 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-30"
                  disabled={scale <= 0.6}
                  aria-label="Zoom out"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="px-2 py-1 text-xs font-medium text-gray-600 min-w-[50px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="p-1.5 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-30"
                  disabled={scale >= 2.0}
                  aria-label="Zoom in"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={resetZoom}
                  className="px-2 py-1 text-xs hover:bg-white rounded-md transition-all duration-200 text-gray-600"
                >
                  reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Loading state */}
        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-gray-600"></div>
            </div>
            <p className="text-gray-500 text-sm mt-4">Loading PDF...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className=" bg-red-50 border border-red-100 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Unable to Load PDF</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <code className="text-xs bg-white px-3 py-2 rounded border border-red-200 text-red-600">
              public/images/your-file.pdf
            </code>
          </div>
        )}

        {/* Continuous scroll document viewer */}
        {!error && (
          <div 
            ref={containerRef}
            className="bg-gray-50 max-w-7xl mx-auto rounded-lg overflow-auto max-h-[80vh] scroll-smooth"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#9CA3AF #F3F4F6' }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 8px;
              }
              div::-webkit-scrollbar-track {
                background: #F3F4F6;
              }
              div::-webkit-scrollbar-thumb {
                background-color: #9CA3AF;
                border-radius: 4px;
              }
            `}</style>
            
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
              className="flex flex-col items-center py-4"
            >
              {numPages && Array.from(new Array(numPages), (el, index) => (
                <div
                  key={`page_${index + 1}`}
                  ref={el => (pageRefs.current[index] = el)}
                  data-page={index}
                  className="mb-4 last:mb-0"
                >
                  <div className="relative">
                    {/* Subtle page indicator */}
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-gray-400">{index + 1}</span>
                    </div>
                    
                    <Page
                      pageNumber={index + 1}
                      scale={scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="shadow-md bg-white rounded-sm overflow-hidden"
                      loading={
                        <div className="w-[400px] h-[500px] bg-gray-100 animate-pulse rounded-sm"></div>
                      }
                    />
                  </div>
                </div>
              ))}
            </Document>
          </div>
        )}

        {/* Minimal footer */}
        {numPages && !error && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={scrollToTop}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>back to top</span>
            </button>
            
            <div className="flex space-x-4 text-xs text-gray-400">
              <span className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>scroll continuously</span>
              </span>
              <span className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16" />
                </svg>
                <span>{numPages} pages</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminWrapper>
    </>
  );
};

export default ReactPdfViewer;