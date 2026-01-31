import React, { useState, useEffect } from 'react';
import { StaffingRecord, CreateStaffingRecordDto, UpdateStaffingRecordDto, StaffingStatus } from '../../types/resourceTracking';
import resourceTrackingService from '../../services/resourceTrackingService';

interface StaffingFormProps {
  staffingRecord?: StaffingRecord;
  onSubmit: () => void;
  onCancel: () => void;
}

const StaffingForm: React.FC<StaffingFormProps> = ({ staffingRecord, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeId: 0,
    projectId: 0,
    startDate: '',
    endDate: '',
    allocationPercentage: 1,
    role: '',
    hourlyRate: 0,
    totalHours: 0,
    status: StaffingStatus.Planned,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (staffingRecord) {
      setFormData({
        employeeId: staffingRecord.employeeId,
        projectId: staffingRecord.projectId,
        startDate: new Date(staffingRecord.startDate).toISOString().split('T')[0],
        endDate: staffingRecord.endDate ? new Date(staffingRecord.endDate).toISOString().split('T')[0] : '',
        allocationPercentage: staffingRecord.allocationPercentage,
        role: staffingRecord.role,
        hourlyRate: staffingRecord.hourlyRate,
        totalHours: staffingRecord.totalHours || 0,
        status: staffingRecord.status,
        notes: staffingRecord.notes || ''
      });
    }
  }, [staffingRecord]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (staffingRecord) {
        // Update existing staffing record
        const updateDto: UpdateStaffingRecordDto = {
          employeeId: formData.employeeId,
          projectId: formData.projectId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          allocationPercentage: formData.allocationPercentage,
          role: formData.role,
          hourlyRate: formData.hourlyRate,
          totalHours: formData.totalHours,
          status: formData.status,
          notes: formData.notes
        };
        await resourceTrackingService.updateStaffingRecord(staffingRecord.id, updateDto);
      } else {
        // Create new staffing record
        const createDto: CreateStaffingRecordDto = {
          employeeId: formData.employeeId,
          projectId: formData.projectId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          allocationPercentage: formData.allocationPercentage,
          role: formData.role,
          hourlyRate: formData.hourlyRate,
          totalHours: formData.totalHours,
          notes: formData.notes,
          status: formData.status
        };
        await resourceTrackingService.createStaffingRecord(createDto);
      }
      onSubmit();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save staffing record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {staffingRecord ? 'Edit Staffing Record' : 'Create New Staffing Record'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee ID */}
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID *
              </label>
              <input
                type="number"
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Project ID */}
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                Project ID *
              </label>
              <input
                type="number"
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Developer, Designer, Project Manager"
              />
            </div>

            {/* Allocation Percentage */}
            <div>
              <label htmlFor="allocationPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                Allocation Percentage *
              </label>
              <input
                type="number"
                id="allocationPercentage"
                name="allocationPercentage"
                value={formData.allocationPercentage}
                onChange={handleInputChange}
                required
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate *
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total Hours */}
            <div>
              <label htmlFor="totalHours" className="block text-sm font-medium text-gray-700 mb-1">
                Total Hours *
              </label>
              <input
                type="number"
                id="totalHours"
                name="totalHours"
                value={formData.totalHours}
                onChange={handleInputChange}
                required
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={StaffingStatus.Planned}>Planned</option>
                <option value={StaffingStatus.Active}>Active</option>
                <option value={StaffingStatus.Completed}>Completed</option>
                <option value={StaffingStatus.Cancelled}>Cancelled</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes *
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about this staffing assignment..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (staffingRecord ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffingForm;