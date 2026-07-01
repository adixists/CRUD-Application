/**
 * =============================================================================
 * RESOURCE MODAL — ARCHIVE TERMINAL v3.0
 * =============================================================================
 * Metal-framed Create/Edit form with screw heads, gradient accent bar,
 * and a cyan neural network schematic SVG inside the modal body.
 */

import React, { useState, useEffect } from 'react';

const EMPTY_FORM = {
  title: '',
  category: 'AI Model',
  description: '',
  status: 'Active',
};

const CATEGORIES = ['AI Model', 'Code Snippet', 'Research Paper', 'Tool', 'Other'];
const STATUSES   = ['Active', 'Archived', 'In Review'];

/* ── Neural Network SVG ──────────────────────────────────────────────────── */
const NeuralNetSVG = () => (
  <svg
    viewBox="0 0 400 80"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Connections — layer 1 to layer 2 */}
    <line x1="60" y1="20" x2="140" y2="15" stroke="#00f0ff" strokeWidth="0.5" opacity="0.4" />
    <line x1="60" y1="20" x2="140" y2="40" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
    <line x1="60" y1="20" x2="140" y2="65" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" />
    <line x1="60" y1="40" x2="140" y2="15" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" />
    <line x1="60" y1="40" x2="140" y2="40" stroke="#00f0ff" strokeWidth="0.5" opacity="0.5" />
    <line x1="60" y1="40" x2="140" y2="65" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
    <line x1="60" y1="60" x2="140" y2="15" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" />
    <line x1="60" y1="60" x2="140" y2="40" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
    <line x1="60" y1="60" x2="140" y2="65" stroke="#00f0ff" strokeWidth="0.5" opacity="0.4" />

    {/* Connections — layer 2 to layer 3 */}
    <line x1="140" y1="15" x2="220" y2="20" stroke="#00f0ff" strokeWidth="0.5" opacity="0.4" />
    <line x1="140" y1="15" x2="220" y2="45" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" />
    <line x1="140" y1="15" x2="220" y2="65" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" />
    <line x1="140" y1="40" x2="220" y2="20" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
    <line x1="140" y1="40" x2="220" y2="45" stroke="#00f0ff" strokeWidth="0.5" opacity="0.5" />
    <line x1="140" y1="40" x2="220" y2="65" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
    <line x1="140" y1="65" x2="220" y2="20" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" />
    <line x1="140" y1="65" x2="220" y2="45" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
    <line x1="140" y1="65" x2="220" y2="65" stroke="#00f0ff" strokeWidth="0.5" opacity="0.4" />

    {/* Connections — layer 3 to layer 4 */}
    <line x1="220" y1="20" x2="300" y2="25" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
    <line x1="220" y1="20" x2="300" y2="55" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" />
    <line x1="220" y1="45" x2="300" y2="25" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
    <line x1="220" y1="45" x2="300" y2="55" stroke="#00f0ff" strokeWidth="0.5" opacity="0.4" />
    <line x1="220" y1="65" x2="300" y2="25" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" />
    <line x1="220" y1="65" x2="300" y2="55" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />

    {/* Connections — layer 4 to output */}
    <line x1="300" y1="25" x2="360" y2="40" stroke="#00f0ff" strokeWidth="0.5" opacity="0.4" />
    <line x1="300" y1="55" x2="360" y2="40" stroke="#00f0ff" strokeWidth="0.5" opacity="0.4" />

    {/* Layer 1 nodes (input) */}
    <circle cx="60" cy="20" r="4" fill="#060610" stroke="#00f0ff" strokeWidth="1" opacity="0.7" />
    <circle cx="60" cy="40" r="4" fill="#060610" stroke="#00f0ff" strokeWidth="1" opacity="0.7" />
    <circle cx="60" cy="60" r="4" fill="#060610" stroke="#00f0ff" strokeWidth="1" opacity="0.7" />

    {/* Layer 2 nodes (hidden 1) */}
    <circle cx="140" cy="15" r="4.5" fill="#060610" stroke="#00f0ff" strokeWidth="1" opacity="0.8">
      <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="140" cy="40" r="4.5" fill="#060610" stroke="#00f0ff" strokeWidth="1" opacity="0.8">
      <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="140" cy="65" r="4.5" fill="#060610" stroke="#00f0ff" strokeWidth="1" opacity="0.8">
      <animate attributeName="opacity" values="0.8;1;0.8" dur="1.8s" repeatCount="indefinite" />
    </circle>

    {/* Layer 3 nodes (hidden 2) */}
    <circle cx="220" cy="20" r="4.5" fill="#060610" stroke="#00f0ff" strokeWidth="1" opacity="0.8">
      <animate attributeName="opacity" values="0.8;1;0.8" dur="2.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="220" cy="45" r="5" fill="#060610" stroke="#00f0ff" strokeWidth="1.2" opacity="0.9">
      <animate attributeName="opacity" values="0.9;1;0.9" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="220" cy="65" r="4.5" fill="#060610" stroke="#00f0ff" strokeWidth="1" opacity="0.8">
      <animate attributeName="opacity" values="0.8;1;0.8" dur="2.8s" repeatCount="indefinite" />
    </circle>

    {/* Layer 4 nodes */}
    <circle cx="300" cy="25" r="4" fill="#060610" stroke="#00f0ff" strokeWidth="1" opacity="0.7" />
    <circle cx="300" cy="55" r="4" fill="#060610" stroke="#00f0ff" strokeWidth="1" opacity="0.7" />

    {/* Output node */}
    <circle cx="360" cy="40" r="5" fill="rgba(0,240,255,0.15)" stroke="#00f0ff" strokeWidth="1.5" opacity="0.9">
      <animate attributeName="r" values="5;6;5" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════ */

