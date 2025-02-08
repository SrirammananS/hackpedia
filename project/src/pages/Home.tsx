import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Search } from 'lucide-react';
import VulnerabilityModal from '../components/VulnerabilityModal';
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

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);

  const { data: vulnerabilities = [], isLoading } = useQuery({
    queryKey: ['vulnerabilities'],
    queryFn: async () => {
      const { data } = await vulnerabilitiesAPI.getAll();
      return data;
    }
  });

  const filteredVulns = vulnerabilities.filter((vuln: Vulnerability) =>
    vuln.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
          <Shield className="h-10 w-10 text-indigo-600" />
          Vulnerability Library
        </h1>
        <p className="text-lg text-gray-600">
          Explore and learn about various security vulnerabilities
        </p>
      </div>

      <div className="relative max-w-xl mx-auto mb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVulns.map((vuln: Vulnerability) => (
            <div
              key={vuln._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedVuln(vuln)}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{vuln.title}</h3>
                <p className="text-gray-600 line-clamp-3">{vuln.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVuln && (
        <VulnerabilityModal
          vulnerability={selectedVuln}
          onClose={() => setSelectedVuln(null)}
        />
      )}
    </div>
  );
}

export default Home