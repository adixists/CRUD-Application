/**
 * =============================================================================
 * DASHBOARD — ARCHIVE TERMINAL v4.0
 * =============================================================================
 * The main orchestrator with:
 * - GSAP typing animation for "// DASHBOARD" on load
 * - Three.js holographic particle orbs (HolOrbs)
 * - Framer Motion staggered card entrance
 * - Category filter chips with dot indicators
 * - Blinking cursor after resource count
 * - Empty state with glowing icon + reflection
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
  getResources, createResource, updateResource, deleteResource,
} from '../services/api';
import SearchBar    from './SearchBar';
import ResourceCard from './ResourceCard';
import ResourceModal from './ResourceModal';
import ConfirmModal  from './ConfirmModal';
import HolOrbs       from './HolOrbs';
import { ToastContainer, useToast } from './Toast';

/* ── Category chip config ─────────────────────────────────────────────────── */
const ALL_CATEGORIES = ['All', 'AI Model', 'Code Snippet', 'Research Paper', 'Tool', 'Other'];
const CHIP_COLORS = {
  'All':             { color:'#c0c0d8', border:'rgba(120,120,160,0.4)' },
  'AI Model':        { color:'#00f0ff', border:'rgba(0,240,255,0.4)' },
  'Code Snippet':    { color:'#a855f7', border:'rgba(168,85,247,0.4)' },
  'Research Paper':  { color:'#ffaa00', border:'rgba(255,170,0,0.4)' },
  'Tool':            { color:'#00ff88', border:'rgba(0,255,136,0.4)' },
  'Other':           { color:'#ff00cc', border:'rgba(255,0,204,0.4)' },
};

/* ══════════════════════════════════════════════════════════════════════════════ */

