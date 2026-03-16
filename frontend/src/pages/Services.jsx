import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const MAPPLS_MAP_SDK_KEY = import.meta.env.VITE_MAPPLS_MAP_SDK_KEY;

const Services = () => {
  const { t } = useTranslation();
  const { getToken, isSignedIn } = useAuth();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  const categories = [
    { id: 'vet', label: 'Veterinaries' },
    { id: 'pet_store', label: 'Pet Stores' },
    { id: 'food_store', label: 'Food Stores' },
    { id: 'shelter', label: 'Shelters' },
    { id: 'ngo', label: 'NGOs' },
  ];

  const helplines = [
    { name: 'People For Animals', number: '1800-102-1632', location: 'Pan India' },
    { name: 'Blue Cross of India', number: '044-2234-5959', location: 'Chennai' },
    { name: 'Animal Rahat', number: '020-2425-1710', location: 'Pune' },
    { name: 'SPCA Delhi', number: '011-2329-1151', location: 'Delhi NCR' },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          initializeMap(loc);
        },
        () => {
          const defaultLoc = { lat: 28.6139, lng: 77.2090 };
          setUserLocation(defaultLoc);
          initializeMap(defaultLoc);
        }
      );
    }
  }, []);

  const initializeMap = (location) => {
    if (mapInstanceRef.current) return;
    const script = document.createElement('script');
    script.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_MAP_SDK_KEY}/map_sdk?layer=vector&v=3.0`;
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        if (window.mappls?.Map) {
          const map = new window.mappls.Map(mapContainerRef.current, {
            center: [location.lat, location.lng],
            zoom: 13,
            zoomControl: true,
          });
          mapInstanceRef.current = map;
        }
      }, 500);
    };
    document.head.appendChild(script);
  };

  const fetchPlaces = async () => {
    if (!isSignedIn) { setError('Sign in to explore nearby services'); return; }
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/places/nearby?category=${selectedCategory}&lat=${userLocation.lat}&lon=${userLocation.lng}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.places) setPlaces(data.places);
      else setError(data.message || 'No places found');
    } catch { setError('Error fetching locations'); }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedCategory && userLocation && mapInstanceRef.current) fetchPlaces();
  }, [selectedCategory, userLocation]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pt-32 pb-24 px-6 relative overflow-hidden transition-colors duration-300">
      <div className="bg-blob blob-blue top-0 right-0 opacity-5"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 px-4">
           <span className="font-handwriting text-3xl text-[#30A7DB] mb-4 block">Neighborhood support</span>
           <h1 className="text-5xl md:text-7xl text-black dark:text-white mb-6">Nearby Services.</h1>
           <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">Find everything your dog needs within reach</p>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-4 mb-12 pb-4 scroll-smooth touch-pan-x select-none">
          <div className="flex flex-nowrap gap-4 mx-auto min-w-max px-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`pill-button px-8 py-4 font-bold uppercase tracking-widest text-xs transition-all whitespace-nowrap ${selectedCategory === cat.id ? 'bg-[#30A7DB] text-white shadow-xl' : 'bg-white dark:bg-white/5 text-black dark:text-white border-2 border-gray-100 dark:border-white/10 shadow-sm'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
           {/* Map */}
           <div className="lg:col-span-2 bento-card bg-white dark:bg-[#111111] border-gray-100 dark:border-white/10 border-2 overflow-hidden h-[600px] shadow-xl">
              <div ref={mapContainerRef} className="w-full h-full" />
           </div>

           {/* Places List */}
           <div className="lg:col-span-1 flex flex-col gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="wait">
                {selectedCategory ? (
                  loading ? (
                    <div className="h-full flex items-center justify-center bento-card border-gray-100 dark:border-white/10 border-2 bg-white dark:bg-[#111111]">
                       <div className="w-10 h-10 border-4 border-[#30A7DB] border-t-transparent animate-spin rounded-full"></div>
                    </div>
                  ) : places.length > 0 ? (
                    places.map((place, i) => (
                      <motion.div 
                        key={place.id} 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.05 }}
                        className="bento-card bg-white dark:bg-[#111111] border-gray-100 dark:border-white/10 border-2 p-8 hover:border-[#30A7DB] transition-all cursor-pointer group"
                      >
                         <h3 className="text-2xl font-extrabold text-black dark:text-white mb-2 group-hover:text-[#30A7DB] transition-colors">{place.name}</h3>
                         <p className="text-gray-400 dark:text-gray-500 font-medium text-sm mb-6">{place.address}</p>
                         <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#8c52ff]">{(place.distance / 1000).toFixed(1)} km away</span>
                            <button 
                              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`, '_blank')}
                              className="pill-button bg-[#111111] text-white text-[10px] px-6 py-3 font-bold uppercase tracking-[0.2em]"
                            >
                              Directions
                            </button>
                         </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bento-card border-dashed border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111]">
                       <p className="text-gray-300 dark:text-white/20 text-xl font-extrabold italic">No services found in this area.</p>
                    </div>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center bento-card border-dashed border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] p-12 text-center">
                     <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full mb-6 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-200 dark:text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     </div>
                     <p className="text-gray-300 dark:text-white/20 text-xl font-extrabold italic leading-relaxed">Select a category to explore nearby dog-friendly places.</p>
                  </div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Helplines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="md:col-span-2 lg:col-span-4 mb-4">
              <h2 className="text-3xl text-black dark:text-white font-extrabold px-4">Emergency Helplines</h2>
           </div>
           {helplines.map((h, i) => (
              <motion.div 
                key={h.number} 
                className="bento-card border-red-50 dark:border-white/10 border-2 bg-white dark:bg-[#111111] p-8 group hover:bg-red-500 hover:border-red-500 transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                 <h4 className="text-xl font-extrabold text-black dark:text-white mb-1 group-hover:text-white transition-colors">{h.name}</h4>
                 <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6 group-hover:text-red-100 transition-colors">{h.location}</p>
                 <a href={`tel:${h.number}`} className="pill-button bg-red-500 text-white w-full py-4 text-sm font-bold group-hover:bg-white group-hover:text-red-500 transition-colors flex items-center justify-center">Call Now</a>
              </motion.div>
           ))}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #30A7DB; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Services;
