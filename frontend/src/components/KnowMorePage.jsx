import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const KnowMorePage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { knowMoreData, breedEntry } = location.state || {};
  const [expandedSections, setExpandedSections] = useState({});

  if (!knowMoreData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--color-knowmore-no-data-text)" }}>
          {t('knowMore.noData')}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="ml-4 px-4 py-2 rounded"
          style={{
            backgroundColor: "var(--color-knowmore-back-btn-bg)",
            color: "var(--color-knowmore-back-btn-text)",
          }}
        >
          {t('knowMore.back')}
        </button>
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

            if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
              const subEntries = Object.entries(v);
              const allPrimitives = subEntries.length > 0 && subEntries.every(([, subV]) =>
                (typeof subV === 'string' || typeof subV === 'number' || typeof subV === 'boolean')
              );

              if (allPrimitives) {
                return (
                  <div
                    key={k}
                    className="shadow-lg rounded-xl p-6 hover:transform hover:scale-105 transition-transform duration-300 overflow-hidden"
                    style={{
                      backgroundColor: "var(--color-knowmore-card-bg)",
                      boxShadow: "var(--color-knowmore-card-shadow)",
                    }}
                  >
                    <h3 className="text-xl mb-3 mt-2" style={{ color: "var(--color-knowmore-card-title)" }}>
                      {k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                      {subEntries.map(([subK, subV]) => (
                        <li key={subK} style={{ color: "var(--color-knowmore-text)" }}>
                          <span className="font-semibold">{subK.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</span>{' '}
                          <span style={{ color: "var(--color-knowmore-text-dark)" }}>{renderAny(subV)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
            }

            if (typeof v === 'string' && (v.includes(';') || v.includes('\n'))) {
              const lines = splitIntoLines(v);
              if (lines.length > 1) {
                return (
                  <div
                    key={k}
                    className="shadow-lg rounded-xl p-6 hover:transform hover:scale-105 transition-transform duration-300 overflow-hidden"
                    style={{
                      backgroundColor: "var(--color-knowmore-card-bg)",
                      boxShadow: "var(--color-knowmore-card-shadow)",
                    }}
                  >
                    <h3 className="text-xl mb-3 mt-2" style={{ color: "var(--color-knowmore-card-title)" }}>
                      {k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                      {lines.map((ln, i) => (
                        <li key={i} style={{ color: "var(--color-knowmore-text)" }}>{ln}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
            }

            return (
              <div
                key={k}
                className="shadow-lg rounded-xl p-6 hover:transform hover:scale-105 transition-transform duration-300 overflow-hidden"
                style={{
                  backgroundColor: "var(--color-knowmore-card-bg)",
                  boxShadow: "var(--color-knowmore-card-shadow)",
                }}
              >
                <h3 className="text-xl mb-2 mt-4" style={{ color: "var(--color-knowmore-card-title)" }}>
                  {k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </h3>

                {typeof v === 'string' ? (
                  <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                    <li style={{ color: "var(--color-knowmore-text)" }}>{v}</li>
                  </ul>
                ) : Array.isArray(v) ? (
                  <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                    {v.map((item, idx) => (
                      <li key={idx} style={{ color: "var(--color-knowmore-text)" }}>
                        {typeof item === 'string' ? item : renderAny(item)}
                      </li>
                    ))}
                  </ul>
                ) : (typeof v === 'object' && v !== null) ? (
                  <div className="pl-6">
                    {Object.entries(v).map(([subK, subV]) => (
                      <div key={subK} className="mb-4">
                        <h4 className="text-lg font-semibold mb-1" style={{ color: "var(--color-knowmore-subtitle)" }}>
                          {subK.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </h4>
                        {typeof subV === 'string' ? (
                          <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                            <li style={{ color: "var(--color-knowmore-text)" }}>{subV}</li>
                          </ul>
                        ) : Array.isArray(subV) ? (
                          <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
                            {subV.map((item, idx) => (
                              <li key={idx} style={{ color: "var(--color-knowmore-text)" }}>
                                {typeof item === 'string' ? item : renderAny(item)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <pre className="whitespace-pre-wrap" style={{ color: "var(--color-knowmore-text)" }}>
                            {renderAny(subV)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--color-knowmore-text)" }}>
                    {t('knowMore.noDetails')}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      );
    } else {
      return Object.entries(obj).map(([k, v]) => (
        <div key={k} className="pl-6 mb-4">
          <h4 className="text-lg font-semibold mb-1" style={{ color: "var(--color-knowmore-subtitle)" }}>
            {k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </h4>
          {typeof v === 'string' ? (
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
              <li style={{ color: "var(--color-knowmore-text)" }}>{v}</li>
            </ul>
          ) : Array.isArray(v) ? (
            <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
              {v.map((item, idx) => (
                <li key={idx} style={{ color: "var(--color-knowmore-text)" }}>
                  {typeof item === 'string' ? item : renderAny(item)}
                </li>
              ))}
            </ul>
          ) : (
            <pre className="whitespace-pre-wrap" style={{ color: "var(--color-knowmore-text)" }}>
              {renderAny(v)}
            </pre>
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
          <p className="leading-relaxed break-words text-base md:text-lg" style={{ color: "var(--color-knowmore-text)" }}>
            {displayText}
          </p>
          {isLong && (
            <button
              onClick={() => toggleExpanded(key)}
              className="font-semibold mt-2"
              style={{
                color: "var(--color-knowmore-read-more)",
              }}
            >
              {expandedSections[key] ? t('knowMore.readLess') : t('knowMore.readMore')}
            </button>
          )}
        </div>
      );
    }
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside space-y-2 text-base md:text-lg break-words">
          {value.map((item, idx) => (
            <li key={idx} style={{ color: "var(--color-knowmore-text)" }}>
              {typeof item === 'string' ? item : renderAny(item)}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return renderObject(value);
    }
    return (
      <p className="leading-relaxed break-words text-base md:text-lg" style={{ color: "var(--color-knowmore-text)" }}>
        {renderAny(value)}
      </p>
    );
  };

  return (
    <div className="min-h-screen pt-28 py-20 px-6" style={{ backgroundColor: "var(--color-knowmore-bg)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-alfa mb-4" style={{ color: "var(--color-knowmore-title)" }}>
            {t('knowMore.title')} {breedEntry?.breed || breedEntry?.name || t('knowMore.defaultBreed')}
          </h1>
        </div>

        {Object.entries(knowMoreData).map(([sectionKey, sectionValue]) => (
          <div
            key={sectionKey}
            className="max-w-6xl mx-auto w-full shadow-md rounded-xl p-8 mb-10 overflow-hidden"
            style={{
              backgroundColor: "var(--color-knowmore-section-bg)",
              boxShadow: "var(--color-knowmore-section-shadow)",
            }}
          >
            <h2
              className="text-2xl mb-4 border-b pb-2"
              style={{
                color: "var(--color-knowmore-section-title)",
                borderColor: "var(--color-knowmore-section-border)",
              }}
            >
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