const ResourceModal = ({ isOpen, onClose, onSubmit, resource }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const isEditing = !!resource;

  useEffect(() => {
    if (resource) {
      setFormData({
        title:       resource.title       || '',
        category:    resource.category    || 'AI Model',
        description: resource.description || '',
        status:      resource.status      || 'Active',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [resource, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Metal-framed modal panel */}
      <div
        className="metal-frame w-full max-w-lg mx-4 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Corner screws */}
        <div className="screw screw-tl" />
        <div className="screw screw-tr" />
        <div className="screw screw-bl" />
        <div className="screw screw-br" />

        {/* Gradient accent bar */}
        <div className="metal-accent-bar" />

        {/* Inner dark content area */}
        <div className="metal-inner m-3 p-5">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 id="modal-title" className="font-mono text-base font-bold tracking-wider">
                <span className="neon-text-magenta">
                  {isEditing ? '// EDIT_RESOURCE' : '// NEW_RESOURCE'}
                </span>
              </h2>
              <p className="font-mono text-[0.62rem] text-text-muted mt-1">
                {isEditing
                  ? 'Modify the fields below and execute to save changes.'
                  : 'Fill in the fields below to add to the archive.'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200"
              style={{ color: '#3e3e5a', border: '1px solid rgba(26,26,56,0.8)' }}
              onMouseEnter={e => { e.currentTarget.style.color='#ff3366'; e.currentTarget.style.borderColor='rgba(255,51,102,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color='#3e3e5a'; e.currentTarget.style.borderColor='rgba(26,26,56,0.8)'; }}
              aria-label="Close modal"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Title */}
            <div>
              <label className="block font-mono text-[0.65rem] text-text-secondary mb-1.5 tracking-widest uppercase">
                <span className="text-neon-magenta mr-1">▸</span> TITLE
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. GPT-4 Vision, React hooks..."
                className="input-neon input-magenta"
                required
                autoFocus
              />
            </div>

            {/* Category + Status side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[0.65rem] text-text-secondary mb-1.5 tracking-widest uppercase">
                  <span className="text-neon-cyan mr-1">▸</span> CATEGORY
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-neon cursor-pointer"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.3)' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[0.65rem] text-text-secondary mb-1.5 tracking-widest uppercase">
                  <span className="text-neon-cyan mr-1">▸</span> STATUS
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-neon cursor-pointer"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.3)' }}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-mono text-[0.65rem] text-text-secondary mb-1.5 tracking-widest uppercase">
                <span className="text-neon-amber mr-1">▸</span> DESCRIPTION
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="what it does, why it's useful..."
                rows={3}
                className="input-neon input-magenta resize-none scrollbar-neon"
              />
            </div>

            {/* Neural network schematic */}
            <div className="neural-net-container">
              <NeuralNetSVG />
            </div>

            {/* Buttons */}
            <div
              className="flex items-center justify-end gap-3 pt-3"
              style={{ borderTop: '1px solid rgba(26,26,56,0.7)' }}
            >
              <button type="button" onClick={onClose} className="btn-neon btn-magenta">
                ABORT
              </button>
              <button type="submit" className="btn-neon btn-cyan">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                EXECUTE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;
