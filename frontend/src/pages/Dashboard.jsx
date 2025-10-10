import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import AddPetModal from '../components/AddPetModal';
import PetDetailsModal from '../components/PetDetailsModal';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md"
      style={{
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white'
      }}
      initial={{ opacity: 0, y: -50, x: 100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      {type === 'success' ? (
        <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
      <span className="font-medium">{message}</span>
    </motion.div>
  );
};

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pets');
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [isPetDetailsModalOpen, setIsPetDetailsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Helper function to get pet/history ID consistently
  const getItemId = (item) => item._id || item.id;

  // Adoption resources
  const adoptionLinks = [
    {
      title: "Benefits of Adopting a Pet",
      url: "https://www.humanesociety.org/resources/top-reasons-adopt-pet",
      description: "Discover the top reasons why adoption is better than buying"
    },
    {
      title: "How to Prepare for Pet Adoption",
      url: "https://www.aspca.org/pet-care/general-pet-care/bringing-new-pet-home",
      description: "Everything you need to know before bringing your pet home"
    },
    {
      title: "Pet Adoption Statistics & Facts",
      url: "https://www.pawlicy.com/blog/pet-adoption-statistics/",
      description: "Learn how adoption saves lives and reduces homelessness"
    }
  ];

  // Fetch pets and history on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const [petsRes, historyRes] = await Promise.all([
          fetch(`${API_URL}/api/pets`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/history`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!petsRes.ok || !historyRes.ok) throw new Error("Failed to fetch data");
        const petsData = await petsRes.json();
        const historyData = await historyRes.json();
        setPets(petsData);
        setHistory(historyData);
        setError('');
      } catch (e) {
        console.error('Failed to load data:', e);
        setError('Failed to load data');
      }
      setLoading(false);
    };
    fetchData();
  }, [getToken]);

  // Add pet
  const handleSavePet = async (petData) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('name', petData.name);
      formData.append('breed', petData.breed);
      formData.append('birthday', petData.birthday);
      formData.append('image', petData.image);

      const res = await fetch(`${API_URL}/api/pets`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      if (!res.ok) throw new Error('Failed to add pet');
      
      const newPet = await res.json();
      setPets((prev) => [...prev, newPet]);
      setIsAddPetModalOpen(false);
      setError('');
      
      // Show success toast
      setToast({ message: `${petData.name} has been added successfully! 🎉`, type: 'success' });
    } catch (e) {
      console.error('Failed to add pet:', e);
      setError('Failed to add pet');
      setToast({ message: 'Failed to add pet. Please try again.', type: 'error' });
    }
  };

  // View pet details
  const handleViewPetDetails = (pet) => {
    setSelectedPet(pet);
    setIsPetDetailsModalOpen(true);
  };

  // Delete pet
  const handleDeletePet = async (petId) => {
    const pet = pets.find(p => getItemId(p) === petId);
    if (window.confirm(`${t('dashboard.pets.confirmDelete')} ${pet?.name}?`)) {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/pets/${petId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to delete pet');
        setPets(pets.filter(p => getItemId(p) !== petId));
        setIsPetDetailsModalOpen(false);
        setError('');
        setToast({ message: `${pet?.name} has been removed.`, type: 'success' });
      } catch (e) {
        console.error('Failed to delete pet:', e);
        setError('Failed to delete pet');
        setToast({ message: 'Failed to delete pet. Please try again.', type: 'error' });
      }
    }
  };

  // Add note
  const handleAddNote = async (petId, noteText, category) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('text', noteText);
      formData.append('category', category);
      const res = await fetch(`${API_URL}/api/pets/${petId}/notes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to add note');
      const note = await res.json();
      setPets(pets.map(pet => (getItemId(pet) === petId) ? { ...pet, notes: [...(pet.notes ?? []), note] } : pet));
      setSelectedPet(prev =>
        prev && (getItemId(prev) === petId)
          ? { ...prev, notes: [...(prev.notes ?? []), note] }
          : prev
      );
      setError('');
      setToast({ message: 'Note added successfully! 📝', type: 'success' });
    } catch (e) {
      console.error('Failed to add note:', e);
      setError('Failed to add note');
      setToast({ message: 'Failed to add note. Please try again.', type: 'error' });
    }
  };

  // Delete note
  const handleDeleteNote = async (petId, noteId) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/pets/${petId}/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete note');
      setPets(pets.map(pet => (getItemId(pet) === petId)
        ? { ...pet, notes: (pet.notes ?? []).filter(note => note.id !== noteId) }
        : pet
      ));
      setSelectedPet(prev =>
        prev && (getItemId(prev) === petId)
          ? { ...prev, notes: (prev.notes ?? []).filter(note => note.id !== noteId) }
          : prev
      );
      setError('');
      setToast({ message: 'Note deleted.', type: 'success' });
    } catch (e) {
      console.error('Failed to delete note:', e);
      setError('Failed to delete note');
      setToast({ message: 'Failed to delete note. Please try again.', type: 'error' });
    }
  };

  // Remove history
  const handleRemoveHistory = async (historyId) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/history/${historyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete history');
      setHistory(history.filter(item => getItemId(item) !== historyId));
      setError('');
      setToast({ message: 'History item removed.', type: 'success' });
    } catch (e) {
      console.error('Failed to delete history:', e);
      setError('Failed to delete history');
      setToast({ message: 'Failed to delete history. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'var(--color-body-bg)', color: 'var(--color-body-text)', paddingTop: '120px' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .pet-card { animation: scaleIn 0.5s ease-out backwards; }
        .pet-card:nth-child(1) { animation-delay: 0.1s; }
        .pet-card:nth-child(2) { animation-delay: 0.2s; }
        .pet-card:nth-child(3) { animation-delay: 0.3s; }
        .pet-card:nth-child(4) { animation-delay: 0.4s; }
        .history-item { animation: slideInLeft 0.5s ease-out backwards; }
        .history-item:nth-child(1) { animation-delay: 0.1s; }
        .history-item:nth-child(2) { animation-delay: 0.2s; }
        .history-item:nth-child(3) { animation-delay: 0.3s; }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="rounded-xl p-6 mb-6 shadow-lg" style={{ backgroundColor: '#8c52ff', animation: 'fadeIn 0.6s ease-out' }}>
              <div className="flex flex-col items-center text-center">
                <img src={user?.imageUrl} alt={user?.firstName} className="w-20 h-20 rounded-full border-4 border-white shadow-xl mb-4 transition-transform hover:scale-110" />
                <div className="text-white w-full">
                  <h1 className="text-xl mb-1">{user?.firstName} {user?.lastName}</h1>
                  <p className="text-sm opacity-90 mb-3 break-all">{user?.primaryEmailAddress?.emailAddress}</p>
                  <div className="pt-3 border-t border-white/20 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                      <span className="text-xs sm:text-sm">{t('dashboard.profile.joined')} {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                    {user?.unsafeMetadata?.city && (
                      <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        <span className="text-xs sm:text-sm">{user?.unsafeMetadata?.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--color-card-bg-start)', border: '1px solid var(--color-auth-card-border)', animation: 'fadeIn 0.6s ease-out 0.2s backwards' }}>
              <nav className="space-y-2">
                <button onClick={() => setActiveTab('pets')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300" style={{ backgroundColor: activeTab === 'pets' ? '#8c52ff' : 'transparent', color: activeTab === 'pets' ? 'white' : 'var(--color-body-text)', transform: activeTab === 'pets' ? 'scale(1.02)' : 'scale(1)' }}>
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" /></svg>
                  <span className="text-sm sm:text-base">{t('dashboard.tabs.pets')}</span>
                </button>
                <button onClick={() => setActiveTab('history')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300" style={{ backgroundColor: activeTab === 'history' ? '#8c52ff' : 'transparent', color: activeTab === 'history' ? 'white' : 'var(--color-body-text)', transform: activeTab === 'history' ? 'scale(1.02)' : 'scale(1)' }}>
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                  <span className="text-sm sm:text-base">{t('dashboard.tabs.history')}</span>
                </button>
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-9" key={activeTab} style={{ animation: 'fadeIn 0.4s ease-in-out' }}>
            {activeTab === 'pets' && (
              <div>
                {/* Header with Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-2xl sm:text-3xl" style={{ color: 'var(--color-auth-title)' }}>{t('dashboard.pets.title')}</h2>
                  {pets.length > 0 && (
                    <button onClick={() => setIsAddPetModalOpen(true)} className="px-5 py-2.5 rounded-lg text-white transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto" style={{ backgroundColor: '#8c52ff', boxShadow: '0 4px 14px rgba(140, 82, 255, 0.4)' }}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                      {t('dashboard.pets.addPet')}
                    </button>
                  )}
                </div>
                {/* Pet Cards */}
                {pets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {pets.map((pet, index) => (
                      <div key={getItemId(pet)} className="pet-card rounded-xl p-4 sm:p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl" style={{ backgroundColor: 'var(--color-card-bg-start)', border: '1px solid var(--color-auth-card-border)' }}>
                        <div className="overflow-hidden rounded-lg mb-4">
                          <img src={pet.image ?? pet.image_url} alt={pet.name} className="w-full h-40 sm:h-48 object-cover transition-transform hover:scale-110" />
                        </div>
                        <h3 className="text-xl sm:text-2xl mb-2" style={{ color: 'var(--color-auth-title)' }}>{pet.name}</h3>
                        <p className="mb-1 text-sm sm:text-base" style={{ color: 'var(--color-auth-subtitle)' }}><span>{t('dashboard.pets.petBreed')}:</span> {pet.breed}</p>
                        <p className="text-xs sm:text-sm mb-4" style={{ color: 'var(--color-auth-subtitle)' }}><span>{t('dashboard.pets.addedOn')}:</span> {pet.addedOn}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleViewPetDetails(pet)} className="flex-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all hover:shadow-lg" style={{ backgroundColor: '#8c52ff', color: 'white', boxShadow: '0 2px 8px rgba(140, 82, 255, 0.3)' }}>{t('dashboard.pets.viewDetails')}</button>
                          <button onClick={() => handleDeletePet(getItemId(pet))} className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all" style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444' }}>{t('dashboard.pets.delete')}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl p-6 sm:p-8 text-center mb-6 sm:mb-8" style={{ backgroundColor: 'var(--color-card-bg-start)', border: '1px solid var(--color-auth-card-border)', animation: 'scaleIn 0.5s ease-out' }}>
                    <div className="text-5xl sm:text-6xl mb-4">🐾</div>
                    <p className="text-base sm:text-lg mb-4" style={{ color: 'var(--color-auth-subtitle)' }}>{t('dashboard.pets.noPets')}</p>
                    <button onClick={() => setIsAddPetModalOpen(true)} className="px-6 py-3 rounded-lg text-white transition-all hover:scale-105 hover:shadow-xl text-sm sm:text-base" style={{ backgroundColor: '#8c52ff', boxShadow: '0 4px 14px rgba(140, 82, 255, 0.4)' }}>{t('dashboard.pets.addPet')}</button>
                  </div>
                )}
                {/* Adoption CTA */}
                {pets.length === 0 && (
                  <div className="rounded-xl p-6 sm:p-8 shadow-lg" style={{ backgroundColor: 'rgba(140, 82, 255, 0.1)', border: '1px solid rgba(140, 82, 255, 0.3)', animation: 'scaleIn 0.5s ease-out 0.2s backwards' }}>
                    <h3 className="text-xl sm:text-2xl mb-3" style={{ color: 'var(--color-auth-title)' }}>{t('dashboard.pets.adoptTitle')} 🐾</h3>
                    <p className="mb-6 text-base sm:text-lg" style={{ color: 'var(--color-auth-subtitle)' }}>{t('dashboard.pets.adoptDesc')}</p>
                    <div className="grid gap-4 mb-6">
                      {adoptionLinks.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg transition-all hover:scale-[1.02] hover:shadow-lg" style={{ backgroundColor: 'var(--color-card-bg-start)', border: '1px solid var(--color-auth-card-border)' }}>
                          <h4 className="text-base sm:text-lg mb-1" style={{ color: '#8c52ff' }}>{link.title} →</h4>
                          <p className="text-xs sm:text-sm" style={{ color: 'var(--color-auth-subtitle)' }}>{link.description}</p>
                        </a>
                      ))}
                    </div>
                    <button onClick={() => window.open('https://www.petfinder.com', '_blank')} className="w-full sm:w-auto px-6 py-3 rounded-lg text-white transition-all hover:scale-105 hover:shadow-xl text-sm sm:text-base" style={{ backgroundColor: '#8c52ff', boxShadow: '0 4px 14px rgba(140, 82, 255, 0.4)' }}>{t('dashboard.pets.adoptCTA')}</button>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-2xl sm:text-3xl mb-6" style={{ color: 'var(--color-auth-title)' }}>{t('dashboard.history.title')}</h2>
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item, index) => (
                      <div key={getItemId(item)} className="history-item rounded-xl p-4 sm:p-6 shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl" style={{ backgroundColor: 'var(--color-card-bg-start)', border: '1px solid var(--color-auth-card-border)' }}>
                        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                          <div className="overflow-hidden rounded-lg flex-shrink-0">
                            <img src={item.image ?? item.image_url} alt={item.breed} className="w-20 h-20 sm:w-24 sm:h-24 object-cover transition-transform hover:scale-110" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl mb-1 truncate" style={{ color: 'var(--color-auth-title)' }}>{item.breed}</h3>
                            <p className="mb-1 text-sm sm:text-base" style={{ color: 'var(--color-auth-subtitle)' }}><span>{t('dashboard.history.confidence')}:</span> <span style={{ color: '#8c52ff' }}>{item.confidence}</span></p>
                            <p className="text-xs sm:text-sm mb-3 sm:mb-0" style={{ color: 'var(--color-auth-subtitle)' }}><span>{t('dashboard.history.searchedOn')}:</span> {item.searchedOn}</p>
                          </div>
                          <button onClick={() => handleRemoveHistory(getItemId(item))} className="px-4 py-2 rounded-lg transition-all text-xs sm:text-sm flex-shrink-0" style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444' }}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl p-8 sm:p-12 text-center" style={{ backgroundColor: 'var(--color-card-bg-start)', border: '1px solid var(--color-auth-card-border)', animation: 'scaleIn 0.5s ease-out' }}>
                    <div className="text-5xl sm:text-6xl mb-4">🔍</div>
                    <p className="text-base sm:text-lg mb-2" style={{ color: 'var(--color-auth-subtitle)' }}>{t('dashboard.history.noHistory')}</p>
                    <p className="mb-6 text-sm sm:text-base" style={{ color: 'var(--color-auth-subtitle)' }}>{t('dashboard.history.searchDesc')}</p>
                    <button onClick={() => navigate('/')} className="px-6 py-3 rounded-lg text-white transition-all hover:scale-105 hover:shadow-xl text-sm sm:text-base" style={{ backgroundColor: '#8c52ff', boxShadow: '0 4px 14px rgba(140, 82, 255, 0.4)' }}>{t('dashboard.history.startSearch')}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
        onSave={handleSavePet}
      />
      <PetDetailsModal
        isOpen={isPetDetailsModalOpen}
        onClose={() => setIsPetDetailsModalOpen(false)}
        pet={selectedPet}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />
      {error && <div className="text-red-600 text-center mt-4">{error}</div>}
      {loading && <div className="text-center mt-4">Loading...</div>}
      
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

















