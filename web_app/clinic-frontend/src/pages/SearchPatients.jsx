import { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import { Search } from 'lucide-react';
    import Button from '../components/Button';

    export default function SearchPatients() {
      const [query, setQuery] = useState('');
      const [results, setResults] = useState([]);
      const navigate = useNavigate();

      const handleSearch = async () => {
        const res = await axios.get(`http://localhost:5000/api/patients/search?q=${query}`);
        setResults(res.data);
      };

      return (
        <div>
          <h1 className="text-3xl font-bold mb-6">Search Registered Patients</h1>
          <div className="flex gap-2 mb-8">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or phone..." className="border p-2 rounded flex-1" />
            <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"><Search size={20}/> Search</button>
          </div>
          <div className="grid gap-4">
            {results.map(p => (
              <div key={p.patient_id} className="bg-white p-4 rounded shadow flex justify-between items-center cursor-pointer hover:bg-blue-50" onClick={() => navigate(`/patient/${p.patient_id}`)}>
                <div>
                  <p className="font-bold">{p.first_name} {p.last_name}</p>
                  <p className="text-sm text-gray-500">Contact: {p.contact_number}</p>
                </div>
                <button type="submit">Open Record &rarr;</button>
              </div>
            ))}
          </div>
        </div>
      );
    }