import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiEdit2, FiTrash2, FiStar, FiShare2, FiMoreVertical } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Card from '../common/Card';

const NoteItem = ({ 
  note, 
  onEdit, 
  onDelete, 
  onToggleFavorite,
  onShare,
  className 
}) => {
  const [showActions, setShowActions] = useState(false);
  
  // Truncate note content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  // Format date nicely
  const formattedDate = note.updatedAt 
    ? format(new Date(note.updatedAt), 'MMM d, yyyy')
    : format(new Date(note.createdAt), 'MMM d, yyyy');

  // Get tag color class based on note type/tag
  const getTagColorClass = (tag) => {
    const colorMap = {
      'algorithm': 'bg-indigo-100 text-indigo-800',
      'contest': 'bg-green-100 text-green-800',
      'bug': 'bg-red-100 text-red-800',
      'learning': 'bg-blue-100 text-blue-800',
      'interview': 'bg-purple-100 text-purple-800'
    };
    
    return colorMap[tag] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`note-item ${className}`}
    >
      <Card
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        className={`relative transition-all duration-200 hover:shadow-md ${
          note.isPinned ? 'border-l-4 border-l-yellow-400' : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 truncate pr-8">{note.title}</h3>
          <button 
            onClick={() => onToggleFavorite(note._id)}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <FiStar className={note.isFavorite ? 'text-yellow-500 fill-yellow-500' : ''} size={18} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags && note.tags.map((tag, index) => (
            <span 
              key={index} 
              className={`px-2 py-1 text-xs rounded-full ${getTagColorClass(tag.toLowerCase())}`}
            >
              {tag}
            </span>
          ))}
          {note.relatedProblem && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              Problem: {note.relatedProblem}
            </span>
          )}
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 note-content">
          {truncateContent(note.content)}
        </div>
        
        <div className="mt-2 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {note.updatedAt ? 'Updated ' : 'Created '} 
            {formattedDate}
          </div>
          
          <div className={`flex space-x-2 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={() => onEdit(note)}
              className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FiEdit2 size={16} />
            </button>
            <button 
              onClick={() => onShare(note)}
              className="p-1 text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <FiShare2 size={16} />
            </button>
            <button 
              onClick={() => onDelete(note._id)}
              className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default NoteItem;