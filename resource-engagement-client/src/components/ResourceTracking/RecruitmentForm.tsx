import React, { useState, useEffect } from 'react';
import { RecruitmentRecord, CreateRecruitmentRecordDto, UpdateRecruitmentRecordDto, RecruitmentStatus, JobLevel } from '../../types/Recruitment';
import recruitmentService from '../../services/recruitmentService';

interface RecruitmentFormProps {
  recruitmentRecord?: RecruitmentRecord;
  onSubmit: () => void;
  onCancel: () => void;
}

const RecruitmentForm: React.FC<RecruitmentFormProps> = ({ recruitmentRecord, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    positionTitle: '',
    jobLevel: JobLevel.Junior,
    department: '',
    requestedBy: '',
    hiringManagerId: 0,
    numberOfOpenings: 1,
    openDate: '',
    postingDate: '',
    closeDate: '',
    status: RecruitmentStatus.Open,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (recruitmentRecord) {
      setFormData({
        positionTitle: recruitmentRecord.positionTitle,
        jobLevel: recruitmentRecord.jobLevel,
        department: recruitmentRecord.department,
        requestedBy: recruitmentRecord.requestedBy,
        hiringManagerId: recruitmentRecord.hiringManagerId,
        numberOfOpenings: recruitmentRecord.numberOfOpenings,
        openDate: recruitmentRecord.openDate ? new Date(recruitmentRecord.openDate).toISOString().split('T')[0] : '',
        postingDate: recruitmentRecord.postingDate ? new Date(recruitmentRecord.postingDate).toISOString().split('T')[0] : '',
        closeDate: recruitmentRecord.closeDate ? new Date(recruitmentRecord.closeDate).toISOString().split('T')[0] : '',
        status: recruitmentRecord.status,
        notes: recruitmentRecord.notes || ''
      });
    }
  }, [recruitmentRecord]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hiringManagerId' || name === 'numberOfOpenings'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (recruitmentRecord) {
        const updateDto: UpdateRecruitmentRecordDto = {
          positionTitle: formData.positionTitle,
          jobLevel: formData.jobLevel,
          department: formData.department,
          requestedBy: formData.requestedBy,
          hiringManagerId: formData.hiringManagerId,
          numberOfOpenings: formData.numberOfOpenings,
          openDate: formData.openDate ? `${formData.openDate}T00:00:00` : '',
          postingDate: formData.postingDate ? `${formData.postingDate}T00:00:00` : '',
          closeDate: formData.closeDate ? `${formData.closeDate}T23:59:59` : '',
          status: formData.status,
          notes: formData.notes
        };
        await recruitmentService.updateRecruitmentRecord(recruitmentRecord.id, updateDto);
      } else {
        const createDto: CreateRecruitmentRecordDto = {
          positionTitle: formData.positionTitle,
          jobLevel: formData.jobLevel,
          department: formData.department,
          requestedBy: formData.requestedBy,
          hiringManagerId: formData.hiringManagerId,
          numberOfOpenings: formData.numberOfOpenings,
          openDate: formData.openDate ? `${formData.openDate}T00:00:00` : '',
          postingDate: formData.postingDate ? `${formData.postingDate}T00:00:00` : '',
          closeDate: formData.closeDate ? `${formData.closeDate}T23:59:59` : '',
          status: formData.status,
          notes: formData.notes
        };
        await recruitmentService.createRecruitmentRecord(createDto);
      }
      onSubmit();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save recruitment record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {recruitmentRecord ? 'Edit Recruitment Record' : 'Create New Recruitment Record'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Position Title */}
            <div>
              <label htmlFor="positionTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Position Title *
              </label>
              <input
                type="text"
                id="positionTitle"
                name="positionTitle"
                value={formData.positionTitle}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Software Engineer"
              />
            </div>

            {/* Job Level */}
            <div>
              <label htmlFor="jobLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Job Level *
              </label>
              <select
                id="jobLevel"
                name="jobLevel"
                value={formData.jobLevel}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={JobLevel.Junior}>Junior</option>
                <option value={JobLevel.Mid}>Mid</option>
                <option value={JobLevel.Senior}>Senior</option>
                <option value={JobLevel.Lead}>Lead</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Engineering"
              />
            </div>

            {/* Requested By */}
            <div>
              <label htmlFor="requestedBy" className="block text-sm font-medium text-gray-700 mb-1">
                Requested By *
              </label>
              <input
                type="text"
                id="requestedBy"
                name="requestedBy"
                value={formData.requestedBy}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., John Doe"
              />
            </div>

            {/* Hiring Manager ID */}
            <div>
              <label htmlFor="hiringManagerId" className="block text-sm font-medium text-gray-700 mb-1">
                Hiring Manager ID *
              </label>
              <input
                type="number"
                id="hiringManagerId"
                name="hiringManagerId"
                value={formData.hiringManagerId}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Number of Openings */}
            <div>
              <label htmlFor="numberOfOpenings" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Openings *
              </label>
              <input
                type="number"
                id="numberOfOpenings"
                name="numberOfOpenings"
                value={formData.numberOfOpenings}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Open Date */}
            <div>
              <label htmlFor="openDate" className="block text-sm font-medium text-gray-700 mb-1">
                Open Date *
              </label>
              <input
                type="date"
                id="openDate"
                name="openDate"
                value={formData.openDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Posting Date */}
            <div>
              <label htmlFor="postingDate" className="block text-sm font-medium text-gray-700 mb-1">
                Posting Date *
              </label>
              <input
                type="date"
                id="postingDate"
                name="postingDate"
                value={formData.postingDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Close Date */}
            <div>
              <label htmlFor="closeDate" className="block text-sm font-medium text-gray-700 mb-1">
                Close Date *
              </label>
              <input
                type="date"
                id="closeDate"
                name="closeDate"
                value={formData.closeDate}
                onChange={handleInputChange}
                required
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
                <option value={RecruitmentStatus.Open}>Open</option>
                <option value={RecruitmentStatus.InProgress}>In Progress</option>
                <option value={RecruitmentStatus.Closed}>Closed</option>
                <option value={RecruitmentStatus.Cancelled}>Cancelled</option>
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
              placeholder="Additional notes about this recruitment..."
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
              {loading ? 'Saving...' : (recruitmentRecord ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruitmentForm;