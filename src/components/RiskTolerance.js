import React from 'react';

const RiskTolerance = ({ riskTolerance, onChange }) => {
  const riskLevels = [
    { value: 'low', label: 'Low Risk', color: '#10b981', description: 'Capital preservation' },
    { value: 'medium', label: 'Medium Risk', color: '#f59e0b', description: 'Balanced approach' },
    { value: 'high', label: 'High Risk', color: '#ef4444', description: 'Growth focused' }
  ];

  return (
    <div className="input-group">
      <label>Risk Tolerance</label>
      <div className="risk-levels">
        {riskLevels.map(level => (
          <div
            key={level.value}
            className={`risk-level-card ${riskTolerance === level.value ? 'selected' : ''}`}
            onClick={() => onChange(level.value)}
            style={{ borderColor: level.color }}
          >
            <div className="risk-level-header">
              <div className="risk-dot" style={{ backgroundColor: level.color }}></div>
              <span className="risk-label">{level.label}</span>
            </div>
            <p className="risk-description">{level.description}</p>
          </div>
        ))}
      </div>
      <div className="risk-explanation">
        <p><strong>Low Risk:</strong> Focus on stable returns, lower volatility</p>
        <p><strong>Medium Risk:</strong> Balance between growth and stability</p>
        <p><strong>High Risk:</strong> Maximize growth potential, accept higher volatility</p>
      </div>
    </div>
  );
};

export default RiskTolerance;
