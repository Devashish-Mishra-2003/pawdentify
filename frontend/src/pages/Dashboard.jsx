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
      className="fixed top-24 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md"
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
      <span className="font-archivo font-semibold">{message}</span>
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

  const getItemId = (item) => item._id || item.id;

  const adoptionLinks = [
    {
      title: "Benefits of Adopting a Pet",
      url: "https://www.humanesociety.org/resources/top-reasons-adopt-pet",
      description: "Discover the top reasons why adoption is better than buying",
      icon: "❤️"
    },
    {
      title: "How to Prepare for Pet Adoption",
      url: "https://www.aspca.org/pet-care/general-pet-care/bringing-new-pet-home",
      description: "Everything you need to know before bringing your pet home",
      icon: "🏡"
    },
    {
      title: "Pet Adoption Statistics & Facts",
      url: "https://www.pawlicy.com/blog/pet-adoption-statistics/",
      description: "Learn how adoption saves lives and reduces homelessness",
      icon: "📊"
    }
  ];

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
      setToast({ message: `${petData.name} has been added successfully!`, type: 'success' });
    } catch (e) {
      console.error('Failed to add pet:', e);
      setError('Failed to add pet');
      setToast({ message: 'Failed to add pet. Please try again.', type: 'error' });
    }
  };

  const handleViewPetDetails = (pet) => {
    setSelectedPet(pet);
    setIsPetDetailsModalOpen(true);
  };

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
      setToast({ message: 'Note added successfully!', type: 'success' });
    } catch (e) {
      console.error('Failed to add note:', e);
      setError('Failed to add note');
      setToast({ message: 'Failed to add note. Please try again.', type: 'error' });
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-page-bg)', paddingTop: '120px' }}>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full animate-spin" style={{ border: '4px solid rgba(140, 82, 255, 0.2)', borderTopColor: '#8c52ff' }}></div>
          <p className="font-archivo text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            {t('dashboard.loading')}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-page-bg)', paddingTop: '100px' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section - Perfect Alignment */}
      
