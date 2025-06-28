import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function UserMap() {
  const router = useRouter();
  const [districtMap, setDistrictMap] = useState({});
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedPanchayath, setSelectedPanchayath] = useState('');
  const [localBodyUrl, setLocalBodyUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch district mapping data
    fetch('/district_localbody_mapping.json')
      .then(res => res.json())
      .then(data => {
        setDistrictMap(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading district mapping:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Get selected district and panchayath from localStorage
    const district = typeof window !== 'undefined' ? localStorage.getItem('selectedDistrict') : '';
    const panchayath = typeof window !== 'undefined' ? localStorage.getItem('selectedPanchayath') : '';
    setSelectedDistrict(district || '');
    setSelectedPanchayath(panchayath || '');
    
    if (district && panchayath && districtMap[district]) {
      const found = districtMap[district].find(lb => lb.LocalBody === panchayath);
      setLocalBodyUrl(found ? found.HTMLPage : '');
    } else {
      setLocalBodyUrl('');
    }

    // Fetch username
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : '';
    if (userId) {
      fetchUsername(userId);
    }
  }, [districtMap]);

  const fetchUsername = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const handleBackClick = () => {
    router.push('/thirdpage');
  };

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
          {username ? `User: ${username}` : 'User: N/A'}
        </div>
      </div>

      {/* Map Container */}
      <div style={{
        flex: 1,
        width: '100%',
        position: 'relative',
        background: '#f0f0f0'
      }}>
        {localBodyUrl ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <iframe
              src={localBodyUrl}
              title={`Map of ${selectedPanchayath}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
              allowFullScreen
              allow="geolocation"
            />
            {/* Note: Legend and Layers boxes are part of the external map service and cannot be removed due to browser security restrictions */}
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
              Map data not found for {selectedPanchayath}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 