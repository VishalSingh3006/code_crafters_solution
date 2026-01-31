import React, { useState } from 'react';
import { StaffingRecord } from '../../types/resourceTracking';
import StaffingList from '../../components/ResourceTracking/StaffingList';

const StaffingPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditStaffingRecord = (staffingRecord: StaffingRecord) => {
    // TODO: Implement staffing form similar to DeliveryForm
    console.log('Edit staffing record:', staffingRecord);
  };

  const handleDeleteStaffingRecord = (staffingRecordId: number) => {
    // The delete is handled in StaffingList component
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreateNew = () => {
    // TODO: Implement create new staffing record
    console.log('Create new staffing record');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staffing Management</h1>
              <p className="mt-2 text-gray-600">
                Manage employee assignments, roles, and resource allocation
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Staffing Record
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <StaffingList
            onEditStaffingRecord={handleEditStaffingRecord}
            onDeleteStaffingRecord={handleDeleteStaffingRecord}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffingPage;