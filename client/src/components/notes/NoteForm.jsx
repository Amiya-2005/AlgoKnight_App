import React, { useState, useEffect, useRef } from 'react';
import { FiSave, FiX, FiLink, FiPaperclip, FiTag, FiChevronDown } from 'react-icons/fi';
import { Editor } from '@tinymce/tinymce-react';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';

const COMMON_TAGS = ['Algorithm', 'Contest', 'Bug', 'Learning', 'Interview', 'Snippet'];

const NoteForm = ({ 
  note = {}, 
  onSubmit, 
  onCancel,
  loading = false,
  error = null 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    relatedProblem: '',
    isPinned: false,
    ...note
  });
  
  const [tagInput, setTagInput] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const editorRef = useRef(null);
  const tagInputRef = useRef(null);
  
  // Set up autosave timer
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaving, setAutoSaving] = useState(false);
  
  useEffect(() => {
    const autosaveTimer = setTimeout(() => {
      if (formData.title && formData.content && note?._id) {
        handleAutosave();
      }
    }, 30000); // Autosave every 30 seconds
    
    return () => clearTimeout(autosaveTimer);
  }, [formData]);
  
  const handleAutosave = async () => {
    setAutoSaving(true);
    try {
      await onSubmit(formData, true); // Pass true for autosave
      setLastSaved(new Date());
    } catch (err) {
      console.error('Autosave failed:', err);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      content
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const handleTagAdd = (tag) => {
    if (!tag.trim()) return;
    
    // Prevent duplicates
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
    
    setTagInput('');
    setShowTagDropdown(false);
  };
  
  const handleTagRemove = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      handleTagAdd(tagInput);
    } else if (e.key === 'Escape') {
      setShowTagDropdown(false);
    }
  };

  useEffect(() => {
    // Click outside to close tag dropdown
    const handleClickOutside = (event) => {
      if (tagInputRef.current && !tagInputRef.current.contains(event.target)) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Note Title"
            required
            className="text-xl font-semibold"
            autoFocus
          />
        </div>
        
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <FiTag className="mr-1" size={16} />
              <span>Tags:</span>
            </div>
            
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}
            
            <div className="relative" ref={tagInputRef}>
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  if (e.target.value) {
                    setShowTagDropdown(true);
                  }
                }}
                onFocus={() => setShowTagDropdown(true)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tag..."
                className="text-sm px-2 py-1 w-24"
              />
              
              {showTagDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 text-sm">
                  {COMMON_TAGS.filter(tag => 
                    tag.toLowerCase().includes(tagInput.toLowerCase()) && 
                    !formData.tags.includes(tag)
                  ).map((tag, index) => (
                    <div
                      key={index}
                      onClick={() => handleTagAdd(tag)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      {tag}
                    </div>
                  ))}
                  {tagInput && !COMMON_TAGS.includes(tagInput) && (
                    <div
                      onClick={() => handleTagAdd(tagInput)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer font-medium"
                    >
                      Add "{tagInput}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPinned"
                name="isPinned"
                checked={formData.isPinned}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
              />
              <label htmlFor="isPinned" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Pin this note
              </label>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <FiLink className="mr-1" size={16} />
              <Input
                type="text"
                name="relatedProblem"
                value={formData.relatedProblem}
                onChange={handleChange}
                placeholder="Link to problem ID"
                className="text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-5">
          <Editor
            onInit={(evt, editor) => editorRef.current = editor}
            value={formData.content}
            onEditorChange={handleEditorChange}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'codesample'
              ],
              toolbar: 'undo redo | formatselect | ' +
                'bold italic forecolor backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | codesample | help',
              codesample_languages: [
                { text: 'JavaScript', value: 'javascript' },
                { text: 'Python', value: 'python' },
                { text: 'Java', value: 'java' },
                { text: 'C++', value: 'cpp' },
                { text: 'Ruby', value: 'ruby' },
                { text: 'HTML/XML', value: 'markup' },
                { text: 'CSS', value: 'css' }
              ],
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              skin: localStorage.getItem('theme') === 'dark' ? 'oxide-dark' : 'oxide',
              content_css: localStorage.getItem('theme') === 'dark' ? 'dark' : 'default'
            }}
          />
        </div>
        
        {error && <ErrorMessage message={error} className="mb-4" />}
        
        <div className="flex items-center justify-between mt-6">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {autoSaving && 'Auto-saving...'}
            {lastSaved && !autoSaving && `Last saved ${lastSaved.toLocaleTimeString()}`}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-4"
              icon={<FiSave />}
            >
              {loading ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;