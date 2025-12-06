import React from 'react';

const CompanyList = ({ companies, portfolioMetrics }) => {
  const getRiskLevel = (probability) => {
    if (probability < 0.3) return 'low';
    if (probability < 0.7) return 'medium';
    return 'high';
  };

  const getRiskColor = (probability) => {
    if (probability < 0.3) return '#10b981';
    if (probability < 0.7) return '#f59e0b';
    return '#ef4444';
  };

  if (!companies || companies.length === 0) {
    return (
      <div className="company-list-container">
        <h3 className="section-title">Recommended Companies</h3>
        <div className="empty-state">
          <p>No companies found matching your criteria.</p>
          <p>Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-list-container">
      <div className="section-header">
        <h3 className="section-title">Recommended Companies</h3>
        {portfolioMetrics && (
          <div className="portfolio-summary">
            <span>Portfolio Value: ${portfolioMetrics.totalInvestment.toLocaleString()}</span>
            <span>Expected Annual Return: ${portfolioMetrics.expectedReturn.toLocaleString(0)}</span>
            <span>Avg Risk: {(portfolioMetrics.avgRiskProba * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      <div className="company-list">
        {companies.map((company, index) => (
          <div 
            key={company.id} 
            className={`company-card ${getRiskLevel(company.highRiskProba)}`}
          >
            <div className="company-header">
              <div>
                <span className="company-rank">#{index + 1}</span>
                <h4 className="company-name">{company.name}</h4>
              </div>
              <div className="company-metrics">
                <span 
                  className="risk-indicator"
                  style={{ backgroundColor: getRiskColor(company.highRiskProba) }}
                >
                  Risk: {(company.highRiskProba * 100).toFixed(1)}%
                </span>
                <span className="score-badge">Score: {company.finalScore.toFixed(3)}</span>
              </div>
            </div>
            
            <div className="company-details-grid">
              <div className="detail-row">
                <span className="detail-label">Industry:</span>
                <span>{company.industry}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Current Price:</span>
                <span>${company.currentPrice.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">ROIC:</span>
                <span className={company.roic > 0 ? 'positive' : 'negative'}>
                  {(company.roic * 100).toFixed(1)}%
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Market Cap:</span>
                <span>${(company.marketCap / 1000000).toFixed(1)}M</span>
              </div>
              {company.maxShares > 0 && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Max Shares:</span>
                    <span>{company.maxShares.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Max Investment:</span>
                    <span>${company.maxInvestment.toLocaleString(0)}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="company-performance">
              <div className="performance-bar">
                <div 
                  className="roic-bar"
                  style={{ width: `${Math.min(Math.abs(company.roic) * 500, 100)}%` }}
                >
                  ROIC: {(company.roic * 100).toFixed(1)}%
                </div>
              </div>
              <div className="additional-metrics">
                <span>Revenue: ${(company.revenue / 1000000).toFixed(1)}M</span>
                <span>Profit Margin: {(company.profitMargin * 100).toFixed(1)}%</span>
                <span>Beta: {company.beta?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;
