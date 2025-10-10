import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PetDetailsModal({ isOpen, onClose, pet, onAddNote, onDeleteNote }) {
  const { t } = useTranslation();
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!isOpen || !pet) return null;

  // Helper function to get pet ID
  const getPetId = () => pet._id || pet.id;

  const categories = [
    { value: 'health', label: t('dashboard.pets.petDetails.categories.health'), color: '#ef4444' },
    { value: 'vaccination', label: t('dashboard.pets.petDetails.categories.vaccination'), color: '#3b82f6' },
    { value: 'treats', label: t('dashboard.pets.petDetails.categories.treats'), color: '#f59e0b' },
    { value: 'dailyLife', label: t('dashboard.pets.petDetails.categories.dailyLife'), color: '#10b981' },
    { value: 'milestone', label: t('dashboard.pets.petDetails.categories.milestone'), color: '#8b5cf6' },
    { value: 'other', label: t('dashboard.pets.petDetails.categories.other'), color: '#6b7280' }
  ];

  const handleAddNote = () => {
    if (newNote.trim()) {
      const petId = getPetId();
      onAddNote(petId, newNote, selectedCategory);
      setNewNote('');
      setSelectedCategory('other');
      setShowNoteInput(false);
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0) {
      return `${years} ${t('dashboard.pets.yearsOld')}`;
    } else {
      return `${remainingMonths} ${t('dashboard.pets.monthsOld')}`;
    }
  };

  const filteredNotes = filterCategory === 'all' 
    ? pet.notes 
    : pet.notes?.filter(note => note.category === filterCategory);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        className="rounded-2xl shadow-2xl w-full max-w-2xl"
        style={{
          backgroundColor: 'var(--color-auth-card-bg)',
          border: '1px solid var(--color-auth-card-border)',
          marginTop: '2rem',
          marginBottom: '2rem',
          maxHeight: 'calc(100vh - 4rem)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable Content Container */}
        <div 
          className="p-8"
          style={{ 
            overflowY: 'auto',
            flex: 1
          }}
        >
          {/* Header */}
          <div className="flex items-start gap-6 mb-6 pb-6 border-b" style={{ borderColor: 'var(--color-auth-divider)' }}>
            <img 
              src={pet.image || pet.image_url} 
              alt={pet.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 
                className="text-3xl mb-2"
                style={{ color: 'var(--color-auth-title)' }}
              >
                {pet.name}
              </h2>
              <p 
                className="text-lg mb-1"
                style={{ color: 'var(--color-auth-subtitle)' }}
              >
                {t('dashboard.pets.petBreed')}: {pet.breed}
              </p>
              {pet.birthday && (
                <>
                  <p 
                    className="text-sm mb-1"
                    style={{ color: 'var(--color-auth-subtitle)' }}
                  >
                    {t('dashboard.pets.birthday')}: {new Date(pet.birthday).toLocaleDateString()}
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: '#8c52ff' }}
                  >
                    {t('dashboard.pets.age')}: {calculateAge(pet.birthday)}
                  </p>
                </>
              )}
              <p 
                className="text-sm mt-2"
                style={{ color: 'var(--color-auth-subtitle)' }}
              >
                {t('dashboard.pets.addedOn')}: {pet.addedOn}
              </p>
            </div>
          </div>

          {/* Journal Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="text-xl"
                style={{ color: 'var(--color-auth-title)' }}
              >
                {t('dashboard.pets.petDetails.journal')}
              </h3>
              <button
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="px-4 py-2 rounded-lg text-white text-sm transition-transform hover:scale-105"
                style={{
                  backgroundColor: '#8c52ff',
                  boxShadow: '0 2px 8px rgba(140, 82, 255, 0.3)'
                }}
              >
                {t('dashboard.pets.petDetails.addNote')}
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label 
                className="block text-sm mb-2"
                style={{ color: 'var(--color-auth-title)' }}
              >
                {t('dashboard.pets.petDetails.filterByCategory')}
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--clerk-color-input-bg)',
                  color: 'var(--clerk-color-text-primary)',
                  border: '1px solid var(--clerk-color-input-border)'
                }}
              >
                <option value="all">{t('dashboard.pets.petDetails.allCategories')}</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Add Note Input */}
            {showNoteInput && (
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(140, 82, 255, 0.05)' }}>
                <label 
                  className="block text-sm mb-2"
                  style={{ color: 'var(--color-auth-title)' }}
                >
                  {t('dashboard.pets.petDetails.noteCategory')}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 mb-3"
                  style={{
                    backgroundColor: 'var(--clerk-color-input-bg)',
                    color: 'var(--clerk-color-text-primary)',
                    border: '1px solid var(--clerk-color-input-border)'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={t('dashboard.pets.petDetails.notePlaceholder')}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 mb-3"
                  style={{
                    backgroundColor: 'var(--clerk-color-input-bg)',
                    color: 'var(--clerk-color-text-primary)',
                    border: '1px solid var(--clerk-color-input-border)',
                    minHeight: '80px'
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 rounded-lg text-white text-sm transition-all hover:scale-105"
                    style={{
                      backgroundColor: '#8c52ff',
                    }}
                  >
                    {t('dashboard.pets.petDetails.saveNote')}
                  </button>
                  <button
                    onClick={() => {
                      setShowNoteInput(false);
                      setNewNote('');
                      setSelectedCategory('other');
                    }}
                    className="px-4 py-2 rounded-lg text-sm transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-auth-subtitle)',
                      border: '1px solid var(--color-auth-card-border)'
                    }}
                  >
                    {t('dashboard.pets.addPetModal.cancel')}
                  </button>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-3">
              {filteredNotes && filteredNotes.length > 0 ? (
                filteredNotes.map((note) => {
                  const category = categories.find(c => c.value === note.category);
                  return (
                    <div 
                      key={note.id}
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: 'var(--color-card-bg-start)',
                        border: '1px solid var(--color-auth-card-border)',
                        borderLeft: `4px solid ${category?.color || '#6b7280'}`
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span 
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: `${category?.color}20`,
                            color: category?.color
                          }}
                        >
                          {category?.label}
                        </span>
                        <button
                          onClick={() => {
                            const petId = getPetId();
                            onDeleteNote(petId, note.id);
                          }}
                          className="px-3 py-1 rounded text-xs transition-all"
                          style={{
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            border: '1px solid #ef4444'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#ef4444';
                          }}
                        >
                          {t('dashboard.pets.petDetails.deleteNote')}
                        </button>
                      </div>
                      <p 
                        className="mb-2"
                        style={{ color: 'var(--color-auth-title)' }}
                      >
                        {note.text}
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: 'var(--color-auth-subtitle)' }}
                      >
                        {new Date(note.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div 
                  className="p-8 text-center rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-card-bg-start)',
                    border: '1px solid var(--color-auth-card-border)'
                  }}
                >
                  <p style={{ color: 'var(--color-auth-subtitle)' }}>
                    {filterCategory === 'all' 
                      ? t('dashboard.pets.petDetails.noNotes')
                      : `No ${categories.find(c => c.value === filterCategory)?.label} notes yet`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close Button - Fixed at bottom */}
        <div 
          className="p-6 border-t" 
          style={{ 
            borderColor: 'var(--color-auth-divider)',
            flexShrink: 0
          }}
        >
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg text-white transition-transform hover:scale-105"
            style={{
              backgroundColor: '#8c52ff',
              boxShadow: '0 4px 14px rgba(140, 82, 255, 0.4)'
            }}
          >
            {t('dashboard.pets.petDetails.close')}
          </button>
        </div>
      </div>
    </div>
  );
}


