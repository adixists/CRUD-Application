/**
 * =============================================================================
 * DASHBOARD — ARCHIVE TERMINAL v3.0
 * =============================================================================
 * "Sci-Fi Server Room Terminal" — Main orchestrator.
 *
 * v3.0 features:
 * ● Server room background (rack lines, LEDs, floor grid, fog)
 * ● Carbon fiber console desk with fader sliders
 * ● 3 glowing 3D stat orbs (Total / Active / Archived)
 * ● Category filter chips with dot indicators
 * ● Toast notifications
 * ● Staggered card entrance animations
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from '../services/api';
import SearchBar     from './SearchBar';
import ResourceCard  from './ResourceCard';
import ResourceModal from './ResourceModal';
import ConfirmModal  from './ConfirmModal';
import { ToastContainer, useToast } from './Toast';

/* ── Category filter config ───────────────────────────────────────────────── */
const ALL_CATEGORIES = ['All', 'AI Model', 'Code Snippet', 'Research Paper', 'Tool', 'Other'];

const CHIP_COLORS = {
  'All':             { color: '#d8d8f0', border: 'rgba(136,136,170,0.4)' },
  'AI Model':        { color: '#00f0ff', border: 'rgba(0,240,255,0.4)' },
  'Code Snippet':    { color: '#a855f7', border: 'rgba(168,85,247,0.4)' },
  'Research Paper':  { color: '#ffaa00', border: 'rgba(255,170,0,0.4)' },
  'Tool':            { color: '#00ff88', border: 'rgba(0,255,136,0.4)' },
  'Other':           { color: '#ff00cc', border: 'rgba(255,0,204,0.4)' },
};

/* ══════════════════════════════════════════════════════════════════════════════ */

