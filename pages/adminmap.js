import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function AdminMap() {
  const [districtMap, setDistrictMap] = useState({});
  const [district, setDistrict] = useState('');
  const [panchayath, setPanchayath] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/district_localbody_mapping.json')
      .then(res => res.json())
      .then(data => setDistrictMap(data));
    fetchAdminUsername();
  }, []);

  async function fetchAdminUsername() {
    let userId = '';
    if (typeof window !== 'undefined') {
      userId = localStorage.getItem('user_id') || '';
    }
    if (!userId) return;
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .eq('user_role', 'admin')
      .single();
    
    if (!userError && userData) {
      setAdminUsername(userData.username || '');
    }
  }

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
    <div style={{minHeight:'100vh',background:'#f5f5f5',padding:'5px 0',overflow:'hidden'}}>
      <div style={{
        width: '100%',
        maxWidth: '390px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        minHeight: '100vh'
      }}>
        {/* Top Navigation Box */}
        <div style={{
          width: '100%',
          background: '#fff',
          padding: '12px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Back Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '8px',
            background: '#1db954',
            transition: 'background-color 0.2s'
          }}
          onClick={() => router.push('/adminportal')}
          onMouseOver={(e) => e.target.style.background = '#18a34b'}
          onMouseOut={(e) => e.target.style.background = '#1db954'}
          >
            <span style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#fff'
            }}>
              ← Back
            </span>
          </div>

          {/* Username */}
          <div style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#333'
          }}>
            {adminUsername || 'Admin'}
          </div>
        </div>

        <div style={{padding:'20px'}}>
          <h1 style={{fontSize:'1.2rem',fontWeight:'bold',color:'#1db954',marginBottom:'20px',textAlign:'center'}}>Select District & Panchayath</h1>
          <div style={{marginBottom:'18px'}}>
            <select
              value={district}
              onChange={e => { setDistrict(e.target.value); setPanchayath(''); }}
              style={{width:'100%',padding:'12px',borderRadius:'8px',border:'1px solid #ccc',marginBottom:'14px',fontSize:'0.9rem'}}
            >
              <option value="">Select District</option>
              {districtOptions.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={panchayath}
              onChange={e => setPanchayath(e.target.value)}
              style={{width:'100%',padding:'12px',borderRadius:'8px',border:'1px solid #ccc',fontSize:'0.9rem'}}
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
            style={{
              width:'100%',
              padding:'14px',
              background: district && panchayath ? '#1db954' : '#ccc',
              color:'#fff',
              border:'none',
              borderRadius:'8px',
              fontWeight:'bold',
              fontSize:'1rem',
              cursor: district && panchayath ? 'pointer' : 'not-allowed'
            }}
          >
            Show Map
          </button>
        </div>
      </div>
    </div>
  );
} 