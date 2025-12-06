import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ companies }) => {
  const [chartType, setChartType] = useState('revenue');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (companies && companies.length > 0) {
      const data = companies.slice(0, 10).map(company => ({
        name: company.name.substring(0, 20) + (company.name.length > 20 ? '...' : ''),
        revenue: company.revenue / 1000000, // Convert to millions
        netIncome: company.netIncome / 1000000,
        roic: company.roic * 100, // Convert to percentage
        riskProbability: company.highRiskProba * 100,
        marketCap: company.marketCap / 1000000,
        currentPrice: company.currentPrice
      }));
      setChartData(data);
    }
  }, [companies]);

  if (!companies || companies.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="section-title">Financial Analysis</h3>
        <div className="empty-chart">
          <p>Select filters to see financial visualizations</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toFixed(2)}
              {entry.dataKey === 'revenue' || entry.dataKey === 'netIncome' || entry.dataKey === 'marketCap' ? 'M' : 
               entry.dataKey === 'roic' || entry.dataKey === 'riskProbability' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="section-title">Financial Analysis</h3>
        <div className="chart-controls">
          <button 
            className={chartType === 'revenue' ? 'active' : ''}
            onClick={() => setChartType('revenue')}
          >
            Revenue & Income
          </button>
          <button 
            className={chartType === 'roic' ? 'active' : ''}
            onClick={() => setChartType('roic')}
          >
            ROIC Analysis
          </button>
          <button 
            className={chartType === 'risk' ? 'active' : ''}
            onClick={() => setChartType('risk')}
          >
            Risk Profile
          </button>
        </div>
      </div>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          {chartType === 'revenue' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: 'Millions ($)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue (M)" fill="#667eea" />
              <Bar dataKey="netIncome" name="Net Income (M)" fill="#10b981" />
            </BarChart>
          ) : chartType === 'roic' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="roic" name="ROIC %" stroke="#764ba2" strokeWidth={2} />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="riskProbability" name="Risk Probability %" fill="#ef4444" />
              <Bar dataKey="roic" name="ROIC %" fill="#10b981" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="chart-insights">
        <h4>Key Insights:</h4>
        <ul>
          <li>Companies with ROIC above 15% are considered excellent</li>
          <li>Revenue growth should be analyzed alongside profit margins</li>
          <li>Lower risk probability indicates more stable investments</li>
          <li>Consider diversification across multiple top-performing companies</li>
        </ul>
      </div>
    </div>
  );
};

export default RevenueChart;
