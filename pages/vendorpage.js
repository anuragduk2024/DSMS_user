import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function VendorPage() {
  const [district, setDistrict] = useState('');
  const [panchayath, setPanchayath] = useState('');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchVendorInfo() {
      setLoading(true);
      let userId = '';
      if (typeof window !== 'undefined') {
        userId = localStorage.getItem('user_id') || '';
      }
      if (!userId) {
        setLoading(false);
        return;
      }
      // Fetch vendor's district and panchayath
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('district, panchayath, username')
        .eq('id', userId)
        .single();
      if (userError || !userData) {
        setLoading(false);
        return;
      }
      setDistrict(userData.district || '');
      setPanchayath(userData.panchayath || '');
      setUsername(userData.username || '');
      setLoading(false);
    }
    fetchVendorInfo();
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_id');
      localStorage.removeItem('selectedDistrict');
      localStorage.removeItem('selectedPanchayath');
    }
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div style={{textAlign:'center',color:'#888',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f5',margin:'0',padding:'0'}}>
      <div style={{width:'100%',background:'#1db954',padding:'16px 0 18px 0',borderRadius:'0 0 16px 16px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)',textAlign:'center'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:'bold',color:'#fff',margin:0}}>Vendor Portal</h1>
      </div>
      
      {/* Info Boxes */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        margin: '16px auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        padding: '0 20px'
      }}>
        {/* District Box */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '12px 8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '6px'
          }}>
            District
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#666',
            fontWeight: '500'
          }}>
            {district || 'Not set'}
          </div>
        </div>

        {/* Username Box */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '12px 8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '6px'
          }}>
            Username
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#666',
            fontWeight: '500'
          }}>
            {username || 'Not set'}
          </div>
        </div>

        {/* Panchayath Box */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '12px 8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '6px'
          }}>
            Panchayath
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#666',
            fontWeight: '500'
          }}>
            {panchayath || 'Not set'}
          </div>
        </div>

        {/* Logout Box */}
        <div style={{
          background: '#dc3545',
          borderRadius: '12px',
          padding: '12px 8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: 'pointer'
        }}
        onClick={handleLogout}
        onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
        >
          <div style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            color: '#fff'
          }}>
            Logout
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'32px auto 0 auto',background:'#fff',borderRadius:'16px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)',padding:'32px'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <button
            onClick={() => router.push('/vendorcomplaint')}
            style={{
              width: '100%',
              padding: '14px',
              background: '#1db954',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Complaints
          </button>
          <button
            onClick={() => router.push('/vendorworks')}
            style={{
              width: '100%',
              padding: '14px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            My Works
          </button>
        </div>
      </div>
    </div>
  );
} 