import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminMap() {
  const [districtMap, setDistrictMap] = useState({});
  const [district, setDistrict] = useState('');
  const [panchayath, setPanchayath] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/district_localbody_mapping.json')
      .then(res => res.json())
      .then(data => setDistrictMap(data));
  }, []);

  const districtOptions = Object.keys(districtMap);
  const panchayathOptions = district && districtMap[district]
    ? districtMap[district].map(lb => lb.LocalBody)
    : [];

  const handleShowMap = () => {
    if (district && panchayath) {
      router.push(`/mapview?district=${encodeURIComponent(district)}&panchayath=${encodeURIComponent(panchayath)}`);
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f5',padding:'40px 0'}}>
      <div style={{maxWidth:'500px',margin:'0 auto',background:'#fff',borderRadius:'16px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)',padding:'32px'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:'bold',color:'#1db954',marginBottom:'24px',textAlign:'center'}}>Select District & Panchayath</h1>
        <div style={{marginBottom:'18px'}}>
          <select
            value={district}
            onChange={e => { setDistrict(e.target.value); setPanchayath(''); }}
            style={{width:'100%',padding:'12px',borderRadius:'8px',border:'1px solid #ccc',marginBottom:'14px'}}
          >
            <option value="">Select District</option>
            {districtOptions.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={panchayath}
            onChange={e => setPanchayath(e.target.value)}
            style={{width:'100%',padding:'12px',borderRadius:'8px',border:'1px solid #ccc'}}
            disabled={!district}
          >
            <option value="">Select Panchayath</option>
            {panchayathOptions.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleShowMap}
          disabled={!district || !panchayath}
          style={{width:'100%',padding:'14px',background:'#1db954',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold',fontSize:'1rem',cursor: district && panchayath ? 'pointer' : 'not-allowed'}}
        >
          Show Map
        </button>
      </div>
    </div>
  );
} 