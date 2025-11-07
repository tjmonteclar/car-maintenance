import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

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

const ViewRecords: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record[]>([]);
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // New state for filtration and pagination
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [costFilter, setCostFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("newest");
  const [plateFilter, setPlateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  // Fetch records from backend
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:3001/records');
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
      alert("Failed to load records. Please make sure JSON Server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Get unique plate numbers for the dropdown
  const plateNumbers = Array.from(new Set(records.map(record => record.carPlate))).sort();

  // Filter records based on search term and filters
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.carPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.parts.some(part => 
        part.partType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.brandName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    
    const matchesCost = costFilter === "all" || 
      (costFilter === "low" && record.totalCost < 100) ||
      (costFilter === "medium" && record.totalCost >= 100 && record.totalCost <= 500) ||
      (costFilter === "high" && record.totalCost > 500);

    const matchesPlate = plateFilter === "all" || record.carPlate === plateFilter;

    return matchesSearch && matchesStatus && matchesCost && matchesPlate;
  });

  // Sort records based on date filter
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (dateFilter === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);

  const toggleDetails = (recordId: number) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const handleDelete = async (recordId: number) => {
    if (!window.confirm("Are you sure you want to delete this maintenance record?")) {
      return;
    }

    setDeletingId(recordId);
    
    try {
      console.log('Deleting record with ID:', recordId);
      
      const response = await fetch(`http://localhost:3001/records/${recordId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRecords(prev => prev.filter(record => record.id !== recordId));
        
        if (expandedRecord === recordId) {
          setExpandedRecord(null);
        }
        
        console.log('Record deleted successfully');
      } else {
        console.error('Delete failed with status:', response.status);
        alert("Failed to delete record. Please try again.");
        fetchRecords();
      }

    } catch (error) {
      console.error('Error in delete:', error);
      alert("Failed to delete record. Please check your connection.");
      fetchRecords();
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === "-" || !dateString || dateString === "") return "-";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return "-";
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, costFilter, dateFilter, plateFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bfa14a] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading records...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout pageTitle="View Records">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 font-['Tahoma']">Maintenance Records</h1>
          <p className="text-gray-600 mt-2">View and manage all vehicle maintenance history</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-[#bfa14a]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by driver, plate number, car model, or part..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-[#bfa14a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa14a] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* Plate Number Filter */}
              <select
                value={plateFilter}
                onChange={(e) => setPlateFilter(e.target.value)}
                className="px-3 py-2 border-2 border-[#bfa14a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa14a] focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Plate Numbers</option>
                {plateNumbers.map((plate) => (
                  <option key={plate} value={plate}>
                    {plate}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border-2 border-[#bfa14a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa14a] focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
              </select>

              {/* Cost Filter */}
              <select
                value={costFilter}
                onChange={(e) => setCostFilter(e.target.value)}
                className="px-3 py-2 border-2 border-[#bfa14a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa14a] focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Costs</option>
                <option value="low">Low ($0-100)</option>
                <option value="medium">Medium ($100-500)</option>
                <option value="high">High ($500+)</option>
              </select>

              {/* Date Sort */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border-2 border-[#bfa14a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa14a] focus:border-transparent transition-all duration-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                <span className="font-semibold text-gray-900">{filteredRecords.length}</span> record{filteredRecords.length !== 1 ? 's' : ''} found
              </div>
              {(searchTerm || plateFilter !== "all" || statusFilter !== "all" || costFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setPlateFilter("all");
                    setStatusFilter("all");
                    setCostFilter("all");
                    setDateFilter("newest");
                  }}
                  className="px-3 py-2 text-sm text-[#bfa14a] hover:text-[#a58c3b] font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {currentRecords.map((record) => (
            <div key={record.id} className="bg-white shadow-lg rounded-xl border border-[#bfa14a] overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Record Summary */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-6 items-center">
                  {/* Driver */}
                  <div className="text-center md:text-left">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Driver</div>
                    <div className="text-lg font-semibold text-gray-900">{record.driverName}</div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="text-center md:text-left">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Vehicle</div>
                    <div className="text-lg font-semibold text-gray-900">{record.carPlate}</div>
                    <div className="text-sm text-gray-600">{record.carModel}</div>
                  </div>

                  {/* Parts Count */}
                  <div className="text-center md:text-left">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Parts</div>
                    <div className="text-lg font-semibold text-gray-900">{record.partsCount}</div>
                    <div className="text-sm text-gray-600">components</div>
                  </div>

                  {/* Total Cost */}
                  <div className="text-center md:text-left">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Cost</div>
                    <div className="text-lg font-semibold text-[#bfa14a]">${record.totalCost.toFixed(2)}</div>
                  </div>

                  {/* Date */}
                  <div className="text-center md:text-left">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center md:justify-end space-x-3">
                    <button
                      onClick={() => toggleDetails(record.id)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      {expandedRecord === record.id ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          <span>Details</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      disabled={deletingId === record.id}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === record.id ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Deleting</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRecord === record.id && (
                <div className="border-t border-gray-200 bg-gray-50/50">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-2 h-6 bg-[#bfa14a] rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-900">Parts Details</h3>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Part Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Brand</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Supplier</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Manufacture</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Expiry</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Change Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {record.parts.map((part, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                {part.partType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  part.replaced === "Yes" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {part.replaced}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {part.brandName || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {part.supplier || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(part.manufactureDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(part.expiryDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(part.changeDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#bfa14a]">
                                ${part.cost.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                      {record.parts.map((part, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="col-span-2">
                              <h4 className="font-semibold text-gray-900 text-base">{part.partType}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                part.replaced === "Yes" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {part.replaced}
                              </span>
                            </div>
                            
                            <div className="font-medium text-gray-500">Brand:</div>
                            <div className="text-gray-900">{part.brandName || "-"}</div>
                            
                            <div className="font-medium text-gray-500">Supplier:</div>
                            <div className="text-gray-900">{part.supplier || "-"}</div>
                            
                            <div className="font-medium text-gray-500">Manufacture:</div>
                            <div className="text-gray-900">{formatDate(part.manufactureDate)}</div>
                            
                            <div className="font-medium text-gray-500">Expiry:</div>
                            <div className="text-gray-900">{formatDate(part.expiryDate)}</div>
                            
                            <div className="font-medium text-gray-500">Change Date:</div>
                            <div className="text-gray-900">{formatDate(part.changeDate)}</div>
                            
                            <div className="font-medium text-gray-500">Cost:</div>
                            <div className="font-bold text-[#bfa14a]">${part.cost.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 py-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                    currentPage === page
                      ? "bg-[#bfa14a] text-white"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 text-8xl mb-6">
              {searchTerm || plateFilter !== "all" ? "🔍" : "🔧"}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchTerm || plateFilter !== "all" ? "No matching records" : "No maintenance records"}
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No records found matching "${searchTerm}"` 
                : plateFilter !== "all"
                ? `No records found for plate number "${plateFilter}"`
                : "Get started by adding your first maintenance record."
              }
            </p>
            {(searchTerm || plateFilter !== "all" || statusFilter !== "all" || costFilter !== "all") ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPlateFilter("all");
                  setStatusFilter("all");
                  setCostFilter("all");
                }}
                className="px-6 py-3 bg-[#bfa14a] text-white font-semibold rounded-lg hover:bg-[#a58c3b] transition-colors duration-200"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate("/add-record")}
                className="px-6 py-3 bg-[#bfa14a] text-white font-semibold rounded-lg hover:bg-[#a58c3b] transition-colors duration-200"
              >
                Add First Record
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewRecords;