import React, { useEffect, useState } from 'react';
import { RecruitmentRecord, RecruitmentStatus } from '../../types/Recruitment';
import recruitmentService from '../../services/recruitmentService';
import RecruitmentForm from './RecruitmentForm';

const RecruitmentList: React.FC = () => {
  const [records, setRecords] = useState<RecruitmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecruitmentRecord | undefined>(undefined);

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await recruitmentService.getAllRecruitmentRecords();
      setRecords(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch recruitment records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleEdit = (record: RecruitmentRecord) => {
    setSelectedRecord(record);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this recruitment record?')) return;
    try {
      await recruitmentService.deleteRecruitmentRecord(id);
      fetchRecords();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete recruitment record');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setSelectedRecord(undefined);
    fetchRecords();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedRecord(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recruitment Records</h1>
        <button
          onClick={() => { setShowForm(true); setSelectedRecord(undefined); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Recruitment
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Position Title</th>
                <th className="px-4 py-2 border-b">Job Level</th>
                <th className="px-4 py-2 border-b">Department</th>
                <th className="px-4 py-2 border-b">Requested By</th>
                <th className="px-4 py-2 border-b">Hiring Manager ID</th>
                <th className="px-4 py-2 border-b">Openings</th>
                <th className="px-4 py-2 border-b">Open Date</th>
                <th className="px-4 py-2 border-b">Posting Date</th>
                <th className="px-4 py-2 border-b">Close Date</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-4 text-gray-500">No recruitment records found.</td>
                </tr>
              ) : (
                records.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{record.positionTitle}</td>
                    <td className="px-4 py-2 border-b">{record.jobLevel}</td>
                    <td className="px-4 py-2 border-b">{record.department}</td>
                    <td className="px-4 py-2 border-b">{record.requestedBy}</td>
                    <td className="px-4 py-2 border-b">{record.hiringManagerId}</td>
                    <td className="px-4 py-2 border-b">{record.numberOfOpenings}</td>
                    <td className="px-4 py-2 border-b">{record.openDate?.split('T')[0]}</td>
                    <td className="px-4 py-2 border-b">{record.postingDate?.split('T')[0]}</td>
                    <td className="px-4 py-2 border-b">{record.closeDate?.split('T')[0]}</td>
                    <td className="px-4 py-2 border-b">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        record.status === RecruitmentStatus.Open ? 'bg-green-100 text-green-800' :
                        record.status === RecruitmentStatus.InProgress ? 'bg-yellow-100 text-yellow-800' :
                        record.status === RecruitmentStatus.Closed ? 'bg-gray-200 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b space-x-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <RecruitmentForm
          recruitmentRecord={selectedRecord}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default RecruitmentList;