const Dashboard = () => {
  /* ── State ────────────────────────────────────────────────────────────── */
  const [resources,        setResources]        = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [activeCategory,   setActiveCategory]   = useState('All');
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [isConfirmOpen,    setIsConfirmOpen]    = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const { toasts, addToast, removeToast } = useToast();

  /* ── Data fetching ───────────────────────────────────────────────────── */
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getResources();
      setResources(data);
    } catch {
      addToast('Failed to load resources. Is the server running?', 'error');
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetchResources(); }, [fetchResources]);

  /* ── CRUD handlers ───────────────────────────────────────────────────── */
  const handleCreate = async (formData) => {
    try {
      await createResource(formData);
      await fetchResources();
      addToast(`"${formData.title}" added to the archive.`, 'success');
    } catch {
      addToast('Failed to create resource.', 'error');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateResource(selectedResource._id, formData);
      await fetchResources();
      addToast(`"${formData.title}" has been updated.`, 'info');
    } catch {
      addToast('Failed to update resource.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;
    const title = resourceToDelete.title;
    try {
      await deleteResource(resourceToDelete._id);
      await fetchResources();
      addToast(`"${title}" removed from the archive.`, 'success');
    } catch {
      addToast('Failed to delete resource.', 'error');
    }
  };

  const handleModalSubmit = (formData) => {
    if (selectedResource) handleUpdate(formData);
    else                   handleCreate(formData);
  };

  /* ── Modal helpers ───────────────────────────────────────────────────── */
  const openCreateModal = () => { setSelectedResource(null);     setIsModalOpen(true); };
  const handleEdit      = (r) => { setSelectedResource(r);       setIsModalOpen(true); };
  const openConfirmModal= (r) => { setResourceToDelete(r);       setIsConfirmOpen(true); };

  /* ── Filtering logic ─────────────────────────────────────────────────── */
  const filtered = resources.filter(r => {
    const matchesSearch   = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  /* ── Stats ───────────────────────────────────────────────────────────── */
  const stats = {
    total:    resources.length,
    active:   resources.filter(r => r.status === 'Active').length,
    archived: resources.filter(r => r.status === 'Archived').length,
  };

  /* ══════════════════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── SERVER ROOM BACKGROUND LAYERS ─────────────────────────────── */}
      <div className="server-room" aria-hidden="true" />
      <div className="server-rack-lines" aria-hidden="true" />
      <div className="rack-leds" aria-hidden="true" />
      <div className="floor-grid" aria-hidden="true" />
      <div className="fog-layer" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div className="relative z-10 pb-28 animate-fade-in">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <h2 className="font-mono text-2xl sm:text-3xl font-black tracking-wide mb-1">
            <span className="neon-text-magenta">// DASHBOARD</span>
          </h2>
          <p className="font-mono text-sm text-text-muted cursor-blink">
            {resources.length} resource{resources.length !== 1 ? 's' : ''} in the archive
          </p>
        </div>

        {/* ── GLOWING ORB STATS ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 mb-10">

          {/* TOTAL orb — cyan */}
          <div className="orb-container">
            <div className="orb orb-cyan">
              <span className="orb-value">{stats.total}</span>
            </div>
            <span className="orb-label" style={{ color: '#00f0ff' }}>TOTAL</span>
          </div>

          {/* ACTIVE orb — green */}
          <div className="orb-container">
            <div className="orb orb-green">
              <span className="orb-value">{stats.active}</span>
            </div>
            <span className="orb-label" style={{ color: '#00ff88' }}>ACTIVE</span>
          </div>

          {/* ARCHIVED orb — magenta */}
          <div className="orb-container">
            <div className="orb orb-magenta">
              <span className="orb-value">{stats.archived}</span>
            </div>
            <span className="orb-label" style={{ color: '#ff00cc' }}>ARCHIVED</span>
          </div>
        </div>

        {/* ── SEARCH + FILTERS ────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 mb-8">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <div className="flex flex-wrap gap-2 mt-1">
            {ALL_CATEGORIES.map(cat => {
              const cfg    = CHIP_COLORS[cat];
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`filter-chip ${active ? 'chip-active' : ''}`}
                  style={active ? {
                    color:       cfg.color,
                    borderColor: cfg.border,
                    background:  `${cfg.color}0d`,
                    boxShadow:   `0 0 12px ${cfg.color}44`,
                  } : {}}
                  aria-pressed={active}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                  )}
                  {cat}
                  <span className="font-mono text-[0.58rem] ml-1 opacity-50">
                    {cat === 'All'
                      ? resources.length
                      : resources.filter(r => r.category === cat).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Result count ────────────────────────────────────────────── */}
        {(searchQuery || activeCategory !== 'All') && (
          <div className="font-mono text-xs text-text-muted mb-4">
            {'>'} Showing <span className="text-neon-cyan">{filtered.length}</span> of{' '}
            <span className="text-text-secondary">{resources.length}</span> resources
            {activeCategory !== 'All' && (
              <> in <span style={{ color: CHIP_COLORS[activeCategory]?.color }}>{activeCategory}</span></>
            )}
          </div>
        )}

        {/* ── CONTENT AREA ────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="skeleton-card animate-shimmer p-5 h-[230px]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex justify-between mb-4">
                  <div className="h-5 w-24 rounded-full bg-dark-border opacity-30" />
                  <div className="h-5 w-16 rounded-full bg-dark-border opacity-30" />
                </div>
                <div className="h-5 w-3/4 rounded bg-dark-border opacity-30 mb-3" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-dark-border opacity-15" />
                  <div className="h-3 w-5/6 rounded bg-dark-border opacity-15" />
                  <div className="h-3 w-2/3 rounded bg-dark-border opacity-15" />
                </div>
              </div>
            ))}
          </div>

        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((resource, index) => (
              <div
                key={resource._id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <ResourceCard
                  resource={resource}
                  onEdit={handleEdit}
                  onDelete={openConfirmModal}
                />
              </div>
            ))}
          </div>

        ) : (
          /* ── Empty State ─────────────────────────────────────────────── */
          <div className="glass p-14 text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(0,240,255,0.03)',
                  border: '1px solid rgba(0,240,255,0.08)',
                }}
              >
                <svg className="w-12 h-12" style={{ color: 'rgba(0,240,255,0.25)' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M21 21l-5.2-5.2M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            {searchQuery || activeCategory !== 'All' ? (
              <>
                <p className="font-mono text-base text-text-secondary mb-2">No matches found</p>
                <p className="font-mono text-sm text-text-muted mb-5">
                  {'// No resources match your current filters'}
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="btn-neon btn-purple"
                >
                  CLEAR FILTERS
                </button>
              </>
            ) : (
              <>
                <p className="font-mono text-lg text-text-secondary mb-2">Archive is empty</p>
                <p className="font-mono text-sm text-text-muted mb-6">
                  Add your resources below
                </p>
                <button onClick={openCreateModal} className="btn-neon btn-cyan">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  ADD FIRST RESOURCE
                </button>
              </>
            )}
          </div>
        )}

        {/* ── MODALS ──────────────────────────────────────────────────── */}
        <ResourceModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedResource(null); }}
          onSubmit={handleModalSubmit}
          resource={selectedResource}
        />

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => { setIsConfirmOpen(false); setResourceToDelete(null); }}
          onConfirm={handleDelete}
          resourceTitle={resourceToDelete?.title || ''}
        />
      </div>

      {/* ── CARBON FIBER CONSOLE DESK ─────────────────────────────────── */}
      <div className="console-desk" aria-hidden="true">
        <div className="fader-track fader-track-l">
          <div className="fader-knob" />
        </div>
        <div className="fader-track fader-track-r">
          <div className="fader-knob" />
        </div>
      </div>

      {/* ── TOAST NOTIFICATIONS ───────────────────────────────────────── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default Dashboard;
