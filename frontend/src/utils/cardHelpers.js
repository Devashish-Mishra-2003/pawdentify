// src/utils/cardHelpers.js

/**
 * Parse range string like "22.7-27.2 kg" into min, max, unit
 * @param {string} rangeString - Range in format "min-max unit"
 * @returns {object} { min, max, unit }
 */
export const parseRange = (rangeString) => {
  if (!rangeString || typeof rangeString !== 'string') {
    return { min: 0, max: 0, unit: '' };
  }

  // Match pattern: number-number unit
  const match = rangeString.match(/^([\d.]+)\s*-\s*([\d.]+)\s*(.*)$/);
  
  if (!match) {
    return { min: 0, max: 0, unit: '' };
  }

  return {
    min: parseFloat(match[1]),
    max: parseFloat(match[2]),
    unit: match[3].trim()
  };
};

/**
 * Map text rating to numeric value
 * @param {string} value - "Low", "Moderate", "High", etc.
 * @returns {number} Rating from 1-5
 */
export const mapToRating = (value) => {
  if (!value || typeof value !== 'string') return 3;

  const lowerValue = value.toLowerCase();

  // Map variations to ratings
  const ratingMap = {
    'low': 2,
    'minimal': 2,
    'rare': 2,
    'moderate': 3,
    'medium': 3,
    'good': 3,
    'high': 5,
    'excellent': 5,
    'very high': 5,
    'frequent': 5,
  };

  // Check for exact matches
  if (ratingMap[lowerValue]) {
    return ratingMap[lowerValue];
  }

  // Check for partial matches
  for (const [key, rating] of Object.entries(ratingMap)) {
    if (lowerValue.includes(key)) {
      return rating;
    }
  }

  // Default to 3 (moderate)
  return 3;
};

/**
 * Convert rating (1-5) to percentage
 * @param {number} rating - Rating value 1-5
 * @returns {number} Percentage 0-100
 */
export const ratingToPercentage = (rating) => {
  return (rating / 5) * 100;
};

/**
 * Get color for rating level
 * @param {number} rating - Rating value 1-5
 * @returns {string} CSS color variable or hex
 */
export const getRatingColor = (rating) => {
  if (rating <= 2) return '#ef4444'; // red
  if (rating === 3) return '#f59e0b'; // orange/yellow
  return '#22c55e'; // green
};

/**
 * Normalize a range position to percentage
 * @param {number} value - Value to normalize
 * @param {number} datasetMin - Minimum value in dataset
 * @param {number} datasetMax - Maximum value in dataset
 * @returns {number} Percentage 0-100
 */
export const normalizeRange = (value, datasetMin, datasetMax) => {
  if (datasetMax === datasetMin) return 50; // Avoid division by zero
  return ((value - datasetMin) / (datasetMax - datasetMin)) * 100;
};

/**
 * Scan all breeds to get min/max for a range field
 * @param {array} allBreeds - Array of all breed objects
 * @param {string} field - Field name like "weight_range" or "height_range"
 * @returns {object} { min, max }
 */
export const getDatasetMinMax = (allBreeds, field) => {
  if (!allBreeds || !Array.isArray(allBreeds) || allBreeds.length === 0) {
    return { min: 0, max: 100 };
  }

  let datasetMin = Infinity;
  let datasetMax = -Infinity;

  allBreeds.forEach(breed => {
    const physicalTraits = breed.physical_traits;
    if (!physicalTraits || !physicalTraits[field]) return;

    const range = parseRange(physicalTraits[field]);
    if (range.min < datasetMin) datasetMin = range.min;
    if (range.max > datasetMax) datasetMax = range.max;
  });

  // Fallback if no valid data found
  if (datasetMin === Infinity || datasetMax === -Infinity) {
    return { min: 0, max: 100 };
  }

  return { min: datasetMin, max: datasetMax };
};

/**
 * Check if a field should use RangeCard
 * @param {string} key - Field key
 * @returns {boolean}
 */
export const isRangeField = (key) => {
  return key.includes('range') || key.includes('_range');
};

/**
 * Check if a field should use RatingCard
 * @param {string} key - Field key
 * @returns {boolean}
 */
export const isRatingField = (key) => {
  const ratingFields = [
    'trainability',
    'energy_level',
    'barking_tendency',
    'good_with_kids',
    'good_with_pets',
    'apartment_friendliness',
    'grooming_needs',
    'shedding_characteristics',
    'drooling_tendency',
    'urban_adaptability',
    'rural_suitability',
  ];
  return ratingFields.includes(key);
};

/**
 * Check if a field should use IconCard
 * @param {string} key - Field key
 * @returns {boolean}
 */
export const isIconField = (key) => {
  const iconFields = [
    'grooming_needs',
    'shedding_characteristics',
    'drooling_tendency',
    'exercise_needs',
  ];
  return iconFields.includes(key);
};

/**
 * Get icon for a specific field
 * @param {string} key - Field key
 * @returns {string} Emoji icon
 */
export const getFieldIcon = (key) => {
  const iconMap = {
    'grooming_needs': '✂️',
    'shedding_characteristics': '🐕',
    'drooling_tendency': '💧',
    'exercise_needs': '🏃‍♂️',
    'barking_tendency': '🔊',
    'good_with_kids': '👶',
    'good_with_pets': '🐾',
    'trainability': '🎓',
    'energy_level': '⚡',
    'apartment_friendliness': '🏢',
  };
  return iconMap[key] || '📋';
};

/**
 * Format field key to readable title
 * @param {string} key - Field key with underscores
 * @returns {string} Formatted title
 */
export const formatFieldTitle = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