{/* Hero Section - Perfect Alignment */}
<motion.div
  className="mb-8 rounded-3xl shadow-lg overflow-hidden"
  style={{
    backgroundColor: 'var(--color-card-bg)',
    border: '2px solid var(--color-card-border)'
  }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  {/* Top gradient bar */}
  <div 
    className="h-32"
    style={{
      background: 'linear-gradient(135deg, #8c52ff 0%, #a78bfa 100%)'
    }}
  />
  
  {/* Profile content */}
  <div className="px-8 pb-8 -mt-22">
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
      {/* Profile image and info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
        {/* Image with badge */}
        <motion.div
          className="relative flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring" }}
        >
          <img
            src={user?.imageUrl}
            alt={user?.firstName}
            className="w-42 h-42 rounded-2xl shadow-2xl"
            style={{ border: '4px solid var(--color-card-bg)' }}
          />
          <div 
            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            }}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </motion.div>

        {/* Name and details */}
        <div className="text-center sm:text-left flex-1 mt-7">
          {/* Name - White on large screens, uses CSS variable on small screens */}
          <h1 className="text-3xl md:text-4xl font-alfa mb-8 text-[var(--color-text-primary)] lg:text-white">
                {user?.firstName} {user?.lastName}
          </h1>

          
          {/* Email */}
          <p className="font-archivo text-base mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            {user?.primaryEmailAddress?.emailAddress}
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'rgba(140, 82, 255, 0.1)' }}
            >
              <svg className="w-4 h-4" style={{ color: '#8c52ff' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-archivo font-semibold" style={{ color: '#8c52ff' }}>
                {t('dashboard.profile.joined')} {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            {user?.unsafeMetadata?.city && (
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'rgba(140, 82, 255, 0.1)' }}
              >
                <svg className="w-4 h-4" style={{ color: '#8c52ff' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-archivo font-semibold" style={{ color: '#8c52ff' }}>
                  {user?.unsafeMetadata?.city}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 justify-center lg:justify-end lg:mt-26">
        <motion.div 
          className="text-center px-6 py-4 rounded-xl min-w-[100px]"
          style={{ 
            backgroundColor: 'rgba(140, 82, 255, 0.05)',
            border: '2px solid rgba(140, 82, 255, 0.2)'
          }}
          whileHover={{ scale: 1.05, borderColor: 'rgba(140, 82, 255, 0.4)' }}
        >
          <div className="text-2xl font-alfa mb-1" style={{ color: '#8c52ff' }}>
            {pets.length}
          </div>
          <div className="text-sm font-archivo font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
            {pets.length === 1 ? t('dashboard.profile.pet') : t('dashboard.profile.pets')}
          </div>
        </motion.div>
        <motion.div 
          className="text-center px-6 py-4 rounded-xl min-w-[100px]"
          style={{ 
            backgroundColor: 'rgba(140, 82, 255, 0.05)',
            border: '2px solid rgba(140, 82, 255, 0.2)'
          }}
          whileHover={{ scale: 1.05, borderColor: 'rgba(140, 82, 255, 0.4)' }}
        >
          <div className="text-2xl font-alfa mb-1" style={{ color: '#8c52ff' }}>
            {history.length}
          </div>
          <div className="text-sm font-archivo font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
            {t('dashboard.profile.searches')}
          </div>
        </motion.div>
      </div>
    </div>
  </div>
</motion.div>



        {/* Tab Navigation */}
        <motion.div
          className="flex gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={() => setActiveTab('pets')}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-alfa text-lg transition-all"
            style={{
              backgroundColor: activeTab === 'pets' ? '#8c52ff' : 'var(--color-card-bg)',
              color: activeTab === 'pets' ? 'white' : 'var(--color-text-primary)',
              boxShadow: activeTab === 'pets' ? '0 8px 25px rgba(140, 82, 255, 0.4)' : 'none',
              border: activeTab === 'pets' ? 'none' : '2px solid var(--color-card-border)'
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
            {t('dashboard.tabs.pets')}
          </motion.button>

          <motion.button
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-alfa text-lg transition-all"
            style={{
              backgroundColor: activeTab === 'history' ? '#8c52ff' : 'var(--color-card-bg)',
              color: activeTab === 'history' ? 'white' : 'var(--color-text-primary)',
              boxShadow: activeTab === 'history' ? '0 8px 25px rgba(140, 82, 255, 0.4)' : 'none',
              border: activeTab === 'history' ? 'none' : '2px solid var(--color-card-border)'
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {t('dashboard.tabs.history')}
          </motion.button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'pets' && (
            <motion.div
              key="pets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {pets.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-alfa" style={{ color: 'var(--color-text-primary)' }}>
                      {t('dashboard.pets.title')}
                    </h2>
                    <motion.button
                      onClick={() => setIsAddPetModalOpen(true)}
                      className="px-6 py-3 rounded-xl font-alfa flex items-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #8c52ff 0%, #a78bfa 100%)',
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(140, 82, 255, 0.4)'
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      {t('dashboard.pets.addPet')}
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map((pet, index) => (
                      <motion.div
                        key={getItemId(pet)}
                        className="rounded-2xl overflow-hidden shadow-lg"
                        style={{
                          backgroundColor: 'var(--color-card-bg)',
                          border: '2px solid var(--color-card-border)'
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(140, 82, 255, 0.25)' }}
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={pet.image ?? pet.image_url}
                            alt={pet.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                            <h3 className="text-2xl font-alfa text-white">{pet.name}</h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="font-archivo mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            <span className="font-semibold">{t('dashboard.pets.petBreed')}:</span> {pet.breed}
                          </p>
                          <p className="font-archivo text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                            {t('dashboard.pets.addedOn')} {pet.addedOn}
                          </p>
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => handleViewPetDetails(pet)}
                              className="flex-1 px-4 py-3 rounded-xl font-archivo font-semibold"
                              style={{
                                background: 'linear-gradient(135deg, #8c52ff 0%, #a78bfa 100%)',
                                color: 'white'
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {t('dashboard.pets.viewDetails')}
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeletePet(getItemId(pet))}
                              className="px-4 py-3 rounded-xl font-archivo font-semibold"
                              style={{
                                backgroundColor: 'transparent',
                                color: '#ef4444',
                                border: '2px solid #ef4444'
                              }}
                              whileHover={{ scale: 1.05, backgroundColor: '#ef4444', color: 'white' }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <motion.div
                    className="rounded-3xl p-12 text-center"
                    style={{
                      backgroundColor: 'var(--color-card-bg)',
                      border: '2px solid var(--color-card-border)'
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="text-8xl mb-6">🐾</div>
                    <h3 className="text-3xl font-alfa mb-4" style={{ color: 'var(--color-text-primary)' }}>
                      {t('dashboard.pets.noPets')}
                    </h3>
                    <p className="text-lg font-archivo mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                      {t('dashboard.pets.noPetsDesc')}
                    </p>
                    <motion.button
                      onClick={() => setIsAddPetModalOpen(true)}
                      className="px-8 py-4 rounded-xl font-alfa text-lg"
                      style={{
                        background: 'linear-gradient(135deg, #8c52ff 0%, #a78bfa 100%)',
                        color: 'white',
                        boxShadow: '0 8px 25px rgba(140, 82, 255, 0.4)'
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t('dashboard.pets.addFirstPet')}
                    </motion.button>
                  </motion.div>

                  {/* Adoption Section */}
                  <motion.div
                    className="rounded-3xl p-8"
                    style={{
                      background: 'linear-gradient(135deg, rgba(140, 82, 255, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
                      border: '2px solid rgba(140, 82, 255, 0.3)'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-alfa mb-4" style={{ color: 'var(--color-text-primary)' }}>
                      {t('dashboard.pets.adoption.title')} 💜
                    </h3>
                    <p className="font-archivo text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                      {t('dashboard.pets.adoption.description')}
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      {adoptionLinks.map((link, index) => (
                        <motion.a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-6 rounded-2xl transition-all"
                          style={{
                            backgroundColor: 'var(--color-card-bg)',
                            border: '2px solid var(--color-card-border)'
                          }}
                          whileHover={{ scale: 1.05, y: -4, boxShadow: '0 12px 30px rgba(140, 82, 255, 0.2)' }}
                        >
                          <div className="text-4xl mb-3">{link.icon}</div>
                          <h4 className="font-alfa text-lg mb-2" style={{ color: '#8c52ff' }}>
                            {link.title}
                          </h4>
                          <p className="font-archivo text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {link.description}
                          </p>
                        </motion.a>
                      ))}
                    </div>
                    <motion.button
                      onClick={() => window.open('https://www.petfinder.com', '_blank')}
                      className="w-full px-6 py-4 rounded-xl font-alfa text-lg"
                      style={{
                        background: 'linear-gradient(135deg, #8c52ff 0%, #a78bfa 100%)',
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(140, 82, 255, 0.4)'
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('dashboard.pets.adoption.findPets')}
                    </motion.button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-alfa mb-6" style={{ color: 'var(--color-text-primary)' }}>
                {t('dashboard.history.title')}
              </h2>

              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <motion.div
                      key={getItemId(item)}
                      className="rounded-2xl p-6 shadow-lg"
                      style={{
                        backgroundColor: 'var(--color-card-bg)',
                        border: '2px solid var(--color-card-border)'
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(140, 82, 255, 0.2)' }}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={item.image ?? item.image_url}
                            alt={item.breed}
                            className="w-full h-full object-cover transition-transform hover:scale-110"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-alfa mb-2" style={{ color: 'var(--color-text-primary)' }}>
                            {item.breed}
                          </h3>
                          <div className="flex items-center gap-4 mb-2">
                            <span className="font-archivo" style={{ color: 'var(--color-text-secondary)' }}>
                              {t('dashboard.history.confidence')}:
                            </span>
                            <span className="font-alfa text-lg" style={{ color: '#8c52ff' }}>
                              {item.confidence}
                            </span>
                          </div>
                          <p className="font-archivo text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {t('dashboard.history.searchedOn')} {item.searchedOn}
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleRemoveHistory(getItemId(item))}
                          className="px-6 py-3 rounded-xl font-archivo font-semibold"
                          style={{
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            border: '2px solid #ef4444'
                          }}
                          whileHover={{ scale: 1.05, backgroundColor: '#ef4444', color: 'white' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {t('dashboard.history.remove')}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="rounded-3xl p-12 text-center"
                  style={{
                    backgroundColor: 'var(--color-card-bg)',
                    border: '2px solid var(--color-card-border)'
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-8xl mb-6">🔍</div>
                  <h3 className="text-3xl font-alfa mb-4" style={{ color: 'var(--color-text-primary)' }}>
                    {t('dashboard.history.noHistory')}
                  </h3>
                  <p className="text-lg font-archivo mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                    {t('dashboard.history.noHistoryDesc')}
                  </p>
                  <motion.button
                    onClick={() => navigate('/')}
                    className="px-8 py-4 rounded-xl font-alfa text-lg"
                    style={{
                      background: 'linear-gradient(135deg, #8c52ff 0%, #a78bfa 100%)',
                      color: 'white',
                      boxShadow: '0 8px 25px rgba(140, 82, 255, 0.4)'
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('dashboard.history.startSearch')}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
