import React, { useState, useEffect } from 'react';
import { StaffingRecord, StaffingStatus } from '../../types/resourceTracking';
import resourceTrackingService from '../../services/resourceTrackingService';

interface StaffingListProps {
  onEditStaffingRecord: (staffingRecord: StaffingRecord) => void;
  onDeleteStaffingRecord: (staffingRecordId: number) => void;
  refreshTrigger?: number;
}

const StaffingList: React.FC<StaffingListProps> = ({ 
  onEditStaffingRecord, 
  onDeleteStaffingRecord, 
  refreshTrigger 
}) => {
  const [staffingRecords, setStaffingRecords] = useState<StaffingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StaffingStatus | 'all'>('all');

  useEffect(() => {
    loadStaffingRecords();
  }, [refreshTrigger]);

  const loadStaffingRecords = async () => {
    try {
      setLoading(true);
      const data = await resourceTrackingService.getAllStaffingRecords();
      setStaffingRecords(data);
    } catch (err: any) {
      setError('Failed to load staffing records: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (staffingRecordId: number) => {
    if (window.confirm('Are you sure you want to delete this staffing record?')) {
      try {
        await resourceTrackingService.deleteStaffingRecord(staffingRecordId);
        onDeleteStaffingRecord(staffingRecordId);
        await loadStaffingRecords(); // Refresh the list
      } catch (err: any) {
        setError('Failed to delete staffing record: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const getStatusColor = (status: StaffingStatus): string => {
    switch (status) {
      case StaffingStatus.Active:
        return 'bg-green-100 text-green-800';
      case StaffingStatus.Planned:
        return 'bg-blue-100 text-blue-800';
      case StaffingStatus.Completed:
        return 'bg-gray-100 text-gray-800';
      case StaffingStatus.Cancelled:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStaffingRecords = staffingRecords.filter(record => 
    statusFilter === 'all' || record.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading staffing records...</span>
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

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Status Filter:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StaffingStatus | 'all')}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            {Object.values(StaffingStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staffing Records Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allocation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate/Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaffingRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.projectId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{new Date(record.startDate).toLocaleDateString()}</div>
                      {record.endDate && (
                        <div className="text-gray-500">
                          to {new Date(record.endDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.allocationPercentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>${record.hourlyRate}/hr</div>
                      {record.totalHours && (
                        <div className="text-gray-500">
                          {record.totalHours}h total
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEditStaffingRecord(record)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStaffingRecords.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No staffing records found matching the current filter.
        </div>
      )}
    </div>
  );
};

export default StaffingList;