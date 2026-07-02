/**
 * SearchBar — Archive Terminal v4.0
 * Magenta-bordered terminal search input with animated icon.
 */
import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="search-wrap w-full max-w-lg">
    <div className="search-icon">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
    </div>
    <input
      type="text"
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      placeholder="search_archives..."
      className="input-terminal"
      aria-label="Search resources"
    />
    {searchQuery && (
      <button
        onClick={() => setSearchQuery('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded transition-colors"
        style={{ color: '#3a3a56' }}
        onMouseEnter={e => e.currentTarget.style.color='#ff3366'}
        onMouseLeave={e => e.currentTarget.style.color='#3a3a56'}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

export default SearchBar;
