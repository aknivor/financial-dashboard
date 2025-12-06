import React from 'react';

const SectorSelector = ({ sectors, selectedSector, onChange }) => {
  return (
    <div className="input-group">
      <label htmlFor="sector-select">Select Sector</label>
      <select
        id="sector-select"
        className="select-input"
        value={selectedSector}
        onChange={(e) => onChange(e.target.value)}
      >
        {sectors.map(sector => (
          <option key={sector} value={sector}>
            {sector}
          </option>
        ))}
      </select>
      <p className="info-text">Choose the industry sector you're interested in investing</p>
    </div>
  );
};

export default SectorSelector;
