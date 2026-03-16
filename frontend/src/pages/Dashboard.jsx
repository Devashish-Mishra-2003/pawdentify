import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import AddPetModal from '../components/AddPetModal';
import PetDetailsModal from '../components/PetDetailsModal';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className={`fixed top-24 right-6 z-[100] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 text-white font-bold text-sm uppercase tracking-widest ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
      initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
    >
      {message}
    </motion.div>
  );
};

export default function Dashboard() {
  const { user, isLoaded } = useUser();
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
  const [toast, setToast] = useState(null);

  const getItemId = (item) => item._id || item.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !user) return;
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const [petsRes, historyRes] = await Promise.all([
          fetch(`${API_URL}/api/pets`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/history`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (petsRes.ok) setPets(await petsRes.json());
        if (historyRes.ok) setHistory(await historyRes.json());
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, [isLoaded, user, getToken]);

  const handleSavePet = async (petData) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('name', petData.name);
      formData.append('breed', petData.breed);
      formData.append('birthday', petData.birthday);
      formData.append('image', petData.image);

      const res = await fetch(`${API_URL}/api/pets`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (res.ok) {
        const newPet = await res.json();
        setPets(prev => [...prev, newPet]);
        setIsAddPetModalOpen(false);
        setToast({ message: 'Pet added successfully', type: 'success' });
      }
    } catch (e) { setToast({ message: 'Failed to add pet', type: 'error' }); }
  };

  const handleViewPetDetails = (pet) => { setSelectedPet(pet); setIsPetDetailsModalOpen(true); };

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to remove this pet?')) {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/pets/${petId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          setPets(pets.filter(p => getItemId(p) !== petId));
          setIsPetDetailsModalOpen(false);
          setToast({ message: 'Pet removed', type: 'success' });
        }
      } catch (e) { setToast({ message: 'Error removing pet', type: 'error' }); }
    }
  };

  const handleAddNote = async (petId, text, category) => {
    try {
      const token = await getToken();
      const body = new URLSearchParams();
      body.append('text', text);
      body.append('category', category);

      const res = await fetch(`${API_URL}/api/pets/${petId}/notes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}` 
        },
        body: body
      });
      
      if (res.ok) {
        const result = await res.json();
        // If the backend returns a single note or an updated pet, we handle it safely
        setPets(prevPets => prevPets.map(p => {
          if (getItemId(p) === petId) {
            // If result is the updated pet object (has name field), use it
            if (result.name) return result;
            // If result is just a note (no name field), append it to existing notes
            return { ...p, notes: [...(p.notes || []), result] };
          }
          return p;
        }));
        
        // Update selection to reflect changes in modal
        setSelectedPet(prev => {
          if (!prev || getItemId(prev) !== petId) return prev;
          if (result.name) return result;
          return { ...prev, notes: [...(prev.notes || []), result] };
        });
        
        setToast({ message: 'Note added', type: 'success' });
      }
    } catch (e) { setToast({ message: 'Error adding note', type: 'error' }); }
  };

  const handleDeleteNote = async (petId, noteId) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/pets/${petId}/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const result = await res.json();
        setPets(prevPets => prevPets.map(p => {
          if (getItemId(p) === petId) {
            // If backend returns updated pet, use it
            if (result.name) return result;
            // Otherwise, filter locally
            return { ...p, notes: (p.notes || []).filter(n => n.id !== noteId) };
          }
          return p;
        }));

        setSelectedPet(prev => {
          if (!prev || getItemId(prev) !== petId) return prev;
          if (result.name) return result;
          return { ...prev, notes: (prev.notes || []).filter(n => n.id !== noteId) };
        });

        setToast({ message: 'Note removed', type: 'success' });
      }
    } catch (e) { setToast({ message: 'Error removing note', type: 'error' }); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505] pt-24">
       <div className="w-16 h-16 border-4 border-[#30A7DB] border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pt-40 pb-24 px-6 relative overflow-hidden transition-colors duration-300">
      <div className="bg-blob blob-purple top-0 right-0 opacity-5"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20 px-4">
           <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
              <div className="relative">
                 <img src={user?.imageUrl} className="w-48 h-48 rounded-[40px] shadow-2xl border-8 border-white dark:border-white/10 object-cover" />
                 <div className="absolute -bottom-2 -right-2 bg-green-400 w-12 h-12 rounded-full border-4 border-white dark:border-[#050505] shadow-lg"></div>
              </div>
              <div>
                 <h1 className="text-5xl md:text-7xl text-black dark:text-white font-black tracking-tighter leading-none mb-6">{user?.firstName} {user?.lastName}</h1>
                 <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-10">{user?.primaryEmailAddress?.emailAddress}</p>
                 <div className="flex gap-4">
                    <div className="bento-card border-gray-100 dark:border-white/10 border-2 bg-white dark:bg-[#111111] px-8 py-3">
                       <span className="text-3xl font-black text-[#30A7DB]">{pets.length}</span>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-3">Pets Registered</span>
                    </div>
                    <div className="bento-card border-gray-100 dark:border-white/10 border-2 bg-white dark:bg-[#111111] px-8 py-3">
                       <span className="text-3xl font-black text-[#8c52ff]">{history.length}</span>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-3">Breeds Identified</span>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col gap-4">
              <button 
                onClick={() => setActiveTab('pets')}
                className={`pill-button px-14 py-6 font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'pets' ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xl -translate-y-1' : 'bg-white dark:bg-white/5 text-black dark:text-gray-300 border-2 border-gray-100 dark:border-white/10 shadow-sm'}`}
              >
                Guardian Gallery
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`pill-button px-14 py-6 font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'history' ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xl -translate-y-1' : 'bg-white dark:bg-white/5 text-black dark:text-gray-300 border-2 border-gray-100 dark:border-white/10 shadow-sm'}`}
              >
                Search Log
              </button>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'pets' ? (
            <motion.div key="pets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
               <div className="flex justify-between items-end mb-12 px-4 border-b border-gray-100 dark:border-white/10 pb-8">
                  <div>
                     <span className="font-handwriting text-3xl text-[#7D64A3] dark:text-[#A892D1] mb-2 block">Your family</span>
                     <h2 className="text-5xl text-black dark:text-white font-black tracking-tighter uppercase">My Pets.</h2>
                  </div>
                  <button onClick={() => setIsAddPetModalOpen(true)} className="pill-button bg-[#8c52ff] text-white py-5 px-10 font-bold uppercase tracking-widest text-xs shadow-xl hover:-translate-y-1 transition-transform">
                    Register Pet
                  </button>
               </div>
               
               {pets.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                   {pets.map((pet, i) => (
                     <motion.div key={getItemId(pet)} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bento-card bg-white dark:bg-[#111111] border-gray-100 dark:border-white/10 border-2 p-10 hover:border-black dark:hover:border-white transition-all group flex flex-col items-center">
                        <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-gray-50 dark:border-white/10 mb-8 p-1">
                           <img src={pet.image_url || pet.image} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-center w-full">
                           <h3 className="text-3xl text-black dark:text-white font-black mb-1">{pet.name}</h3>
                           <p className="text-[#30A7DB] font-bold text-xs uppercase tracking-[0.2em] mb-8">{pet.breed}</p>
                           <button onClick={() => handleViewPetDetails(pet)} className="pill-button bg-gray-50 dark:bg-white/5 text-black dark:text-white w-full py-5 font-bold uppercase tracking-widest text-xs border border-gray-100 dark:border-white/10 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
                             Deep Insight
                           </button>
                        </div>
                     </motion.div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-32 bento-card border-dashed border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] shadow-inner">
                    <h3 className="text-4xl font-black text-gray-200 dark:text-white/10 uppercase tracking-tighter mb-8 italic">No Guardians Registered.</h3>
                    <button onClick={() => setIsAddPetModalOpen(true)} className="pill-button bg-black dark:bg-white text-white dark:text-black py-6 px-16 font-bold uppercase tracking-[0.2em] shadow-2xl">Start Your Legacy</button>
                 </div>
               )}
            </motion.div>
          ) : (
            <motion.div key="history" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
               <div className="mb-12 px-4 border-b border-gray-100 dark:border-white/10 pb-8">
                  <span className="font-handwriting text-3xl text-[#30A7DB] mb-2 block">Journey history</span>
                  <h2 className="text-5xl text-black dark:text-white font-black tracking-tighter uppercase">Identified.</h2>
               </div>
               <div className="grid grid-cols-1 gap-6">
                 {history.map((item, i) => (
                   <motion.div 
                     key={getItemId(item)} 
                     initial={{ opacity: 0, x: -20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     transition={{ delay: i * 0.05 }}
                     className="bento-card bg-white dark:bg-[#111111] border-gray-100 dark:border-white/10 border-2 p-8 flex flex-col md:flex-row items-center gap-12 group hover:border-black dark:hover:border-white transition-all"
                   >
                      <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 shadow-xl border-4 border-gray-50 dark:border-white/10 group-hover:scale-110 transition-transform p-1">
                         <img src={item.image_url || item.image} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                         <h3 className="text-4xl text-black dark:text-white font-black mb-2 tracking-tighter leading-none">{item.breed}</h3>
                         <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 dark:text-gray-600">{item.searchedOn}</span>
                            <div className="h-4 w-px bg-gray-100 dark:bg-white/10 hidden md:block"></div>
                            <span className="text-[10px] font-black text-[#8c52ff] uppercase tracking-[0.3em]">{item.confidence} Accuracy</span>
                         </div>
                      </div>
                      <button onClick={() => navigate('/search-breed')} className="pill-button bg-white dark:bg-white/5 text-black dark:text-white py-4 px-10 text-xs font-bold uppercase tracking-widest border-2 border-gray-50 dark:border-white/10 hover:border-black dark:hover:border-white transition-all shadow-sm">
                        Research
                      </button>
                   </motion.div>
                 ))}
               </div>
               {!history.length && (
                 <div className="text-center py-32 bento-card border-dashed border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] shadow-inner">
                    <h3 className="text-4xl font-black text-gray-200 dark:text-white/10 uppercase tracking-tighter mb-8 italic">No Journey Recorded.</h3>
                    <button onClick={() => navigate('/')} className="pill-button bg-black dark:bg-white text-white dark:text-black py-6 px-16 font-bold uppercase tracking-[0.2em] shadow-2xl">Begin Identification</button>
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddPetModal isOpen={isAddPetModalOpen} onClose={() => setIsAddPetModalOpen(false)} onSave={handleSavePet} />
      <PetDetailsModal 
        isOpen={isPetDetailsModalOpen} 
        onClose={() => setIsPetDetailsModalOpen(false)} 
        pet={selectedPet} 
        onDelete={() => selectedPet && handleDeletePet(getItemId(selectedPet))}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />

      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
    </div>
  );
}
