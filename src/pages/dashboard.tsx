import React, { useState, useEffect } from "react";
import Layout from "../components/layout";

interface Record {
  id: number;
  driverName: string;
  carPlate: string;
  carModel: string;
  partsCount: number;
  totalCost: number;
  date: string;
  status: string;
  parts: Part[];
}

interface Part {
  partType: string;
  replaced: string;
  brandName: string;
  manufactureDate: string;
  expiryDate: string;
  changeDate: string;
  cost: number;
  supplier: string;
}

const Dashboard: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecords: 0,
    partsReplaced: 0,
    totalCost: 0,
    mostServicedCar: ""
  });

  // Fetch records from backend
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('http://localhost:3001/records');
        if (!response.ok) {
          throw new Error('Failed to fetch records');
        }
        const data = await response.json();
        setRecords(data);
        calculateStats(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Calculate dashboard statistics
  const calculateStats = (records: Record[]) => {
    const totalRecords = records.length;
    
    const partsReplaced = records.reduce((total, record) => {
      return total + record.parts.filter(part => part.replaced === "Yes").length;
    }, 0);

    const totalCost = records.reduce((total, record) => total + record.totalCost, 0);

    const carServiceCount: { [key: string]: number } = {};
    records.forEach(record => {
      const carKey = `${record.carPlate} - ${record.carModel}`;
      carServiceCount[carKey] = (carServiceCount[carKey] || 0) + 1;
    });

    const mostServicedCar = Object.keys(carServiceCount).reduce((a, b) => 
      carServiceCount[a] > carServiceCount[b] ? a : b, "No data"
    );

    setStats({
      totalRecords,
      partsReplaced,
      totalCost,
      mostServicedCar: mostServicedCar.split(" - ")[0]
    });
  };

  // Calculate parts breakdown
  const getPartsBreakdown = () => {
    const breakdown: { [key: string]: number } = {};
    
    records.forEach(record => {
      record.parts.forEach(part => {
        if (part.replaced === "Yes") {
          breakdown[part.partType] = (breakdown[part.partType] || 0) + 1;
        }
      });
    });

    return breakdown;
  };

  const partsBreakdown = getPartsBreakdown();

  // Calculate cost trend (last 6 months)
  const getCostTrend = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('default', { month: 'short' });
    }).reverse();

    const monthlyCosts = last6Months.map(month => {
      const monthCost = records
        .filter(record => new Date(record.date).toLocaleString('default', { month: 'short' }) === month)
        .reduce((sum, record) => sum + record.totalCost, 0);
      return { month, cost: monthCost };
    });

    return monthlyCosts;
  };

  const costTrend = getCostTrend();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bfa14a] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout pageTitle="Dashboard">
      {/* Desktop Header */}
      <div className="text-center hidden lg:block mb-8">
        <h1 className="text-3xl font-bold text-black font-['Tahoma']">
          Maintenance Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Overview of your vehicle maintenance records</p>
      </div>

      <div className="space-y-6 lg:space-y-8">
        {/* Summary Cards with enhanced design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl p-4 lg:p-6 border border-[#bfa14a]/20 hover:shadow-2xl transition-all duration-300 group hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Records</h3>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800 mt-2 bg-gradient-to-r from-gray-800 to-[#bfa14a] bg-clip-text text-transparent">
                  {stats.totalRecords}
                </p>
                <p className="text-gray-500 text-xs lg:text-sm mt-1">Maintenance visits</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#bfa14a] to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-white text-lg">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl p-4 lg:p-6 border border-[#bfa14a]/20 hover:shadow-2xl transition-all duration-300 group hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Parts Replaced</h3>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800 mt-2 bg-gradient-to-r from-gray-800 to-[#bfa14a] bg-clip-text text-transparent">
                  {stats.partsReplaced}
                </p>
                <p className="text-gray-500 text-xs lg:text-sm mt-1">
                  Out of {records.reduce((total, record) => total + record.parts.length, 0)} total
                </p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#bfa14a] to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-white text-lg">🔧</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl p-4 lg:p-6 border border-[#bfa14a]/20 hover:shadow-2xl transition-all duration-300 group hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Cost</h3>
                <p className="text-2xl lg:text-3xl font-bold text-black mt-2 bg-gradient-to-r bg-clip-text">
                  ${stats.totalCost.toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs lg:text-sm mt-1">All maintenance</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#bfa14a] to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-white text-lg">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl p-4 lg:p-6 border border-[#bfa14a]/20 hover:shadow-2xl transition-all duration-300 group hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Most Serviced</h3>
                <p className="text-lg lg:text-xl font-bold text-black mt-2 truncate bg-clip-text">
                  {stats.mostServicedCar || "No data"}
                </p>
                <p className="text-gray-500 text-xs lg:text-sm mt-1">
                  {stats.mostServicedCar ? 
                    `${records.filter(r => r.carPlate === stats.mostServicedCar).length} visits` : 
                    "No records"
                  }
                </p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#bfa14a] to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-white text-lg">🚗</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Parts Breakdown */}
          <div className="xl:col-span-1 bg-white shadow-lg rounded-2xl p-6 border border-[#bfa14a]/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Parts Replacement</h2>
              <span className="text-sm text-gray-500 bg-gradient-to-r from-gray-100 to-[#bfa14a]/10 px-3 py-1 rounded-full border">
                {stats.partsReplaced} replaced
              </span>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {Object.entries(partsBreakdown)
                .sort(([,a], [,b]) => b - a)
                .map(([partType, count], index) => (
                  <div 
                    key={partType} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-[#bfa14a]/5 hover:to-white transition-all duration-300 group border border-transparent hover:border-[#bfa14a]/20"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className="font-semibold text-gray-800 group-hover:text-[#bfa14a] transition-colors duration-300">
                          {partType}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-gradient-to-r from-[#bfa14a] to-amber-600 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.round((count / stats.partsReplaced) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="w-10 h-10 bg-gradient-to-br from-[#bfa14a] to-amber-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-sm">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              {Object.keys(partsBreakdown).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🔧</div>
                  No parts replaced yet
                </div>
              )}
            </div>
          </div>

          {/* Cost Trend Chart */}
          <div className="xl:col-span-1 bg-white shadow-lg rounded-2xl p-6 border border-[#bfa14a]/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Cost Trend</h2>
              <span className="text-sm text-gray-500 bg-gradient-to-r from-gray-100 to-[#bfa14a]/10 px-3 py-1 rounded-full border">
                Last 6 months
              </span>
            </div>
            <div className="space-y-4 h-80">
              {costTrend.some(item => item.cost > 0) ? (
                <div className="flex items-end justify-between h-48 pt-8 pb-4">
                  {costTrend.map((item, index) => (
                    <div key={item.month} className="flex flex-col items-center flex-1 mx-1">
                      <div className="text-center mb-2">
                        <div className="text-xs text-gray-500 font-medium">{item.month}</div>
                        <div className="text-sm font-semibold text-gray-800">${item.cost.toLocaleString()}</div>
                      </div>
                      <div 
                        className="w-3/4 bg-gradient-to-t from-[#bfa14a] to-amber-600 rounded-t-lg transition-all duration-1000 ease-out hover:from-amber-500 hover:to-[#bfa14a] hover:shadow-lg"
                        style={{ 
                          height: item.cost > 0 ? `${Math.max((item.cost / Math.max(...costTrend.map(c => c.cost))) * 80, 10)}px` : '0px'
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">📈</div>
                  No cost data available
                </div>
              )}
            </div>
          </div>

          {/* Recent Maintenance Records */}
          <div className="xl:col-span-1 bg-white shadow-lg rounded-2xl p-6 border border-[#bfa14a]/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Records</h2>
              <span className="text-sm text-gray-500 bg-gradient-to-r from-gray-100 to-[#bfa14a]/10 px-3 py-1 rounded-full border">
                Last 5
              </span>
            </div>
            
            {records.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">🔧</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance records</h3>
                <p className="text-gray-600">Get started by adding your first maintenance record.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {records.slice(0, 5).map((record) => (
                  <div 
                    key={record.id} 
                    className="border border-gray-200 rounded-xl p-4 hover:border-[#bfa14a] hover:shadow-md transition-all duration-300 group bg-gradient-to-r from-white to-gray-50 hover:from-[#bfa14a]/5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#bfa14a] transition-colors duration-300">
                          {record.driverName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {record.carPlate} • {record.carModel}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 bg-gradient-to-r from-gray-800 to-[#bfa14a] bg-clip-text text-transparent">
                          ${record.totalCost.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {record.partsCount} parts
                      </span>
                      <span className="text-gray-500 truncate max-w-[150px]">
                        {record.parts.slice(0, 2).map(part => part.partType).join(', ')}
                        {record.parts.length > 2 && '...'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;