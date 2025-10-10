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
    { id: 'vet', icon: '🏥', label: t('services.categories.vet') },
    { id: 'pet_store', icon: '🛒', label: t('services.categories.pet_store') },
    { id: 'food_store', icon: '🍖', label: t('services.categories.food_store') },
    { id: 'shelter', icon: '🏠', label: t('services.categories.shelter') },
    { id: 'ngo', icon: '🤝', label: t('services.categories.ngo') },
  ];

  // Pet Helpline Numbers (Professional)
  const helplines = [
    { name: 'People For Animals', number: '1800-102-1632', location: 'Pan India' },
    { name: 'Blue Cross of India', number: '044-2234-5959', location: 'Chennai' },
    { name: 'Animal Rahat', number: '020-2425-1710', location: 'Pune' },
    { name: 'SPCA Delhi', number: '011-2329-1151', location: 'Delhi NCR' },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(loc);
          initializeMap(loc);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(t('services.locationError'));
          const defaultLoc = { lat: 28.6139, lng: 77.2090 };
          setUserLocation(defaultLoc);
          initializeMap(defaultLoc);
        }
      );
    } else {
      setError(t('services.locationError'));
      const defaultLoc = { lat: 28.6139, lng: 77.2090 };
      setUserLocation(defaultLoc);
      initializeMap(defaultLoc);
    }
  }, []);

  const initializeMap = (location) => {
    if (mapInstanceRef.current) return;

    const script = document.createElement('script');
    script.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_MAP_SDK_KEY}/map_sdk?layer=vector&v=3.0`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setTimeout(() => {
        if (window.mappls && window.mappls.Map) {
          try {
            const map = new window.mappls.Map(mapContainerRef.current, {
              center: [location.lat, location.lng],
              zoom: 13,
              zoomControl: true,
              location: true
            });

            mapInstanceRef.current = map;

            if (window.mappls.Marker) {
              new window.mappls.Marker({
                map: map,
                position: [location.lat, location.lng],
                fitbounds: true
              });
            }
          } catch (err) {
            console.error('Map creation error:', err);
            setError('Failed to initialize map');
          }
        }
      }, 500);
    };

    script.onerror = () => {
      setError('Failed to load map library');
    };

    document.head.appendChild(script);
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      try {
        if (marker && marker.remove) {
          marker.remove();
        }
      } catch (err) {
        console.error('Error removing marker:', err);
      }
    });
    markersRef.current = [];
  };

  useEffect(() => {
    if (selectedCategory && userLocation && mapInstanceRef.current) {
      fetchPlaces();
    }
  }, [selectedCategory, userLocation]);

  const fetchPlaces = async () => {
    if (!isSignedIn) {
      setError('Please sign in to use this feature');
      return;
    }

    setLoading(true);
    setError('');
    clearMarkers();

    try {
      const token = await getToken();
      const url = `${API_URL}/api/places/nearby?category=${selectedCategory}&lat=${userLocation.lat}&lon=${userLocation.lng}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.error) {
        if (data.error === 'no_results') {
          setError(`😔 ${data.message}`);
        } else if (data.error === 'rate_limited') {
          setError(`⏰ ${data.message}`);
        } else if (data.error === 'authentication_failed') {
          setError('🔐 Authentication failed. Please refresh and try again.');
        } else {
          setError(data.message || 'Unable to fetch places. Please try again.');
        }
        setPlaces([]);
      } else {
        setPlaces(data.places || []);
        addMarkersToMap(data.places || []);
        
        if ((data.places || []).length > 0) {
          setError('');
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('❌ Network error. Please check your connection and try again.');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const addMarkersToMap = (places) => {
    if (!mapInstanceRef.current || !window.mappls || !window.mappls.Marker) {
      return;
    }

    places.forEach((place) => {
      if (place.latitude && place.longitude) {
        try {
          const marker = new window.mappls.Marker({
            map: mapInstanceRef.current,
            position: [place.latitude, place.longitude],
            title: place.name
          });

          markersRef.current.push(marker);
        } catch (err) {
          console.error('Error adding marker:', err);
        }
      }
    });
  };

  const PlaceCard = ({ place, index }) => (
    <motion.div
      id={`place-${place.id}`}
      className="p-5 rounded-xl border transition-all"
      style={{
        backgroundColor: 'var(--color-services-card-bg)',
        borderColor: 'var(--color-services-card-border)',
        boxShadow: 'var(--color-services-card-shadow)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.3
      }}
      whileHover={{ 
        boxShadow: 'var(--color-services-card-hover-shadow)',
        y: -3
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 
          className="text-lg flex-1 font-archivo"
          style={{ color: 'var(--color-services-title)' }}
        >
          {place.name}
        </h3>
        <span className="text-xl">📍</span>
      </div>

      <p 
        className="text-sm mb-3"
        style={{ color: 'var(--color-services-subtitle)' }}
      >
        {place.address}
      </p>

      <div className="flex items-center gap-2 text-sm mb-3 px-3 py-2 rounded-lg"
        style={{ 
          backgroundColor: 'rgba(140, 82, 255, 0.1)',
          color: '#8c52ff'
        }}
      >
        <span>🚗</span>
        <span className="font-semibold">{(place.distance / 1000).toFixed(2)} km away</span>
      </div>

      <button
        onClick={() => {
          const destination = place.eloc 
            ? `https://www.mappls.com/${place.eloc}`
            : `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
          window.open(destination, '_blank');
        }}
        className="w-full px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 hover:opacity-90"
        style={{
          backgroundColor: '#8c52ff',
          color: 'white'
        }}
      >
        <span>🧭</span>
        <span>{t('services.getDirections')}</span>
      </button>
    </motion.div>
  );

  return (
    <div 
      className="min-h-screen pt-28 pb-16"
      style={{ backgroundColor: 'var(--color-services-bg)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 
            className="text-4xl md:text-5xl font-alfa mb-4"
            style={{ color: 'var(--color-services-title)' }}
          >
            {t('services.title')}
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--color-services-subtitle)' }}
          >
            {t('services.subtitle')}
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-md"
              style={{
                backgroundColor: selectedCategory === cat.id 
                  ? 'var(--color-services-category-btn-active-bg)' 
                  : 'var(--color-services-category-btn-bg)',
                color: selectedCategory === cat.id 
                  ? 'var(--color-services-category-btn-active-text)' 
                  : 'var(--color-services-category-btn-text)',
                border: '2px solid var(--color-services-category-btn-border)'
              }}
              whileHover={{ 
                scale: 1.05,
                y: -4,
                boxShadow: '0 8px 20px rgba(140, 82, 255, 0.3)'
              }}
              whileTap={{ 
                scale: 0.95,
                y: 0
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17
              }}
            >
              <motion.span 
                className="text-lg"
                animate={selectedCategory === cat.id ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {cat.icon}
              </motion.span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-6 p-4 rounded-xl text-center"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div 
              ref={mapContainerRef}
              id="map-container"
              className="w-full h-[600px] rounded-xl border overflow-hidden"
              style={{
                backgroundColor: 'var(--color-services-card-bg)',
                borderColor: 'var(--color-services-card-border)',
                boxShadow: 'var(--color-services-card-shadow)'
              }}
            />
          </div>

          {/* Places List */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {!selectedCategory && (
                <motion.div 
                  key="select"
                  className="h-[600px] p-8 rounded-xl text-center flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-services-card-bg)',
                    borderColor: 'var(--color-services-card-border)',
                    border: '2px dashed'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-6xl mb-4">🐾</div>
                  <p 
                    className="text-lg"
                    style={{ color: 'var(--color-services-subtitle)' }}
                  >
                    {t('services.selectCategory')}
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  className="h-[600px] p-8 rounded-xl text-center flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-services-card-bg)'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4"></div>
                  <p style={{ color: 'var(--color-services-subtitle)' }}>
                    {t('services.loading')}
                  </p>
                </motion.div>
              )}

              {!loading && selectedCategory && (
                <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {places.length > 0 ? (
                    <div className="space-y-3">
                      {places.map((place, index) => (
                        <PlaceCard key={place.id} place={place} index={index} />
                      ))}
                    </div>
                  ) : !error && (
                    <motion.div 
                      className="h-full p-8 rounded-xl text-center flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: 'var(--color-services-card-bg)',
                        borderColor: 'var(--color-services-card-border)',
                        border: '1px solid'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-6xl mb-4">😔</div>
                      <p style={{ color: 'var(--color-services-subtitle)' }}>
                        {t('services.noResults')}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pet Helpline Section - Professional */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 
              className="text-3xl font-alfa mb-3"
              style={{ color: 'var(--color-services-title)' }}
            >
              Emergency Pet Helplines
            </h2>
            <p 
              className="text-base"
              style={{ color: 'var(--color-services-subtitle)' }}
            >
              24/7 emergency contacts for immediate pet care assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-center">
            {helplines.map((helpline, index) => (
              <motion.div
                key={helpline.number}
                className="p-6 rounded-xl border"
                style={{
                  backgroundColor: 'var(--color-services-card-bg)',
                  borderColor: 'var(--color-services-card-border)',
                  boxShadow: 'var(--color-services-card-shadow)'
                }}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.5 + index * 0.1,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  boxShadow: '0 12px 30px rgba(239, 68, 68, 0.2)'
                }}
              >
                <div className="mb-4">
                  <h3 
                    className="text-lg font-archivo mb-1"
                    style={{ color: 'var(--color-services-title)' }}
                  >
                    {helpline.name}
                  </h3>
                  <p 
                    className="text-xs"
                    style={{ color: 'var(--color-services-subtitle)' }}
                  >
                    {helpline.location}
                  </p>
                </div>
                
                <motion.a
                  href={`tel:${helpline.number}`}
                  className="block w-full px-4 py-3 rounded-lg text-center font-semibold transition-all"
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '15px'
                  }}
                  whileHover={{ 
                    backgroundColor: '#dc2626',
                    scale: 1.05
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {helpline.number}
                </motion.a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(140, 82, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8c52ff;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Services;










