import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function MapView() {
  const router = useRouter();
  const { district, panchayath } = router.query;
  const [mapUrl, setMapUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [adminUsername, setAdminUsername] = useState('');

  useEffect(() => {
    async function fetchMapUrl() {
      if (!district || !panchayath) return;
      setLoading(true);
      const res = await fetch('/district_localbody_mapping.json');
      const data = await res.json();
      const lbArr = data[district] || [];
      const found = lbArr.find(lb => lb.LocalBody === panchayath);
      setMapUrl(found ? found.HTMLPage : '');
      setLoading(false);
    }
    fetchMapUrl();
    fetchAdminUsername();
  }, [district, panchayath]);

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

  const handleBackClick = () => {
    router.push('/adminmap');
  };

  const title = district && panchayath ? `${district}_${panchayath} Map` : 'Map';

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.1rem',
        color: '#666'
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      {/* Back Button and Username Box */}
      <div style={{
        width: '100%',
        maxWidth: '390px',
        background: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
        margin: '16px auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button 
          onClick={handleBackClick}
          style={{
            background: '#1db954',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#16a34a'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1db954'}
        >
          ← Back
        </button>
        
        <div style={{
          fontSize: '0.9rem',
          color: '#666',
          fontWeight: '500'
        }}>
          {adminUsername ? `Admin: ${adminUsername}` : 'Admin: N/A'}
        </div>
      </div>

      {/* Map Container */}
      <div style={{
        flex: 1,
        width: '100%',
        position: 'relative',
        background: '#f0f0f0'
      }}>
        {mapUrl ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <iframe
              src={mapUrl}
              title={title}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
              allowFullScreen
              allow="geolocation"
            />
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            background: 'white',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1rem',
              color: '#666',
              marginBottom: '12px',
              fontWeight: '500'
            }}>
              No map available
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#888',
              lineHeight: '1.4'
            }}>
              Map data not found for {panchayath}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 