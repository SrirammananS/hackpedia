import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { vulnerabilitiesAPI } from '../api';

interface Vulnerability {
  _id: string;
  title: string;
  description: string;
  whereToTest: string;
  howToTest: string;
  payloads: string[];
  codeSnippet: string;
  mitigation: string;
  bypassTricks: string;
}

interface VulnerabilityFormData {
  title: string;
  description: string;
  whereToTest: string;
  howToTest: string;
  payloads: string[];
  codeSnippet: string;
  mitigation: string;
  bypassTricks: string;
}

function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVuln, setEditingVuln] = useState<Vulnerability | null>(null);
  const [formData, setFormData] = useState<VulnerabilityFormData>({
    title: '',
    description: '',
    whereToTest: '',
    howToTest: '',
    payloads: [''],
    codeSnippet: '',
    mitigation: '',
    bypassTricks: ''
  });

  const queryClient = useQueryClient();

  const { data: vulnerabilities = [], isLoading } = useQuery({
    queryKey: ['vulnerabilities'],
    queryFn: async () => {
      const { data } = await vulnerabilitiesAPI.getAll();
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newVuln: VulnerabilityFormData) => 
      vulnerabilitiesAPI.create(newVuln),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vulnerabilities'] });
      toast.success('Vulnerability created successfully');
      handleCloseModal();
    },
    onError: () => {
      toast.error('Failed to create vulnerability');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: VulnerabilityFormData }) =>
      vulnerabilitiesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vulnerabilities'] });
      toast.success('Vulnerability updated successfully');
      handleCloseModal();
    },
    onError: () => {
      toast.error('Failed to update vulnerability');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      vulnerabilitiesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vulnerabilities'] });
      toast.success('Vulnerability deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete vulnerability');
    }
  });

  const handleOpenModal = (vuln?: Vulnerability) => {
    if (vuln) {
      setEditingVuln(vuln);
      setFormData(vuln);
    } else {
      setEditingVuln(null);
      setFormData({
        title: '',
        description: '',
        whereToTest: '',
        howToTest: '',
        payloads: [''],
        codeSnippet: '',
        mitigation: '',
        bypassTricks: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVuln(null);
    setFormData({
      title: '',
      description: '',
      whereToTest: '',
      howToTest: '',
      payloads: [''],
      codeSnippet: '',
      mitigation: '',
      bypassTricks: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVuln) {
      updateMutation.mutate({ id: editingVuln._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vulnerability?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddPayload = () => {
    setFormData(prev => ({
      ...prev,
      payloads: [...prev.payloads, '']
    }));
  };

  const handleRemovePayload = (index: number) => {
    setFormData(prev => ({
      ...prev,
      payloads: prev.payloads.filter((_, i) => i !== index)
    }));
  };

  const handlePayloadChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      payloads: prev.payloads.map((p, i) => i === index ? value : p)
    }));
  };

  const filteredVulns = vulnerabilities.filter((vuln: Vulnerability) =>
    vuln.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage vulnerability database</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Vulnerability
        </button>
      </div>

      <div className="relative max-w-xl mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search vulnerabilities..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredVulns.map((vuln: Vulnerability) => (
            <div
              key={vuln._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-xl font-semibold text-gray-900">{vuln.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(vuln)}
                    className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(vuln._id)}
                    className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{vuln.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingVuln ? 'Edit Vulnerability' : 'Add New Vulnerability'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Where to Test
                </label>
                <textarea
                  value={formData.whereToTest}
                  onChange={(e) => setFormData(prev => ({ ...prev, whereToTest: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How to Test
                </label>
                <textarea
                  value={formData.howToTest}
                  onChange={(e) => setFormData(prev => ({ ...prev, howToTest: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payloads
                </label>
                <div className="space-y-2">
                  {formData.payloads.map((payload, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={payload}
                        onChange={(e) => handlePayloadChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter payload"
                        required
                      />
                      {formData.payloads.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePayload(index)}
                          className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddPayload}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    + Add another payload
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code Snippet
                </label>
                <textarea
                  value={formData.codeSnippet}
                  onChange={(e) => setFormData(prev => ({ ...prev, codeSnippet: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mitigation
                </label>
                <textarea
                  value={formData.mitigation}
                  onChange={(e) => setFormData(prev => ({ ...prev, mitigation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bypass Tricks
                </label>
                <textarea
                  value={formData.bypassTricks}
                  onChange={(e) => setFormData(prev => ({ ...prev, bypassTricks: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    editingVuln ? 'Update' : 'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;