import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

interface Part {
  partType: string;
  replaced: string;
  partBrand: string;
  supplier: string;
  manufactureDate: string;
  expiryDate: string;
  partChangeDate: string;
  partCost: string;
}

const AddRecord: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    driverName: "",
    carPlate: "",
    carModel: "",
    partType: "",
    partReplaced: "No",
    partBrand: "",
    supplier: "",
    manufactureDate: "",
    expiryDate: "",
    partChangeDate: "",
    partCost: "0.00",
  });

  const [parts, setParts] = useState<Part[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "driverName":
        if (!value.trim()) newErrors.driverName = "Driver name is required";
        else if (value.trim().length < 2)
          newErrors.driverName = "Driver name must be at least 2 characters";
        else delete newErrors.driverName;
        break;
      case "carPlate":
        if (!value.trim()) newErrors.carPlate = "Car plate is required";
        else delete newErrors.carPlate;
        break;
      case "carModel":
        if (!value.trim()) newErrors.carModel = "Car model is required";
        else delete newErrors.carModel;
        break;
      case "partType":
        if (!value) newErrors.partType = "Part type is required";
        else delete newErrors.partType;
        break;
      case "partCost":
        if (parseFloat(value) < 0)
          newErrors.partCost = "Cost cannot be negative";
        else delete newErrors.partCost;
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field on change
    validateField(name, value);
  };

  const addPart = () => {
    // Validate required fields
    if (!formData.partType) {
      setErrors((prev) => ({ ...prev, partType: "Please select a part type" }));
      return;
    }

    const newPart: Part = {
      partType: formData.partType,
      replaced: formData.partReplaced,
      partBrand: formData.partBrand,
      supplier: formData.supplier,
      manufactureDate: formData.manufactureDate,
      expiryDate: formData.expiryDate,
      partChangeDate: formData.partChangeDate,
      partCost: formData.partCost,
    };

    setParts([...parts, newPart]);

    // Reset part form
    setFormData((prev) => ({
      ...prev,
      partType: "",
      partReplaced: "No",
      partBrand: "",
      supplier: "",
      manufactureDate: "",
      expiryDate: "",
      partChangeDate: "",
      partCost: "0.00",
    }));

    // Clear part errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.partType;
      return newErrors;
    });
  };

  const removePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const calculateTotalCost = () => {
    return parts.reduce(
      (total, part) => total + parseFloat(part.partCost || "0"),
      0
    );
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.driverName.trim())
      newErrors.driverName = "Driver name is required";
    if (!formData.carPlate.trim()) newErrors.carPlate = "Car plate is required";
    if (!formData.carModel.trim()) newErrors.carModel = "Car model is required";
    if (parts.length === 0) newErrors.parts = "Please add at least one part";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);

    try {
      const totalCost = calculateTotalCost();

      // Transform parts data for the backend
      const transformedParts = parts.map((part) => ({
        partType: part.partType,
        replaced: part.replaced,
        brandName: part.partBrand,
        supplier: part.supplier,
        manufactureDate: part.manufactureDate,
        expiryDate: part.expiryDate,
        changeDate: part.partChangeDate,
        cost: parseFloat(part.partCost || "0"),
      }));

      const recordData = {
        driverName: formData.driverName,
        carPlate: formData.carPlate,
        carModel: formData.carModel,
        partsCount: parts.length,
        totalCost: totalCost,
        date: new Date().toISOString().split("T")[0],
        status: "Completed",
        parts: transformedParts,
      };

      const response = await fetch("http://localhost:3001/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        throw new Error("Failed to save record");
      }

      // Show success message and redirect
      setTimeout(() => {
        navigate("/view-records");
      }, 1000);
    } catch (error) {
      console.error("Error saving record:", error);
      alert("Failed to save record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid for submission
  const isFormValid =
    formData.driverName &&
    formData.carPlate &&
    formData.carModel &&
    parts.length > 0;

  return (
    <Layout pageTitle="Add Record">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center hidden lg:block mb-8">
          <h1 className="text-3xl font-bold text-black font-['Tahoma']">
            Add Maintenance Record
          </h1>
          <p className="text-gray-600 mt-2">
            Create a comprehensive maintenance entry for vehicle service and
            part replacements
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-[#7cabfc]/20">
          {/* Progress Steps */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#7cabfc] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <span className="font-semibold text-gray-900">
                  Vehicle Info
                </span>
              </div>
              <div className="w-12 h-0.5 bg-[#7cabfc]"></div>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    parts.length > 0
                      ? "bg-[#7cabfc] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span
                  className={`font-semibold ${
                    parts.length > 0 ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  Parts ({parts.length})
                </span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    isFormValid
                      ? "bg-[#7cabfc] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span
                  className={`font-semibold ${
                    isFormValid ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  Review & Save
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Driver & Vehicle Information Section */}
            <div className="p-8 border-b border-gray-200/60">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7cabfc] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Vehicle & Driver Details
                  </h2>
                  <p className="text-gray-600">
                    Enter the basic information about the vehicle and driver
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Driver Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Driver Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400 group-focus-within:text-[#7cabfc]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="driverName"
                      value={formData.driverName}
                      onChange={handleInputChange}
                      placeholder="Enter driver full name"
                      className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300 ${
                        errors.driverName ? "border-red-500" : "border-gray-200"
                      }`}
                      required
                      disabled={loading}
                    />
                  </div>
                  {errors.driverName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {errors.driverName}
                    </p>
                  )}
                </div>

                {/* Car Plate No */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    License Plate *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400 group-focus-within:text-[#7cabfc]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="carPlate"
                      value={formData.carPlate}
                      onChange={handleInputChange}
                      placeholder="e.g., ABC-1234"
                      className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300 ${
                        errors.carPlate ? "border-red-500" : "border-gray-200"
                      }`}
                      required
                      disabled={loading}
                    />
                  </div>
                  {errors.carPlate && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {errors.carPlate}
                    </p>
                  )}
                </div>

                {/* Car Model */}
                <div className="md:col-span-2 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Vehicle Model *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400 group-focus-within:text-[#7cabfc]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleInputChange}
                      placeholder="e.g., Toyota Camry 2023"
                      className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300 ${
                        errors.carModel ? "border-red-500" : "border-gray-200"
                      }`}
                      required
                      disabled={loading}
                    />
                  </div>
                  {errors.carModel && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {errors.carModel}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Parts Information Section */}
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7cabfc] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Parts & Components
                  </h2>
                  <p className="text-gray-600">
                    Add parts that were serviced or replaced
                  </p>
                </div>
              </div>

              {/* Parts Validation Error */}
              {errors.parts && (
                <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-red-700 font-medium">{errors.parts}</p>
                  </div>
                </div>
              )}

              {/* Add Part Form */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 p-8 rounded-2xl mb-8 border-2 border-dashed border-[#7cabfc]/40">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-6 bg-[#7cabfc] rounded-full mr-3"></span>
                  Add New Part
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Part Type */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Part Type *
                    </label>
                    <select
                      name="partType"
                      value={formData.partType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300 ${
                        errors.partType ? "border-red-500" : "border-gray-200"
                      }`}
                      disabled={loading}
                    >
                      <option value="">Select part type</option>
                      <option value="Engine Oil">Engine Oil</option>
                      <option value="Battery">Battery</option>
                      <option value="Tire">Tire</option>
                      <option value="Brake Pads">Brake Pads</option>
                      <option value="Air Filter">Air Filter</option>
                      <option value="Spark Plugs">Spark Plugs</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.partType && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.partType}
                      </p>
                    )}
                  </div>

                  {/* Part Replaced */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Part Replaced
                    </label>
                    <select
                      name="partReplaced"
                      value={formData.partReplaced}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300"
                      disabled={loading}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {/* Part Brand Name */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      name="partBrand"
                      value={formData.partBrand}
                      onChange={handleInputChange}
                      placeholder="e.g., Bosch, Michelin"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300"
                      disabled={loading}
                    />
                  </div>

                  {/* Supplier */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Supplier
                    </label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      placeholder="Supplier name"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Second row of parts information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Manufacture Date */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Manufacture Date
                    </label>
                    <input
                      type="date"
                      name="manufactureDate"
                      value={formData.manufactureDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300"
                      disabled={loading}
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300"
                      disabled={loading}
                    />
                  </div>

                  {/* Part Change Date */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Change Date
                    </label>
                    <input
                      type="date"
                      name="partChangeDate"
                      value={formData.partChangeDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300"
                      disabled={loading}
                    />
                  </div>

                  {/* Part Cost */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Part Cost ($)
                    </label>
                    <input
                      type="number"
                      name="partCost"
                      value={formData.partCost}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:border-[#7cabfc] transition-all duration-300 group-hover:border-gray-300 ${
                        errors.partCost ? "border-red-500" : "border-gray-200"
                      }`}
                      disabled={loading}
                    />
                    {errors.partCost && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.partCost}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addPart}
                  disabled={loading || !formData.partType}
                  className="px-8 py-4 bg-gradient-to-r from-[#7cabfc] to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center space-x-3"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Add Part to List</span>
                </button>
              </div>

              {/* Added Parts List - Enhanced Version */}
              {parts.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="w-2 h-6 bg-[#7cabfc] rounded-full mr-3"></span>
                      Added Parts ({parts.length})
                    </h3>
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#7cabfc] to-blue-600 bg-clip-text text-transparent">
                      Total: ${calculateTotalCost().toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {parts.map((part, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-white to-blue-50/50 p-6 rounded-2xl border border-[#7cabfc]/20 shadow-sm hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Top Row: Part Type and Cost */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <span className="font-bold text-gray-900 text-lg">
                                  {part.partType}
                                </span>
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    part.replaced === "Yes"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {part.replaced}
                                </span>
                              </div>
                              <span className="font-bold text-[#7cabfc] text-xl">
                                ${part.partCost}
                              </span>
                            </div>

                            {/* Middle Row: Brand and Supplier */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-500 font-medium">
                                  Brand:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {part.partBrand || "Not specified"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-500 font-medium">
                                  Supplier:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {part.supplier || "Not specified"}
                                </span>
                              </div>
                            </div>

                            {/* Bottom Row: Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">
                                  Manufacture:
                                </span>
                                <span className="ml-2 font-medium text-gray-900">
                                  {part.manufactureDate || "N/A"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Expiry:</span>
                                <span className="ml-2 font-medium text-gray-900">
                                  {part.expiryDate || "N/A"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Change Date:
                                </span>
                                <span className="ml-2 font-medium text-gray-900">
                                  {part.partChangeDate || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePart(index)}
                            className="ml-6 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 opacity-0 group-hover:opacity-100"
                            disabled={loading}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="px-8 py-8 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-200/60">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="text-center lg:text-left">
                  <p className="text-gray-600 mb-1">
                    {parts.length} part{parts.length !== 1 ? "s" : ""} added •
                    Total: ${calculateTotalCost().toFixed(2)}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      isFormValid ? "text-green-600" : "text-blue-600"
                    }`}
                  >
                    {isFormValid
                      ? "Ready to save maintenance record"
                      : "Please complete all required fields"}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="px-12 py-4 bg-gradient-to-r from-[#7cabfc] to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7cabfc] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center space-x-3 min-w-64"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Saving Record...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Save Maintenance Record</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddRecord;
