/**
 * =============================================================================
 * RESOURCE MODAL — ARCHIVE TERMINAL v4.0
 * =============================================================================
 * Heavy brushed metal sci-fi modal with:
 * - Framer Motion 3D slide-up + perspective tilt entrance
 * - Corner screw heads
 * - Gradient accent bar
 * - Neural network wireframe watermark
 * - Custom category dropdown with glassmorphism
 * - ABORT (magenta) + EXECUTE (cyan) buttons
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY_FORM = { title: '', category: 'AI Model', description: '', status: 'Active' };
const CATEGORIES = ['AI Model', 'Code Snippet', 'Research Paper', 'Tool', 'Other'];
const STATUSES   = ['Active', 'Archived', 'In Review'];

/* ── Neural Network Watermark SVG ────────────────────────────────────────── */
const NeuralWatermark = () => (
  <svg viewBox="0 0 300 120" className="neural-watermark" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Layer 1 */}
    {[20,45,70,95].map((y,i) => (
      [55,110,165,210,260].map((x2,j) => (
        <line key={`l1-${i}-${j}`} x1="20" y1={y} x2={x2} y2={[25,45,65,85,105][j]} stroke="#00f0ff" strokeWidth="0.4" opacity="0.6" />
      ))
    ))}
    {/* Input nodes */}
    {[20,45,70,95].map((y,i) => <circle key={`in-${i}`} cx="20" cy={y} r="4" fill="none" stroke="#00f0ff" strokeWidth="0.8" />)}
    {/* Hidden nodes */}
    {[25,45,65,85,105].map((y,i) => <circle key={`h1-${i}`} cx="110" cy={y} r="4" fill="none" stroke="#00f0ff" strokeWidth="0.8" />)}
    {[35,55,75,95].map((y,i) => (
      [35,55,75,95].map((y2,j) => (
        <line key={`l2-${i}-${j}`} x1="110" y1={[25,45,65,85,105][i]} x2="200" y2={y2} stroke="#00f0ff" strokeWidth="0.4" opacity="0.5" />
      ))
    ))}
    {[35,55,75,95].map((y,i) => <circle key={`h2-${i}`} cx="200" cy={y} r="4" fill="none" stroke="#00f0ff" strokeWidth="0.8" />)}
    {/* Output */}
    {[35,55,75,95].map((y,i) => (
      <line key={`lout-${i}`} x1="200" y1={y} x2="275" y2="65" stroke="#00f0ff" strokeWidth="0.4" opacity="0.5" />
    ))}
    <circle cx="275" cy="65" r="5" fill="rgba(0,240,255,0.1)" stroke="#00f0ff" strokeWidth="1" />
  </svg>
);

/* ── Custom Dropdown ─────────────────────────────────────────────────────── */
const Dropdown = ({ name, value, options, onChange, accentColor = '#00f0ff' }) => {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } });
    setOpen(false);
  };

  return (
    <div className="relative" style={{ zIndex: open ? 30 : 1 }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="input-neon flex items-center justify-between cursor-pointer text-left"
        style={{ borderColor: open ? `${accentColor}60` : 'rgba(26,26,54,0.9)', color: '#d0d0e8' }}
      >
        <span>{value}</span>
        <svg
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{ color: accentColor, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.9 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
            className="absolute left-0 right-0 top-full mt-1 rounded-lg overflow-hidden"
            style={{
              background: 'rgba(6,6,16,0.98)',
              border: `1px solid ${accentColor}33`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 10px 40px rgba(0,0,0,0.8), 0 0 30px ${accentColor}11`,
              zIndex: 100,
            }}
          >
            {/* Neural network watermark */}
            <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
              <NeuralWatermark />
            </div>

            {/* Options */}
            <div className="relative z-10">
              {options.map((opt) => {
                const isSelected = opt === value;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className="w-full text-left px-4 py-3 font-mono text-sm transition-all duration-150 flex items-center gap-2"
                    style={{
                      background: isSelected ? `${accentColor}22` : 'transparent',
                      color: isSelected ? accentColor : '#9090b0',
                      borderLeft: isSelected ? `3px solid ${accentColor}` : '3px solid transparent',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.8rem',
                    }}
                    onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = `${accentColor}0d`; e.currentTarget.style.color = '#d0d0e8'; } }}
                    onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9090b0'; } }}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {!isSelected && <span className="w-3" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════ */

const ResourceModal = ({ isOpen, onClose, onSubmit, resource }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isMaximized, setIsMaximized] = useState(false);
  const isEditing = !!resource;

  // Reset max state when closed
  useEffect(() => {
    if (!isOpen) setIsMaximized(false);
  }, [isOpen]);

  useEffect(() => {
    setFormData(resource
      ? { title: resource.title||'', category: resource.category||'AI Model', description: resource.description||'', status: resource.status||'Active' }
      : EMPTY_FORM
    );
  }, [resource, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="metal-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{ padding: isMaximized ? '0px' : '16px' }}
        >
          {/* Metal modal — 3D slide-up + perspective tilt entrance */}
          <motion.div
            className="metal-modal flex flex-col"
            onClick={e => e.stopPropagation()}
            initial={{
              opacity: 0,
              y: 120,
              rotateX: 25,
              scale: 0.88,
              perspective: 1200,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              perspective: 1200,
              maxWidth: isMaximized ? '100vw' : '700px',
              height: isMaximized ? '100vh' : 'auto',
              maxHeight: isMaximized ? '100vh' : '90vh',
              margin: isMaximized ? '0' : '16px',
              borderRadius: isMaximized ? '0' : '10px'
            }}
            exit={{
              opacity: 0,
              y: 80,
              rotateX: 15,
              scale: 0.92,
            }}
            transition={{
              type: 'spring',
              damping: 24,
              stiffness: 300,
              mass: 0.8,
            }}
            style={{ transformOrigin: 'bottom center' }}
          >
            {/* Corner screws */}
            {!isMaximized && (
              <>
                <div className="screw screw-tl" />
                <div className="screw screw-tr" />
                <div className="screw screw-bl" />
                <div className="screw screw-br" />
              </>
            )}

            {/* Inner panel */}
            <div className={`modal-inner flex flex-col flex-grow ${isMaximized ? '!m-0 !rounded-none !border-0' : ''}`}>
              {/* Gradient accent bar */}
              <div className="modal-accent-bar" />

              <div className="p-5 flex flex-col flex-grow overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between mb-5 flex-shrink-0">
                  <div>
                    <h2 className="font-mono text-[0.95rem] font-bold tracking-wider neon-magenta">
                      {isEditing ? '// EDIT_RESOURCE' : '// NEW_RESOURCE'}
                    </h2>
                    <p className="font-mono text-[0.6rem] text-text-muted mt-1">
                      {isEditing
                        ? 'Modify the fields below and execute to save changes.'
                        : 'Fill in the fields below to add to the archive.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="w-6 h-6 flex items-center justify-center rounded transition-all"
                      style={{ color:'#3a3a56', border:'1px solid rgba(26,26,54,0.8)' }}
                      onMouseEnter={e => { e.currentTarget.style.color='#00f0ff'; e.currentTarget.style.borderColor='rgba(0,240,255,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color='#3a3a56'; e.currentTarget.style.borderColor='rgba(26,26,54,0.8)'; }}
                      aria-label="Maximize"
                    >
                      {isMaximized ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                    className="w-6 h-6 flex items-center justify-center rounded transition-all"
                    style={{ color:'#3a3a56', border:'1px solid rgba(26,26,54,0.8)' }}
                    onMouseEnter={e => { e.currentTarget.style.color='#ff3366'; e.currentTarget.style.borderColor='rgba(255,51,102,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color='#3a3a56'; e.currentTarget.style.borderColor='rgba(26,26,54,0.8)'; }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow space-y-4 overflow-y-auto overflow-x-hidden pr-2 scrollbar-neon">
                  {/* Title */}
                  <div>
                    <label className="block font-mono text-[0.6rem] text-text-muted mb-1.5 tracking-widest uppercase">
                      <span style={{color:'#ff00cc'}}>▸</span> TITLE
                    </label>
                    <input
                      type="text" name="title" value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. GPT-4 Vision, React hooks..."
                      className="input-neon input-magenta" required autoFocus
                    />
                  </div>

                  {/* Category + Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div style={{ position: 'relative' }}>
                      <label className="block font-mono text-[0.6rem] text-text-muted mb-1.5 tracking-widest uppercase">
                        <span style={{color:'#00f0ff'}}>▸</span> CATEGORY
                      </label>
                      <Dropdown
                        name="category"
                        value={formData.category}
                        options={CATEGORIES}
                        onChange={handleChange}
                        accentColor="#00aaff"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[0.6rem] text-text-muted mb-1.5 tracking-widest uppercase">
                        <span style={{color:'#00f0ff'}}>▸</span> STATUS
                      </label>
                      <Dropdown
                        name="status"
                        value={formData.status}
                        options={STATUSES}
                        onChange={handleChange}
                        accentColor="#00f0ff"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col flex-grow">
                    <label className="block font-mono text-[0.6rem] text-text-muted mb-1.5 tracking-widest uppercase flex-shrink-0">
                      <span style={{color:'#ffaa00'}}>▸</span> DESCRIPTION
                    </label>
                    <textarea
                      name="description" value={formData.description}
                      onChange={handleChange}
                      placeholder="what it does, why it's useful..."
                      rows={3}
                      className="input-neon input-magenta resize-none scrollbar-neon flex-grow min-h-[100px]"
                    />
                  </div>

                  {/* Neural network watermark strip */}
                  <div
                    className="relative overflow-hidden rounded"
                    style={{ height: '60px', background: 'rgba(0,240,255,0.02)', border: '1px solid rgba(0,240,255,0.06)' }}
                  >
                    <NeuralWatermark />
                  </div>

                  {/* Action buttons */}
                  <div
                    className="flex items-center justify-end gap-3 pt-3"
                    style={{ borderTop: '1px solid rgba(26,26,54,0.7)' }}
                  >
                    <button type="button" onClick={onClose} className="btn-neon btn-magenta btn-glitch">
                      ABORT
                    </button>
                    <button type="submit" className="btn-neon btn-cyan btn-glitch">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      + EXECUTE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResourceModal;
