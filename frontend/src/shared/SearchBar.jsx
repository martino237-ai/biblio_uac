import React from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Rechercher...' }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="input-search" />
      <button className="btn outline btn-enhanced" onClick={() => onChange('')}>{t('Clear')}</button>
    </div>
  );
}
