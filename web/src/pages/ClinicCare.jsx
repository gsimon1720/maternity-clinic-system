import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ClinicCareView() {
  const { id } = useParams();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track which card index is expanded (default to opening the newest visit)
  const [expandedIndex, setExpandedIndex] = useState(0);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/clinic-care/${id}`);
        const dataArray = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
        setVisits(dataArray.slice(0, 10)); 
      } catch (err) {
        console.error("Error retrieving clinic visits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, [id]);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) return <div className="p-8 text-center text-pink-600 font-bold text-lg">Loading Antenatal Records...</div>;

  // INCREASED FONT SIZES HERE
  const sectionTitleClass = "text-sm md:text-base font-extrabold text-pink-900 uppercase tracking-wider mb-3 border-b border-pink-100 pb-2";
  const dataLabelClass = "text-sm text-gray-500 font-semibold";
  const dataValueClass = "text-base font-bold text-gray-900";

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-pink-200 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-pink-950">Antenatal Care History</h2>
          <p className="text-base text-pink-700 mt-2 font-medium">Click any history entry summary card to expand or collapse details.</p>
        </div>
        <div className="text-sm font-bold text-pink-900 bg-pink-100 px-4 py-2 rounded-xl border border-pink-200">
          Logged Logs: {visits.length} / 10 max
        </div>
      </div>

      {/* TIMELINE ACCORDION CARDS */}
      <div className="space-y-5">
        {visits.length > 0 ? (
          visits.map((v, index) => {
            const isOpen = expandedIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-200 ${
                  isOpen ? 'border-pink-300 ring-2 ring-pink-100' : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                {/* CARD SUMMARY HEADER (Always Visible) */}
                <div 
                  onClick={() => toggleExpand(index)}
                  className={`p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none ${
                    isOpen ? 'bg-pink-50/60' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-8">
                    {/* Visit Date */}
                    <div>
                      <span className={dataLabelClass}>Date</span>
                      <div className="text-lg font-extrabold text-gray-900">{new Date(v.visit_date).toLocaleDateString()}</div>
                    </div>
                    
                    {/* POA */}
                    <div>
                      <span className={dataLabelClass}>POA</span>
                      <div><span className="bg-pink-200 text-pink-950 px-3 py-1 rounded-md text-sm font-bold">{v.poa || '-'}</span></div>
                    </div>

                    {/* Weight */}
                    <div>
                      <span className={dataLabelClass}>Weight</span>
                      <div className="text-lg font-bold text-gray-800">{v.weight ? `${v.weight} kg` : '-'}</div>
                    </div>

                    {/* Blood Pressure */}
                    <div>
                      <span className={dataLabelClass}>Blood Pressure</span>
                      <div className="text-lg font-bold text-gray-800">
                        {v.bp_systolic && v.bp_diastolic ? `${v.bp_systolic} / ${v.bp_diastolic} mmHg` : '-'}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Indicator Action Icon */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-pink-800 uppercase tracking-wider hidden sm:inline">
                      {isOpen ? 'Collapse' : 'Expand Details'}
                    </span>
                    <span className={`text-xl text-pink-800 font-bold transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* EXPANDED DETAILS DRAWER */}
                {isOpen && (
                  <div className="p-6 border-t border-pink-100 bg-gray-50/50 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
                    
                    {/* Column 1: Lab/Maternal Screenings */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-4 shadow-sm">
                      <h4 className={sectionTitleClass}>🔬 Lab & Clinical Exams</h4>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className={dataLabelClass}>Urine Sugar:</span><span className={dataValueClass}>{v.urine_sugar || '-'}</span></div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className={dataLabelClass}>Urine Albumin:</span><span className={dataValueClass}>{v.urine_albumin || '-'}</span></div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className={dataLabelClass}>Pallor Presence:</span><span className={dataValueClass}>{v.pallor || '-'}</span></div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className={dataLabelClass}>Ankle Oedema:</span><span className={dataValueClass}>{v.oedema_ankle || '-'}</span></div>
                      <div className="flex justify-between items-center"><span className={dataLabelClass}>Facial Oedema:</span><span className={dataValueClass}>{v.oedema_facial || '-'}</span></div>
                    </div>

                    {/* Column 2: Obstetric Parameters */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-4 shadow-sm">
                      <h4 className={sectionTitleClass}>👶 Fetal Assessment</h4>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className={dataLabelClass}>Fundal Height:</span><span className={dataValueClass}>{v.fundal_height ? `${v.fundal_height} cm` : '-'}</span></div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className={dataLabelClass}>Foetal Lie:</span><span className={dataValueClass}>{v.foetal_lie || '-'}</span></div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className={dataLabelClass}>Presentation:</span><span className={dataValueClass}>{v.presentation || '-'}</span></div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className={dataLabelClass}>Engagement Scale:</span><span className={dataValueClass}>{v.engagement || '-'}</span></div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className={dataLabelClass}>Fetal Movements (FM):</span><span className={dataValueClass}>{v.fm || '-'}</span></div>
                      <div className="flex justify-between items-center"><span className={dataLabelClass}>Fetal Heart Sound (FHS):</span><span className={dataValueClass}>{v.fhs ? `${v.fhs} bpm` : '-'}</span></div>
                    </div>

                    {/* Column 3: Management & Signatures */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-4 shadow-sm">
                      <h4 className={sectionTitleClass}>💊 Care Plan & Sign-off</h4>
                      <div className="grid grid-cols-4 gap-2 text-center bg-gray-100/80 p-3 rounded-lg mb-3 border border-gray-200">
                        <div><div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Fe</div><div className="text-base font-bold text-gray-900">{v.iron === 'Yes' ? '✅' : '❌'}</div></div>
                        <div><div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Fol</div><div className="text-base font-bold text-gray-900">{v.folate === 'Yes' ? '✅' : '❌'}</div></div>
                        <div><div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Ca</div><div className="text-base font-bold text-gray-900">{v.calcium === 'Yes' ? '✅' : '❌'}</div></div>
                        <div><div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Vit C</div><div className="text-base font-bold text-gray-900">{v.vitamin_c === 'Yes' ? '✅' : '❌'}</div></div>
                      </div>
                      <div className="border-b border-gray-100 pb-3">
                        <span className={dataLabelClass}>Food Supplementation:</span>
                        <div className="text-base font-bold text-gray-800 mt-1">{v.food_supplementation || 'None noted'}</div>
                      </div>
                      <div className="pt-2">
                        <span className={dataLabelClass}>Signing Officer:</span>
                        <div className="text-base font-extrabold text-pink-950 mt-1">{v.officer_signature || '-'}</div>
                        <div className="text-sm font-medium italic text-gray-600 mt-0.5">{v.designation || '-'}</div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white border-2 border-dashed border-pink-200 text-center py-16 rounded-2xl text-gray-500 font-medium text-lg shadow-sm">
            No prenatal medical history records have been initialized for this client.
          </div>
        )}
      </div>

    </div>
  );
}