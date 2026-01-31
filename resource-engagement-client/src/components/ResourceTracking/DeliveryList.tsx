import React, { useState, useEffect } from 'react';
import { Delivery, DeliveryStatus, DeliveryPriority } from '../../types/resourceTracking';
import resourceTrackingService from '../../services/resourceTrackingService';

interface DeliveryListProps {
  onEditDelivery: (delivery: Delivery) => void;
  onDeleteDelivery: (deliveryId: number) => void;
  refreshTrigger?: number;
}

const DeliveryList: React.FC<DeliveryListProps> = ({ 
  onEditDelivery, 
  onDeleteDelivery, 
  refreshTrigger 
}) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<{
    status: DeliveryStatus | 'all';
    priority: DeliveryPriority | 'all';
  }>({
    status: 'all',
    priority: 'all'
  });

  useEffect(() => {
    loadDeliveries();
  }, [refreshTrigger]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const data = await resourceTrackingService.getAllDeliveries();
      setDeliveries(data);
    } catch (err: any) {
      setError('Failed to load deliveries: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deliveryId: number) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      try {
        await resourceTrackingService.deleteDelivery(deliveryId);
        onDeleteDelivery(deliveryId);
        await loadDeliveries(); // Refresh the list
      } catch (err: any) {
        setError('Failed to delete delivery: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const getStatusColor = (status: DeliveryStatus): string => {
    switch (status) {
      case DeliveryStatus.Completed:
        return 'bg-green-100 text-green-800';
      case DeliveryStatus.InProgress:
        return 'bg-blue-100 text-blue-800';
      case DeliveryStatus.OnHold:
        return 'bg-yellow-100 text-yellow-800';
      case DeliveryStatus.Cancelled:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: DeliveryPriority): string => {
    switch (priority) {
      case DeliveryPriority.Critical:
        return 'bg-red-100 text-red-800';
      case DeliveryPriority.High:
        return 'bg-orange-100 text-orange-800';
      case DeliveryPriority.Medium:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const statusMatch = filter.status === 'all' || delivery.status === filter.status;
    const priorityMatch = filter.priority === 'all' || delivery.priority === filter.priority;
    return statusMatch && priorityMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading deliveries...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as DeliveryStatus | 'all' }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {Object.values(DeliveryStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority Filter
            </label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value as DeliveryPriority | 'all' }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              {Object.values(DeliveryPriority).map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Deliveries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {delivery.deliveryName}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditDelivery(delivery)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(delivery.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            {delivery.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {delivery.description}
              </p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Planned Date:</span>
                <span className="text-gray-900">
                  {new Date(delivery.plannedDeliveryDate).toLocaleDateString()}
                </span>
              </div>
              {delivery.actualDeliveryDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Actual Date:</span>
                  <span className="text-gray-900">
                    {new Date(delivery.actualDeliveryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated Effort:</span>
                <span className="text-gray-900">{delivery.estimatedEffort}h</span>
              </div>
              {delivery.actualEffort && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Actual Effort:</span>
                  <span className="text-gray-900">{delivery.actualEffort}h</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                {delivery.status}
              </span>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(delivery.priority)}`}>
                {delivery.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No deliveries found matching the current filters.
        </div>
      )}
    </div>
  );
};

export default DeliveryList;