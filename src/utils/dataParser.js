import Papa from 'papaparse';

export const parseCSVData = async (csvFile) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Clean and transform data
        const cleanedData = results.data.map(company => ({
          id: company.company_id,
          name: company['Company Name'] || 'Unknown',
          sector: company.Sector || 'Unknown',
          industry: company.Industry || 'Unknown',
          marketCap: company['Market Cap'] || 0,
          enterpriseValue: company['Ent. Value'] || 0,
          shares: company.Shares || 0,
          revenue: company.Revenue || 0,
          revenueGrowth: company['Rev. Growth'] || 0,
          grossProfit: company['Gross Profit'] || 0,
          netIncome: company['Net Income'] || 0,
          ebit: company.EBIT || 0,
          eps: company.EPS || 0,
          roic: company.ROIC || 0,
          roe: company.ROE || 0,
          roa: company.ROA || 0,
          profitMargin: company['Profit Margin'] || 0,
          currentPrice: company.Current || 0,
          priceTarget: company['Price Target'] || 0,
          ptUpside: company['PT Upside (%)'] || 0,
          beta: company['Beta (5Y)'] || 0,
          highRiskPred: company.high_risk_pred || 0,
          highRiskProba: company.high_risk_proba || 0,
          employees: company.Employees || 0,
          founded: company.Founded || 0,
          sharesOffered: company['Shares Offered'] || 0,
          operatingCF: company['Operating CF'] || 0,
          fcf: company.FCF || 0,
          totalCash: company['Total Cash'] || 0,
          totalDebt: company['Total Debt'] || 0,
          equity: company.Equity || 0,
          assets: company.Assets || 0,
          liabilities: company.Liabilities || 0
        })).filter(company => 
          company.name !== 'Unknown' && 
          company.sector !== 'Unknown' &&
          !isNaN(company.roic) &&
          company.currentPrice > 0
        );
        
        resolve(cleanedData);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const filterAndRankCompanies = (data, filters) => {
  const { sector, investmentAmount, riskTolerance } = filters;
  
  // Filter by sector if specified
  let filtered = sector === 'All' ? data : data.filter(company => company.sector === sector);
  
  // Calculate maximum number of shares user can buy
  filtered = filtered.map(company => {
    const maxShares = Math.floor(investmentAmount / company.currentPrice);
    const maxInvestment = maxShares * company.currentPrice;
    const maxInvestmentROIC = company.roic * maxInvestment;
    
    return {
      ...company,
      maxShares,
      maxInvestment,
      maxInvestmentROIC
    };
  });
  
  // Calculate risk-adjusted score
  filtered = filtered.map(company => {
    // Normalize ROIC (0-1)
    const maxROIC = Math.max(...filtered.map(c => c.roic));
    const minROIC = Math.min(...filtered.map(c => c.roic));
    const normalizedROIC = maxROIC === minROIC ? 0.5 : (company.roic - minROIC) / (maxROIC - minROIC);
    
    // Risk adjustment based on user preference
    let riskScore;
    if (riskTolerance === 'low') {
      // Penalize high risk more heavily
      riskScore = (1 - company.highRiskProba) * 0.7 + normalizedROIC * 0.3;
    } else if (riskTolerance === 'medium') {
      // Balanced approach
      riskScore = (1 - company.highRiskProba) * 0.5 + normalizedROIC * 0.5;
    } else {
      // Accept more risk for higher returns
      riskScore = (1 - company.highRiskProba) * 0.3 + normalizedROIC * 0.7;
    }
    
    // Final score considering both risk and ROIC-weighted investment potential
    const investmentWeight = Math.min(company.maxInvestment / investmentAmount, 1);
    const finalScore = riskScore * 0.6 + investmentWeight * 0.4;
    
    return {
      ...company,
      normalizedROIC,
      riskScore,
      finalScore,
      investmentWeight
    };
  });
  
  // Sort by final score (descending)
  filtered.sort((a, b) => b.finalScore - a.finalScore);
  
  return filtered;
};

export const calculatePortfolioMetrics = (companies, investmentAmount) => {
  if (companies.length === 0) return null;
  
  const topCompanies = companies.slice(0, Math.min(10, companies.length));
  
  // Calculate allocation
  const totalScore = topCompanies.reduce((sum, c) => sum + c.finalScore, 0);
  
  const portfolio = topCompanies.map(company => {
    const allocation = (company.finalScore / totalScore) * 100;
    const amount = (allocation / 100) * investmentAmount;
    const shares = Math.floor(amount / company.currentPrice);
    const actualInvestment = shares * company.currentPrice;
    
    return {
      ...company,
      allocation,
      amount,
      shares,
      actualInvestment
    };
  });
  
  // Calculate portfolio metrics
  const totalInvestment = portfolio.reduce((sum, c) => sum + c.actualInvestment, 0);
  const avgROIC = portfolio.reduce((sum, c) => sum + (c.roic * c.actualInvestment), 0) / totalInvestment;
  const avgRiskProba = portfolio.reduce((sum, c) => sum + (c.highRiskProba * c.actualInvestment), 0) / totalInvestment;
  const expectedReturn = avgROIC * totalInvestment;
  
  return {
    portfolio,
    metrics: {
      totalInvestment,
      avgROIC,
      avgRiskProba,
      expectedReturn,
      diversification: portfolio.length,
      cashRemaining: investmentAmount - totalInvestment
    }
  };
};

export const getSectors = (data) => {
  const sectors = [...new Set(data.map(company => company.sector))].sort();
  return ['All', ...sectors];
};
