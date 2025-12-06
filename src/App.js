import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import SectorSelector from './components/SectorSelector';
import InvestmentInput from './components/InvestmentInput';
import RiskTolerance from './components/RiskTolerance';
import CompanyList from './components/CompanyList';
import RevenueChart from './components/RevenueChart';
import { 
  parseCSVData, 
  filterAndRankCompanies, 
  calculatePortfolioMetrics, 
  getSectors 
} from './utils/dataParser';
import './styles/App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // User inputs
  const [sector, setSector] = useState('All');
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [riskTolerance, setRiskTolerance] = useState('medium');
  
  // Results
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState(null);
  const [sectors, setSectors] = useState(['All']);

  useEffect(() => {
    // Load CSV data
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/ranking_2025.csv');
        const csvText = await response.text();
        
        const parsedData = await parseCSVData(csvText);
        setData(parsedData);
        setSectors(getSectors(parsedData));
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please ensure the CSV file is available.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const filters = {
        sector,
        investmentAmount,
        riskTolerance
      };
      
      const filtered = filterAndRankCompanies(data, filters);
      setFilteredCompanies(filtered);
      
      const metrics = calculatePortfolioMetrics(filtered, investmentAmount);
      setPortfolioMetrics(metrics);
    }
  }, [data, sector, investmentAmount, riskTolerance]);

  const handleAnalyze = () => {
    // Analysis is done automatically on filter changes
    console.log('Analysis updated with current filters');
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">
          <h3>Error</h3>
          <p>{error}</p>
          <p>Please check if the CSV file exists in the public/data directory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Financial Investment Analyzer</h1>
        <p>Smart portfolio recommendations based on ROIC and risk analysis</p>
      </header>

      <main>
        <div className="input-section">
          <div className="input-grid">
            <SectorSelector 
              sectors={sectors}
              selectedSector={sector}
              onChange={setSector}
            />
            
            <InvestmentInput 
              investmentAmount={investmentAmount}
              onChange={setInvestmentAmount}
            />
            
            <RiskTolerance 
              riskTolerance={riskTolerance}
              onChange={setRiskTolerance}
            />
          </div>
          
          <button 
            className="submit-button"
            onClick={handleAnalyze}
          >
            Update Analysis
          </button>
        </div>

        {portfolioMetrics && (
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-value">${portfolioMetrics.metrics.totalInvestment.toLocaleString(0)}</div>
              <div className="stat-label">Portfolio Value</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{(portfolioMetrics.metrics.avgROIC * 100).toFixed(1)}%</div>
              <div className="stat-label">Average ROIC</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{portfolioMetrics.metrics.diversification}</div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{(portfolioMetrics.metrics.avgRiskProba * 100).toFixed(1)}%</div>
              <div className="stat-label">Avg Risk</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">${portfolioMetrics.metrics.expectedReturn.toLocaleString(0)}</div>
              <div className="stat-label">Expected Return</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">${portfolioMetrics.metrics.cashRemaining.toLocaleString(0)}</div>
              <div className="stat-label">Cash Remaining</div>
            </div>
          </div>
        )}

        <div className="results-section">
          <CompanyList 
            companies={filteredCompanies.slice(0, 10)}
            portfolioMetrics={portfolioMetrics?.metrics}
          />
          <RevenueChart 
            companies={filteredCompanies}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p className="disclaimer">
          <strong>Disclaimer:</strong> This tool is for educational purposes only. Investment decisions should be made 
          after consulting with financial advisors and conducting thorough research. Past performance is not indicative 
          of future results.
        </p>
        <p className="footer-note">
          Data Source: ranking_2025.csv | Analysis based on ROIC and risk probability metrics
        </p>
      </footer>
    </div>
  );
}

export default App;
