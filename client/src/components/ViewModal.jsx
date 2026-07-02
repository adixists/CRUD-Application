/**
 * ViewModal — Archive Terminal v4.0
 * Metal-framed modal to read full resource details.
 * Features:
 * - Maximize / Full-screen toggle
 * - Code syntax highlighting for "Code Snippet" category
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // A good dark sci-fi theme

const CATEGORY_CONFIG = {
  'AI Model':       { bg:'rgba(0,240,255,0.07)', color:'#00f0ff', border:'rgba(0,240,255,0.2)', dot:'#00f0ff' },
  'Code Snippet':   { bg:'rgba(168,85,247,0.07)', color:'#a855f7', border:'rgba(168,85,247,0.2)', dot:'#a855f7' },
  'Research Paper': { bg:'rgba(255,170,0,0.07)', color:'#ffaa00', border:'rgba(255,170,0,0.2)', dot:'#ffaa00' },
  'Tool':           { bg:'rgba(0,255,136,0.07)', color:'#00ff88', border:'rgba(0,255,136,0.2)', dot:'#00ff88' },
  'Other':          { bg:'rgba(255,0,204,0.07)', color:'#ff00cc', border:'rgba(255,0,204,0.2)', dot:'#ff00cc' },
};
const STATUS_CLASS = { 'Active':'status-active', 'Archived':'status-archived', 'In Review':'status-review' };
const formatDate = d => new Date(d).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });

const ViewModal = ({ isOpen, onClose, resource }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen || !resource) {
    if (isMaximized) setIsMaximized(false); // reset on close
    return null;
  }
  
  const cat = CATEGORY_CONFIG[resource.category] || CATEGORY_CONFIG['Other'];
  const stCls = STATUS_CLASS[resource.status] || 'status-active';

  // Toggle maximize handler
  const handleMaximize = (e) => {
    e.stopPropagation();
    setIsMaximized(!isMaximized);
  };

  // The code snippet regex checks if there are markdown code blocks.
  // If not, we just render the whole description as code (since category is Code Snippet).
  const isCode = resource.category === 'Code Snippet';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="metal-modal-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ padding: isMaximized ? '0px' : '16px' }}
        >
          <motion.div
            className="metal-modal flex flex-col"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, y: 80, rotateX: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, y: 0, rotateX: 0, scale: 1,
              maxWidth: isMaximized ? '100vw' : '700px',
              height: isMaximized ? '100vh' : 'auto',
              maxHeight: isMaximized ? '100vh' : '90vh',
              margin: isMaximized ? '0' : '16px',
              borderRadius: isMaximized ? '0' : '10px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.92 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            style={{ transformOrigin: 'center center' }}
          >
            {!isMaximized && (
              <>
                <div className="screw screw-tl" /><div className="screw screw-tr" />
                <div className="screw screw-bl" /><div className="screw screw-br" />
              </>
            )}

            <div className={`modal-inner flex flex-col flex-grow ${isMaximized ? '!m-0 !rounded-none !border-0' : ''}`}>
              <div className="modal-accent-bar" style={{ background: `linear-gradient(90deg, ${cat.color}, #a855f7, #00f0ff)` }} />
              <div className="p-5 sm:p-6 flex flex-col flex-grow overflow-hidden">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4 flex-shrink-0">
                  <div className="flex items-center gap-3 flex-wrap">
                     <span className="category-badge" style={{ background:cat.bg, color:cat.color, border:`1px solid ${cat.border}` }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:cat.dot }} />
                      {resource.category}
                    </span>
                    <span className={stCls}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                        background: resource.status==='Active' ? '#00ff88' : resource.status==='In Review' ? '#ffaa00' : '#6a6a8e',
                        boxShadow: resource.status==='Active' ? '0 0 6px rgba(0,255,136,0.7)' : resource.status==='In Review' ? '0 0 6px rgba(255,170,0,0.6)' : 'none',
                      }} />
                      {resource.status}
                    </span>
                  </div>

                  {/* Window Controls */}
                  <div className="flex items-center gap-2">
                    <button onClick={handleMaximize} className="text-text-muted hover:text-neon-cyan transition-colors" aria-label="Maximize">
                      {isMaximized ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg> // Expand icon
                      )}
                    </button>
                    <button onClick={onClose} className="text-text-muted hover:text-neon-red transition-colors" aria-label="Close">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>

                <h2 className="font-mono text-xl sm:text-2xl font-bold text-white mb-2 flex-shrink-0" style={{ textShadow: `0 0 10px ${cat.color}60` }}>
                  {resource.title}
                </h2>
                <div className="font-mono text-xs text-text-muted mb-6 flex-shrink-0">
                  {'// ADDED: '}{formatDate(resource.createdAt)}
                </div>

                {/* Content Area */}
                <div className={`flex-grow overflow-y-auto scrollbar-neon rounded-md mb-6 relative`} style={{ background: 'rgba(4,4,8,0.7)', border: '1px solid rgba(26,26,54,0.8)' }}>
                  {isCode ? (
                    <SyntaxHighlighter 
                      language="javascript" // Defaulting to js for generic snippets, can be auto-detected in a real prod app
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, padding: '16px', background: 'transparent', minHeight: '100%', fontSize: '0.85rem' }}
                      wrapLongLines={true}
                    >
                      {resource.description || '// No code provided.'}
                    </SyntaxHighlighter>
                  ) : (
                    <div className="p-4 whitespace-pre-wrap text-sm text-text-primary leading-relaxed font-sans">
                      {resource.description || 'No description provided.'}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex justify-end flex-shrink-0 pt-2" style={{ borderTop: '1px solid rgba(26,26,54,0.6)' }}>
                  <button onClick={onClose} className="btn-neon btn-cyan btn-glitch">CLOSE_TERMINAL</button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ViewModal;
