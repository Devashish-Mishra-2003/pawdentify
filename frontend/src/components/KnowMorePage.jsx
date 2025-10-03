import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const KnowMorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { knowMoreData, breedEntry } = location.state || {};
  const [expandedSections, setExpandedSections] = useState({});

  if (!knowMoreData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No data available. Please go back and select a breed.</p>
        <button onClick={() => navigate(-1)} className="ml-4 bg-purple-600 text-white px-4 py-2 rounded">Back</button>
      </div>
    );
  }

  const toggleExpanded = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderAny = (val) => {
    if (typeof val === 'string') return val;
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (Array.isArray(val)) return val.map(item => renderAny(item)).join(', ');
    if (typeof val === 'object' && val !== null) {
      return Object.entries(val)
        .map(([k, v]) => `${k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: ${renderAny(v)}`)
        .join('; ');
    }
    return String(val);
  };

  const splitIntoLines = (text) => {
    if (!text) return [];
    // split on semicolon or newline, keep order, trim
    return text
      .split(/\n|;/)
      .map(s => s.trim())
      .filter(Boolean);
  };

  const isEmptyValue = (val) => {
    if (val === null || val === undefined) return true;
    if (typeof val === 'string') return val.trim() === '';
    if (Array.isArray(val)) return val.length === 0 || val.every(isEmptyValue);
    if (typeof val === 'object') return Object.keys(val).length === 0 || Object.values(val).every(isEmptyValue);
    return false;
  };

  const renderObject = (obj, level = 0) => {
    if (level === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: '1000px' }}>
          {Object.entries(obj).map(([k, v]) => {
            if (isEmptyValue(v)) return null;

            // If v is a plain object whose immediate children are all primitives,
            // render them as separate bullet lines so each key starts on a new line.
            if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
              const subEntries = Object.entries(v);
              const allPrimitives = subEntries.length > 0 && subEntries.every(([, subV]) =>
                (typeof subV === 'string' || typeof subV === 'number' || typeof subV === 'boolean')
              );

              if (allPrimitives) {
                return (
                  <div key={k} className="bg-white shadow-lg rounded-xl p-6 hover:transform hover:scale-105 transition-transform duration-300 overflow-hidden">
                    <h3 className="text-xl font-semibold text-purple-600 mb-3 mt-2">
                      {k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                      {subEntries.map(([subK, subV]) => (
                        <li key={subK} className="text-gray-700">
                          <span className="font-semibold">{subK.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</span>{' '}
                          <span className="text-gray-800">{renderAny(subV)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
            }

            // NEW: if v is a string that actually contains multiple key/value pieces joined by `;` or newline,
            // split it and render each piece as its own bullet.
            if (typeof v === 'string' && (v.includes(';') || v.includes('\n'))) {
              const lines = splitIntoLines(v);
              if (lines.length > 1) {
                return (
                  <div key={k} className="bg-white shadow-lg rounded-xl p-6 hover:transform hover:scale-105 transition-transform duration-300 overflow-hidden">
                    <h3 className="text-xl font-semibold text-purple-600 mb-3 mt-2">
                      {k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                      {lines.map((ln, i) => (
                        <li key={i} className="text-gray-700">{ln}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
            }

            // Fallback: existing behavior (strings, arrays, or complex nested objects)
            return (
              <div key={k} className="bg-white shadow-lg rounded-xl p-6 hover:transform hover:scale-105 transition-transform duration-300 overflow-hidden">
                <h3 className="text-xl font-semibold text-purple-600 mb-2 mt-4">
                  {k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </h3>

                {typeof v === 'string' ? (
                  <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                    <li className="text-gray-700">{v}</li>
                  </ul>
                ) : Array.isArray(v) ? (
                  <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                    {v.map((item, idx) => (
                      <li key={idx} className="text-gray-700">{typeof item === 'string' ? item : renderAny(item)}</li>
                    ))}
                  </ul>
                ) : (typeof v === 'object' && v !== null) ? (
                  <div className="pl-6">
                    {Object.entries(v).map(([subK, subV]) => (
                      <div key={subK} className="mb-4">
                        <h4 className="text-lg font-semibold text-black mb-1">
                          {subK.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </h4>
                        {typeof subV === 'string' ? (
                          <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                            <li className="text-gray-700">{subV}</li>
                          </ul>
                        ) : Array.isArray(subV) ? (
                          <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                            {subV.map((item, idx) => (
                              <li key={idx} className="text-gray-700">{typeof item === 'string' ? item : renderAny(item)}</li>
                            ))}
                          </ul>
                        ) : (
                          <pre className="whitespace-pre-wrap text-gray-700">{renderAny(subV)}</pre>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">No details available.</p>
                )}
              </div>
            );
          })}
        </div>
      );
    } else {
      // Nested levels: render as indented bullet points without cards
      return Object.entries(obj).map(([k, v]) => (
        <div key={k} className="pl-6 mb-4">
          <h4 className="text-lg font-semibold text-black mb-1">
            {k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </h4>
          {typeof v === 'string' ? (
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
              <li className="text-gray-700">{v}</li>
            </ul>
          ) : Array.isArray(v) ? (
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
              {v.map((item, idx) => (
                <li key={idx} className="text-gray-700">{typeof item === 'string' ? item : renderAny(item)}</li>
              ))}
            </ul>
          ) : (
            <pre className="whitespace-pre-wrap text-gray-700">{renderAny(v)}</pre>
          )}
        </div>
      ));
    }
  };

  const renderValue = (value, key, level = 0) => {
    if (typeof value === 'string') {
      const isLong = value.length > 300;
      const displayText = isLong && !expandedSections[key] ? value.substring(0, 300) + '...' : value;
      return (
        <div>
          <p className="leading-relaxed break-words text-base md:text-lg text-gray-700">{displayText}</p>
          {isLong && (
            <button
              onClick={() => toggleExpanded(key)}
              className="text-purple-600 hover:text-purple-800 font-semibold mt-2"
            >
              {expandedSections[key] ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
      );
    }
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
          {value.map((item, idx) => (
            <li key={idx} className="text-gray-700">{typeof item === 'string' ? item : renderAny(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return renderObject(value);
    }
    return <p className="leading-relaxed break-words text-base md:text-lg text-gray-700">{renderAny(value)}</p>;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-archivo font-bold text-purple-700 mb-4">
            Know More: {breedEntry?.breed || breedEntry?.name || 'Breed'}
          </h1>
          {/* Back button removed (navigation handled in header) */}
        </div>

        {Object.entries(knowMoreData).map(([sectionKey, sectionValue]) => (
          <div key={sectionKey} className="max-w-6xl mx-auto w-full bg-white shadow-md rounded-xl p-8 mb-10 overflow-hidden">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 border-b pb-2">
              {sectionKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </h2>
            {renderValue(sectionValue, sectionKey)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowMorePage;