const Dashboard = ({ onAddResource }) => {
  const [resources,        setResources]        = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [activeCategory,   setActiveCategory]   = useState('All');
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [isConfirmOpen,    setIsConfirmOpen]    = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const dashTitleRef = useRef(null);

  const { toasts, addToast, removeToast } = useToast();

  /* ── Typing animation on mount ──────────────────────────────────────────── */
  useEffect(() => {
    const el = dashTitleRef.current;
    if (!el) return;
    const text = '// DASHBOARD';
    el.textContent = '';
    text.split('').forEach((char, i) => {
      gsap.to(el, {
        delay: 0.1 + i * 0.05,
        duration: 0,
        onStart: () => { el.textContent += char; },
      });
    });
  }, []);

  /* ── Data ───────────────────────────────────────────────────────────────── */
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

  /* ── CRUD ───────────────────────────────────────────────────────────────── */
  const handleCreate = async (fd) => {
    try { await createResource(fd); await fetchResources(); addToast(`"${fd.title}" added to the archive.`, 'success'); }
    catch { addToast('Failed to create resource.', 'error'); }
  };
  const handleUpdate = async (fd) => {
    try { await updateResource(selectedResource._id, fd); await fetchResources(); addToast(`"${fd.title}" updated.`, 'info'); }
    catch { addToast('Failed to update resource.', 'error'); }
  };
  const handleDelete = async () => {
    if (!resourceToDelete) return;
    const title = resourceToDelete.title;
    try { await deleteResource(resourceToDelete._id); await fetchResources(); addToast(`"${title}" removed.`, 'success'); }
    catch { addToast('Failed to delete resource.', 'error'); }
  };
  const handleModalSubmit = (fd) => selectedResource ? handleUpdate(fd) : handleCreate(fd);

  /* ── Modal helpers ──────────────────────────────────────────────────────── */
  const openCreate   = () => { setSelectedResource(null);  setIsModalOpen(true); };
  const handleEdit   = r  => { setSelectedResource(r);     setIsModalOpen(true); };
  const openConfirm  = r  => { setResourceToDelete(r);     setIsConfirmOpen(true); };

  /* ── Filter ─────────────────────────────────────────────────────────────── */
  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeCategory === 'All' || r.category === activeCategory)
  );

  const stats = {
    total:    resources.length,
    active:   resources.filter(r => r.status === 'Active').length,
    archived: resources.filter(r => r.status === 'Archived').length,
  };

  /* ══════════════════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── Page title + Add button ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="font-mono text-2xl sm:text-3xl font-black tracking-wide mb-1 neon-magenta"
              ref={dashTitleRef} />
          <p className="font-mono text-sm cursor-blink" style={{ color:'#5a5a7e' }}>
            {resources.length} resource{resources.length !== 1 ? 's' : ''} in the archive
          </p>
        </div>

        <button onClick={openCreate} className="btn-neon btn-cyan btn-glitch flex-shrink-0" id="btn-dashboard-add">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          ADD RESOURCE
        </button>
      </div>

      {/* ── Holographic 3D Orbs HUD ─────────────────────────────────────── */}
      <div className="mb-8">
        <HolOrbs total={stats.total} active={stats.active} archived={stats.archived} />
      </div>

      {/* ── Search ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-7">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map(cat => {
            const cfg    = CHIP_COLORS[cat];
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`filter-chip ${active ? 'active' : ''}`}
                style={active ? {
                  color:       cfg.color,
                  borderColor: cfg.border,
                  background:  `${cfg.color}0d`,
                  boxShadow:   `0 0 12px ${cfg.color}40`,
                } : {}}
                aria-pressed={active}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background:cfg.color }} />}
                {cat}
                <span className="font-mono text-[0.55rem] ml-0.5 opacity-40">
                  {cat === 'All' ? resources.length : resources.filter(r => r.category === cat).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Result count ────────────────────────────────────────────────── */}
      {(searchQuery || activeCategory !== 'All') && (
        <div className="font-mono text-xs mb-4" style={{ color:'#4a4a6e' }}>
          {'>'} Showing <span style={{ color:'#00f0ff' }}>{filtered.length}</span> of <span style={{ color:'#8888aa' }}>{resources.length}</span> resources
          {activeCategory !== 'All' && <> in <span style={{ color:CHIP_COLORS[activeCategory]?.color }}>{activeCategory}</span></>}
        </div>
      )}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_,i) => (
            <div key={i} className="skeleton-card animate-shimmer p-5 h-[220px]"
              style={{ animationDelay:`${i*0.1}s` }}>
              <div className="flex justify-between mb-4">
                <div className="h-4 w-20 rounded-full opacity-20 bg-dark-border" />
                <div className="h-4 w-14 rounded-full opacity-20 bg-dark-border" />
              </div>
              <div className="h-4 w-3/4 rounded opacity-20 bg-dark-border mb-3" />
              <div className="space-y-2">
                {[...Array(3)].map((_,j) => (
                  <div key={j} className="h-3 rounded opacity-10 bg-dark-border" style={{ width: `${90-j*15}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>

      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((resource, index) => (
              <motion.div
                key={resource._id}
                initial={{ opacity:0, y:28, scale:0.97 }}
                animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, y:-10, scale:0.96 }}
                transition={{ duration:0.35, delay:index*0.06, ease:[0.4,0,0.2,1] }}
                layout
              >
                <ResourceCard resource={resource} onEdit={handleEdit} onDelete={openConfirm} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      ) : (
        /* ── Empty State ──────────────────────────────────────────────── */
        <motion.div
          initial={{ opacity:0, scale:0.96 }}
          animate={{ opacity:1, scale:1 }}
          className="glass p-16 text-center relative overflow-hidden"
        >
          <div className="flex justify-center mb-5 relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background:'rgba(0,240,255,0.04)', border:'1px solid rgba(0,240,255,0.1)' }}>
              <svg className="w-10 h-10" style={{ color:'rgba(0,240,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="empty-state-reflection" />
          </div>

          {searchQuery || activeCategory !== 'All' ? (
            <>
              <p className="font-mono text-base mb-2" style={{ color:'#8888aa' }}>No matches found</p>
              <p className="font-mono text-sm mb-5" style={{ color:'#4a4a6e' }}>{'// No resources match your current filters'}</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="btn-neon btn-purple btn-glitch">
                CLEAR FILTERS
              </button>
            </>
          ) : (
            <>
              <p className="font-mono text-lg mb-1" style={{ color:'#8888aa' }}>Archive is empty</p>
              <p className="font-mono text-sm mb-6" style={{ color:'#4a4a6e' }}>Add your first resource to get started</p>
              <button onClick={openCreate} className="btn-neon btn-cyan btn-glitch">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                ADD FIRST RESOURCE
              </button>
            </>
          )}
        </motion.div>
      )}

      {/* ── Modals ──────────────────────────────────────────────────────── */}
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

      {/* ── Toast notifications ──────────────────────────────────────────── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default Dashboard;
