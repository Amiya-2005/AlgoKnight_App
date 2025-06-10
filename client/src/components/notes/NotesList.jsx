import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPlus, FiGrid, FiList, FiTrash2, FiStar } from 'react-icons/fi';
import NoteItem from './NoteItem';
import Button from '../common/Button';
import Input from '../common/Input';
import Loading from '../common/Loading';
import { AnimatePresence, motion } from 'framer-motion';

const SORT_OPTIONS = [
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'title', label: 'Title' },
];

const NotesList = ({
  notes = [],
  loading = false,
  error = null,
  onCreateNote,
  onEditNote,
  onDeleteNote,
  onToggleFavorite,
  onShareNote,
  onSelectTag,
  currentTag = null,
  currentCategory = null,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [activeTags, setActiveTags] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Extract all unique tags from notes
  const allTags = Array.from(
    new Set(
      notes.flatMap(note => note.tags || [])
    )
  ).sort();
  
  // Filter and sort notes based on current filters
  useEffect(() => {
    let filtered = [...notes];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(term) || 
        note.content.toLowerCase().includes(term) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Filter by tags
    if (activeTags.size > 0) {
      filtered = filtered.filter(note => 
        note.tags && note.tags.some(tag => activeTags.has(tag))
      );
    }
    
    // Filter by current tag if provided
    if (currentTag) {
      filtered = filtered.filter(note => 
        note.tags && note.tags.includes(currentTag)
      );
    }
    
    // Filter by current category if provided
    if (currentCategory) {
      filtered = filtered.filter(note => note.category === currentCategory);
    }
    
    // Filter favorites only
    if (showFavoritesOnly) {
      filtered = filtered.filter(note => note.isFavorite);
    }
    
    // Sort notes
    filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        // Sort by date fields in descending order (newest first)
        const dateA = new Date(a[sortBy]);
        const dateB = new Date(b[sortBy]);
        return dateB - dateA;
      }
    });
    
    setFilteredNotes(filtered);
  }, [notes, searchTerm, sortBy, activeTags, currentTag, currentCategory, showFavoritesOnly]);
  
  const handleTagToggle = (tag) => {
    const newActiveTags = new Set(activeTags);
    if (newActiveTags.has(tag)) {
      newActiveTags.delete(tag);
    } else {
      newActiveTags.add(tag);
    }
    setActiveTags(newActiveTags);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveTags(new Set());
    setShowFavoritesOnly(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-5 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={onCreateNote}>Create a New Note</Button>
      </div>
    );
  }

  return (
    <div className="notes-list">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="relative w-full md:w-auto flex-grow md:mr-4 mb-4 md:mb-0">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="pl-9 pr-4 py-2 w-full"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="px-3"
            icon={<FiFilter />}
          >
            Filter
          </Button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              <FiGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              <FiList size={16} />
            </button>
          </div>
          
          <Button 
            onClick={onCreateNote}
            variant="primary" 
            className="px-3"
            icon={<FiPlus />}
          >
            New Note
          </Button>
        </div>
      </div>
      
      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="mr-2 font-medium text-sm text-gray-700 dark:text-gray-300">Tags:</div>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    activeTags.has(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <div className="flex items-center mb-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFavoritesOnly}
                  onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                  <FiStar className="mr-1 text-yellow-500" size={14} /> 
                  Show favorites only
                </span>
              </label>
            </div>
            
            <div className="flex justify-end mt-2">
              <Button
                variant="text"
                size="sm"
                onClick={handleClearFilters}
                className="text-sm"
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Notes count and results */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
        {searchTerm && ` matching "${searchTerm}"`}
        {activeTags.size > 0 && ` with selected tags`}
        {showFavoritesOnly && ` in favorites`}
      </div>
      
      {/* Empty state */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No notes found with the current filters</p>
          <Button onClick={onCreateNote} variant="primary" icon={<FiPlus />}>
            Create Your First Note
          </Button>
        </div>
      )}
      
      {/* Notes grid or list */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'flex flex-col space-y-3'
        }
      `}>
        <AnimatePresence>
          {filteredNotes.map((note) => (
            <NoteItem
              key={note._id}
              note={note}
              onEdit={onEditNote}
              onDelete={onDeleteNote}
              onToggleFavorite={onToggleFavorite}
              onShare={onShareNote}
              className={viewMode === 'list' ? 'w-full' : ''}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotesList;