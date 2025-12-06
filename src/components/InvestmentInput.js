import React, { useState } from 'react';

const InvestmentInput = ({ investmentAmount, onChange }) => {
  const [localAmount, setLocalAmount] = useState(investmentAmount);

  const handleChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setLocalAmount(value);
    onChange(value);
  };

  const presets = [10000, 50000, 100000, 250000, 500000];

  return (
    <div className="input-group">
      <label htmlFor="investment-amount">Investment Amount ($)</label>
      <input
        id="investment-amount"
        type="number"
        className="number-input"
        value={localAmount}
        onChange={handleChange}
        min="1000"
        step="1000"
      />
      <div className="preset-buttons">
        <p>Quick select:</p>
        {presets.map(preset => (
          <button
            key={preset}
            type="button"
            className="preset-button"
            onClick={() => {
              setLocalAmount(preset);
              onChange(preset);
            }}
          >
            ${preset.toLocaleString()}
          </button>
        ))}
      </div>
      <p className="info-text">Enter the amount you're willing to invest</p>
    </div>
  );
};

export default InvestmentInput;
