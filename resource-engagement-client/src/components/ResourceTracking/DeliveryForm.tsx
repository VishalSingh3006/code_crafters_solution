import React, { useState, useEffect } from 'react';
import { Delivery, CreateDeliveryDto, UpdateDeliveryDto, DeliveryPriority, DeliveryStatus } from '../../types/resourceTracking';
import resourceTrackingService from '../../services/resourceTrackingService';

interface DeliveryFormProps {
  delivery?: Delivery;
  onSubmit: () => void;
  onCancel: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ delivery, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    deliveryName: '',
    description: '',
    projectId: 0,
    employeeId: 0,
    plannedDeliveryDate: '',
    actualDeliveryDate: '',
    estimatedEffort: 0,
    actualEffort: '',
    priority: DeliveryPriority.Medium,
    status: DeliveryStatus.NotStarted,
    notes: '',
    completionPercentage: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (delivery) {
      setFormData({
        deliveryName: delivery.deliveryName,
        description: delivery.description || '',
        projectId: delivery.projectId,
        employeeId: delivery.employeeId,
        plannedDeliveryDate: new Date(delivery.plannedDeliveryDate).toISOString().split('T')[0],
        actualDeliveryDate: delivery.actualDeliveryDate ? new Date(delivery.actualDeliveryDate).toISOString().split('T')[0] : '',
        estimatedEffort: delivery.estimatedEffort,
        actualEffort: delivery.actualEffort?.toString() || '',
        priority: delivery.priority,
        status: delivery.status || DeliveryStatus.NotStarted,
        notes: '',
        completionPercentage: 0
      });
    }
  }, [delivery]);

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
      if (delivery) {
        // Update existing delivery
        const updateDto: UpdateDeliveryDto = {
          deliveryName: formData.deliveryName,
          description: formData.description || undefined,
          projectId: formData.projectId,
          employeeId: formData.employeeId,
          plannedDeliveryDate: formData.plannedDeliveryDate,
          actualDeliveryDate: formData.actualDeliveryDate || undefined,
          estimatedEffort: formData.estimatedEffort,
          actualEffort: formData.actualEffort ? parseFloat(formData.actualEffort) : undefined,
          priority: formData.priority,
          status: formData.status,
          notes: formData.notes || undefined,
          completionPercentage: formData.completionPercentage
        };
        await resourceTrackingService.updateDelivery(delivery.id, updateDto);
      } else {
        // Create new delivery
        const createDto: CreateDeliveryDto = {
          deliveryName: formData.deliveryName,
          description: formData.description || undefined,
          projectId: formData.projectId,
          employeeId: formData.employeeId,
          plannedDeliveryDate: formData.plannedDeliveryDate,
          actualDeliveryDate: formData.actualDeliveryDate || undefined,
          estimatedEffort: formData.estimatedEffort,
          actualEffort: formData.actualEffort ? parseFloat(formData.actualEffort) : undefined,
          priority: formData.priority
        };
        await resourceTrackingService.createDelivery(createDto);
      }
      onSubmit();
    } catch (err: any) {
      setError('Failed to save delivery: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {delivery ? 'Edit Delivery' : 'Create New Delivery'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Name *
            </label>
            <input
              type="text"
              name="deliveryName"
              value={formData.deliveryName}
              onChange={handleInputChange}
              required
              maxLength={200}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter delivery name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(DeliveryPriority).map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            maxLength={500}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter delivery description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project ID *
            </label>
            <input
              type="number"
              name="projectId"
              value={formData.projectId}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID *
            </label>
            <input
              type="number"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter employee ID"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planned Delivery Date *
            </label>
            <input
              type="date"
              name="plannedDeliveryDate"
              value={formData.plannedDeliveryDate}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actual Delivery Date
            </label>
            <input
              type="date"
              name="actualDeliveryDate"
              value={formData.actualDeliveryDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Effort (hours) *
            </label>
            <input
              type="number"
              name="estimatedEffort"
              value={formData.estimatedEffort}
              onChange={handleInputChange}
              required
              min="0.1"
              step="0.1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter estimated effort"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actual Effort (hours)
            </label>
            <input
              type="number"
              name="actualEffort"
              value={formData.actualEffort}
              onChange={handleInputChange}
              min="0.1"
              step="0.1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter actual effort"
            />
          </div>
        </div>

        {delivery && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(DeliveryStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Completion Percentage
                </label>
                <input
                  type="number"
                  name="completionPercentage"
                  value={formData.completionPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter notes"
              />
            </div>
          </>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (delivery ? 'Update Delivery' : 'Create Delivery')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryForm;