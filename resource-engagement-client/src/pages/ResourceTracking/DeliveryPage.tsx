import React, { useState } from 'react';
import { Delivery } from '../../types/resourceTracking';
import DeliveryList from '../../components/ResourceTracking/DeliveryList';
import DeliveryForm from '../../components/ResourceTracking/DeliveryForm';

const DeliveryPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setEditingDelivery(undefined);
    setShowForm(true);
  };

  const handleEditDelivery = (delivery: Delivery) => {
    setEditingDelivery(delivery);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingDelivery(undefined);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of the list
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDelivery(undefined);
  };

  const handleDeleteDelivery = (deliveryId: number) => {
    // The delete is handled in DeliveryList component
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
              <p className="mt-2 text-gray-600">
                Track and manage project deliveries, timelines, and effort
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Delivery
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
              <DeliveryForm
                delivery={editingDelivery}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <DeliveryList
            onEditDelivery={handleEditDelivery}
            onDeleteDelivery={handleDeleteDelivery}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;