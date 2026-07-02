/**
 * ResourceCard — Archive Terminal v4.0
 * Holographic glassmorphism card with hover shimmer and category accents.
 */
import React from 'react';

const CATEGORY_CONFIG = {
  'AI Model':       { bg:'rgba(0,240,255,0.07)', color:'#00f0ff', border:'rgba(0,240,255,0.2)', accent:'accent-cyan', dot:'#00f0ff' },
  'Code Snippet':   { bg:'rgba(168,85,247,0.07)', color:'#a855f7', border:'rgba(168,85,247,0.2)', accent:'accent-purple', dot:'#a855f7' },
  'Research Paper': { bg:'rgba(255,170,0,0.07)', color:'#ffaa00', border:'rgba(255,170,0,0.2)', accent:'accent-amber', dot:'#ffaa00' },
  'Tool':           { bg:'rgba(0,255,136,0.07)', color:'#00ff88', border:'rgba(0,255,136,0.2)', accent:'accent-green', dot:'#00ff88' },
  'Other':          { bg:'rgba(255,0,204,0.07)', color:'#ff00cc', border:'rgba(255,0,204,0.2)', accent:'accent-pink', dot:'#ff00cc' },
};

const STATUS_CLASS = { 'Active':'status-active', 'Archived':'status-archived', 'In Review':'status-review' };

const formatDate = d => new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
const isNew = d => Date.now() - new Date(d).getTime() < 86_400_000;

const ResourceCard = ({ resource, onEdit, onDelete }) => {
  const cat   = CATEGORY_CONFIG[resource.category] || CATEGORY_CONFIG['Other'];
  const stCls = STATUS_CLASS[resource.status] || 'status-active';
  const fresh = isNew(resource.createdAt);

  return (
    <div className={`glass card-holo flex flex-col h-full p-5 ${cat.accent}`} style={{ minHeight:'200px' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2 flex-wrap">
        <span className="category-badge" style={{ background:cat.bg, color:cat.color, border:`1px solid ${cat.border}` }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:cat.dot }} />
          {resource.category}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {fresh && <span className="badge-new">✦ NEW</span>}
          <span className={stCls}>
            <span className="w-1.5 h-1.5 rounded-full" style={{
              background: resource.status==='Active' ? '#00ff88' : resource.status==='In Review' ? '#ffaa00' : '#6a6a8e',
              boxShadow: resource.status==='Active' ? '0 0 6px rgba(0,255,136,0.7)' : resource.status==='In Review' ? '0 0 6px rgba(255,170,0,0.6)' : 'none',
            }} />
            {resource.status}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-mono text-[0.93rem] font-bold mb-2 leading-snug transition-all duration-300"
        style={{ color:'#d0d0e8' }}
        onMouseEnter={e => { e.currentTarget.style.color=cat.color; e.currentTarget.style.textShadow=`0 0 12px ${cat.dot}60`; }}
        onMouseLeave={e => { e.currentTarget.style.color='#d0d0e8'; e.currentTarget.style.textShadow='none'; }}
      >
        {resource.title}
      </h3>

      <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-grow line-clamp-3">
        {resource.description || 'No description provided.'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop:'1px solid rgba(26,26,54,0.7)' }}>
        <span className="font-mono text-[0.6rem] text-text-muted">{formatDate(resource.createdAt)}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(resource)} className="btn-neon btn-cyan btn-glitch !py-1.5 !px-3 !text-[0.6rem]" aria-label={`Edit ${resource.title}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            EDIT
          </button>
          <button onClick={() => onDelete(resource)} className="btn-neon btn-red btn-glitch !py-1.5 !px-3 !text-[0.6rem]" aria-label={`Delete ${resource.title}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            DEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
