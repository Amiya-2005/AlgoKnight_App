import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Buffer from '../components/common/Buffer';
import Button from '../components/common/Button';
import { ChevronDown, Trash2 } from 'lucide-react';
import { ConceptsContext } from '../context/ConceptsContext';
import { toast } from 'react-toastify';

// Animation wrapper component
const AnimatedCard = ({ children, className = "", delay = 0 }) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-700 ease-out ${hasAnimated
        ? 'translate-y-0 opacity-100'
        : 'translate-y-8 opacity-0'
        } ${className}`}
    >
      {children}
    </div>
  );
};

// Modal for adding/editing notes
const NoteModal = ({ isOpen, onClose, note, index, onSave, theme }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    notes: {
      basic: '',
      intermediate: '',
      advanced: ''
    },
    problemLinks: ['']
  });

  useEffect(() => {
    if (note) {
      setFormData(note);
    } else {
      setFormData({
        title: '',
        description: '',
        notes: {
          basic: '',
          intermediate: '',
          advanced: ''
        },
        problemLinks: ['']
      });
    }
  }, [note, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave({
        ...formData,
        problemLinks: formData.problemLinks.filter(link => link.trim())
      }, index);
      onClose();
    }
  };

  const addProblemLink = () => {
    setFormData(prev => ({
      ...prev,
      problemLinks: [...prev.problemLinks, '']
    }));
  };

  const removeProblemLink = (index) => {
    setFormData(prev => ({
      ...prev,
      problemLinks: prev.problemLinks.filter((_, i) => i !== index)
    }));
  };

  const updateProblemLink = (index, value) => {
    setFormData(prev => ({
      ...prev,
      problemLinks: prev.problemLinks.map((link, i) => i === index ? value : link)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto thin-scrollbar rounded-xl border ${theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
        }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {note ? 'Edit Note' : 'Add New Note'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="e.g., Dynamic Programming"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Brief description of the concept"
                />
              </div>
            </div>

            {/* Notes Sections */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content</h3>
              {['basic', 'intermediate', 'advanced'].map((level) => (
                <div key={level}>
                  <label className="text-sm font-medium mb-2 capitalize flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${level === 'basic' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      level === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {level}
                    </span>
                  </label>
                  <textarea
                    value={formData.notes[level]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      notes: { ...prev.notes, [level]: e.target.value }
                    }))}
                    className={`w-full p-3 rounded-lg border transition-colors resize-none ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 thin-scrollbar`}
                    rows="3"
                    placeholder={`${level.charAt(0).toUpperCase() + level.slice(1)} level points or link to the file (Cloud/Local etc)...`}
                  />
                </div>
              ))}
            </div>

            {/* Problem Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Problem Links</h3>
                <button
                  type="button"
                  onClick={addProblemLink}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  + Add Link
                </button>
              </div>
              {formData.problemLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateProblemLink(index, e.target.value)}
                    className={`flex-1 p-3 rounded-lg border transition-colors ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="https://example.com/problem"
                  />
                  {formData.problemLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProblemLink(index)}
                      className={`p-3 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-500'
                        }`}
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700 border-gray-200">
              <Button
                variant='secondary'
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
              >
                {note ? 'Update Note' : 'Save Note'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Individual Note Card
const NoteCard = ({ note, onEdit, onDelete, theme, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedCard delay={index * 100}>
      <div className={`rounded-xl p-4 sm:p-6 border border-transparent transition-all duration-300 hover:text-blue-500 hover:border-blue-500 bg-white dark:bg-gray-800 shadow-sm `}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold mb-2 break-words">{note.title}</h3>
            {note.description && (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2 break-words`}>
                {note.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 sm:ml-4 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              aria-label="Toggle expand"
            >
              <ChevronDown className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => onEdit(note, index)}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-100 text-blue-500'
                }`}
              aria-label="Edit note"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(index)}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-500'
                }`}
              aria-label="Delete note"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="space-y-4 border-t pt-4 dark:border-gray-700 border-gray-200 max-h-[70vh] overflow-y-auto thin-scrollbar">
            {/* Notes */}
            {(note.notes.basic || note.notes.intermediate || note.notes.advanced) && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm sm:text-base sticky top-0 bg-inherit py-1 z-10">Content</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto thin-scrollbar">
                  {['basic', 'intermediate', 'advanced'].map((level) =>
                    note.notes[level] && (
                      <div key={level} className={`p-3 sm:p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/40' : 'bg-gray-50/60'
                        }`}>
                        <div className={`text-sm font-medium mb-2 flex items-center space-x-2`}>
                          <span className={`px-2 py-1 rounded text-xs ${level === 'basic' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            level === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </span>
                        </div>
                        <div className={`text-xs sm:text-sm whitespace-pre-wrap break-words max-h-32 overflow-y-auto thin-scrollbar ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                          {note.notes[level]}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Problem Links */}
            {note.problemLinks && note.problemLinks.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm sm:text-base sticky top-0 bg-inherit py-1 z-10">
                  Problem Links ({note.problemLinks.length})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto thin-scrollbar">
                  {note.problemLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg transition-colors break-all ${theme === 'dark'
                        ? 'bg-gray-700/40 hover:bg-gray-700/60 text-blue-400'
                        : 'bg-gray-50/60 hover:bg-gray-100/60 text-blue-500'
                        }`}
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="text-xs sm:text-sm min-w-0 flex-1 word-break break-words">{link}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Scroll indicator for mobile */}
            <div className="text-center pt-2 sm:hidden">
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                ↕ Scroll to see more content
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [fadeOutPageLoader, setFadeOutPageLoader] = useState(false);

  const { theme } = useContext(ThemeContext);

  const { getAllConcepts, addConcept, editConcept, removeConcept } = useContext(ConceptsContext);

  useEffect(() => {
    const fun = async () => {
      const notes = await getAllConcepts();
      setNotes(notes);
      setFadeOutPageLoader(true);
      setTimeout(() => {
        setPageLoading(false);
      }, 500);
    }

    fun();

  }, []);

  const filteredNotes = notes
    .filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSaveNote = async (noteData, index) => {
    if (editingNote) {
      const response = await editConcept(noteData, index);
      if (response.success) {
        setNotes(prev => prev.map((x, ind) => ind === index ? noteData : x));
        toast.success("Note edited successfully")
      }
      else {
        toast.error("Note editing failed");
      }
    } else {
      const response = await addConcept(noteData);
      if (response.success) {
        setNotes(prev => [...prev, noteData]);
        toast.success("Note created successfully")
      }
      else{
        toast.error("Note creation failed");
      }
    }
    setEditingNote(null);
    setEditingNoteIndex(null);
  };

  const handleEditNote = (note, index) => {  // Triggers Modal to open
    setEditingNote(note);
    setEditingNoteIndex(index)
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (index) => {
    const response = await removeConcept(index);
    if (response.success) {
      setNotes(prev => prev.filter((_, ind) => ind !== index));
      toast.success("Note removed successfully");
    }
    else {
      toast.error("Note removal failed");
    }
  };

  const handleAddNew = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  if (pageLoading) {
    return (
      <Buffer
        className='xl:pl-64'
        type='dots'
        text="Loading Notes..."
        fadeOut={fadeOutPageLoader}
      />
    );
  }

  return (
    <div className={`min-h-screen w-full xl:ml-64 p-6 transition-opacity duration-500 
      dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 
      dark:text-white 
      bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900`}>

      {/* Header Section */}
      <AnimatedCard className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
          <div className="flex flex-col items-center space-x-4 mb-4 lg:mb-0 w-full text-center mt-10">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-white py-2 mx-auto">
              Saved Notes
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Your personal knowledge base for competitive programming
            </p>
          </div>

          <div className={`px-4 py-2 rounded-lg ${theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
            }`}>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{notes.length}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Notes Saved
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Controls Section */}
      <AnimatedCard delay={100}>
        <div className={`rounded-xl p-6 mb-6 ${theme === 'dark'
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200 shadow-sm'
          }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 lg:mr-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>
            </div>

            {/* Sort and Add Button */}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleAddNew}
                className="lg:px-6 lg:py-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Note</span>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <AnimatedCard delay={200}>
          <div className={`rounded-xl p-12 text-center ${theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200 shadow-sm'
            }`}>
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start building your algorithm knowledge base by adding your first note'
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={handleAddNew}
              >
                Add Your First Note
              </Button>
            )}
          </div>
        </AnimatedCard>
      ) : (
        <div className="grid gap-6">
          {filteredNotes.map((note, index) => (
            <NoteCard
              key={index}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              theme={theme}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Statistics Section */}
      {notes.length > 0 && (
        <AnimatedCard delay={300} className="mt-8">
          <div className={`rounded-xl p-6 ${theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200 shadow-sm'
            }`}>
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{notes.length}</div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Notes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {notes.reduce((acc, note) => acc + (note.problemLinks?.length || 0), 0)}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Problem Links
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {notes.filter(c => c.notes.advanced).length}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Advanced Notes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {notes.filter(c =>
                    new Date(c.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                  ).length}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Recent Updates
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
          setEditingNoteIndex(null);
        }}
        note={editingNote}
        index={editingNoteIndex}
        onSave={handleSaveNote}
        theme={theme}
      />
    </div>
  );
}