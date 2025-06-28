import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function AdminPortal() {
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);
  const [showStreetlightList, setShowStreetlightList] = useState(false);
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [vendorUsername, setVendorUsername] = useState('');
  const [vendorPassword, setVendorPassword] = useState('');
  const [vendorDistrict, setVendorDistrict] = useState('');
  const [vendorPanchayath, setVendorPanchayath] = useState('');
  const [vendorMessage, setVendorMessage] = useState('');
  const [vendorLoading, setVendorLoading] = useState(false);
  const [districtMap, setDistrictMap] = useState({});
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminUsername, setAdminUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/district_localbody_mapping.json')
      .then(res => res.json())
      .then(data => setDistrictMap(data));
    // Fetch admin's district and panchayath from users table
    async function fetchAdminDistrictPanchayath() {
      setAdminLoading(true);
      let userId = '';
      if (typeof window !== 'undefined') {
        userId = localStorage.getItem('user_id') || '';
      }
      if (!userId) {
        setAdminLoading(false);
        return;
      }
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('district, panchayath, username')
        .eq('id', userId)
        .eq('user_role', 'admin')
        .single();
      if (userError || !userData) {
        setAdminLoading(false);
        setVendorDistrict('');
        setVendorPanchayath('');
        return;
      }
      setVendorDistrict(userData.district || '');
      setVendorPanchayath(userData.panchayath || '');
      setAdminUsername(userData.username || '');
      setAdminLoading(false);
    }
    fetchAdminDistrictPanchayath();
  }, []);

  const districtOptions = Object.keys(districtMap);
  const panchayathOptions = vendorDistrict && districtMap[vendorDistrict]
    ? districtMap[vendorDistrict].map(lb => lb.LocalBody)
    : [];

  const handleAddVendor = async (e) => {
    e.preventDefault();
    setVendorLoading(true);
    setVendorMessage('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: vendorEmail,
        username: vendorUsername,
        password: vendorPassword,
        phone_number: vendorPhone,
        district: vendorDistrict,
        panchayath: vendorPanchayath,
        user_role: 'vendor'
      })
    });
    const data = await res.json();
    setVendorLoading(false);
    if (res.ok) {
      setVendorMessage('Vendor added successfully!');
      setVendorEmail('');
      setVendorPhone('');
      setVendorUsername('');
      setVendorPassword('');
      setShowVendorForm(false);
    } else {
      setVendorMessage(data.error || 'Failed to add vendor.');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_id');
      localStorage.removeItem('selectedDistrict');
      localStorage.removeItem('selectedPanchayath');
    }
    router.push('/');
  };

  const boxStyle = {
    width: '100%',
    maxWidth: '400px',
    background: '#fff',
    borderRadius: '14px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: '28px 18px',
    marginBottom: '8px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  const headingStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '18px',
    color: '#1db954',
    textAlign: 'center',
    width: '100%',
  };
  const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: '#1db954',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '0',
  };
  const contentStyle = {
    width: '100%',
    color: '#888',
    textAlign: 'center',
    marginTop: '16px',
  };

  return (
    <div style={{
      minHeight:'100vh',
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      background:'#f5f5f5',
      overflow: 'hidden',
      width: '100%'
    }}>
      <div style={{width:'100%',display:'flex',justifyContent:'center',marginTop:'0',marginBottom:'16px'}}>
        <div style={{width:'100%',maxWidth:'390px',background:'#1db954',padding:'18px 32px',borderRadius:'14px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)'}}>
          <h1 style={{fontSize:'1.3rem',fontWeight:'bold',color:'#fff',margin:0,textAlign:'center'}}>ADMIN PORTAL</h1>
        </div>
      </div>
      
      {/* Info Boxes */}
      <div style={{
        width: '100%',
        maxWidth: '390px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        margin: '0 auto 16px auto'
      }}>
        {/* District Box */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '16px 12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            District
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#666',
            fontWeight: '500'
          }}>
            {vendorDistrict || 'Not set'}
          </div>
        </div>

        {/* Username Box */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '16px 12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Username
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#666',
            fontWeight: '500'
          }}>
            {adminUsername || 'Not set'}
          </div>
        </div>

        {/* Panchayath Box */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '16px 12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Panchayath
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#666',
            fontWeight: '500'
          }}>
            {vendorPanchayath || 'Not set'}
          </div>
        </div>

        {/* Logout Box */}
        <div style={{
          background: '#dc3545',
          borderRadius: '12px',
          padding: '16px 12px',
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
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#fff'
          }}>
            Logout
          </div>
        </div>
      </div>
      {/* Add Vendor Box */}
      <div style={boxStyle}>
        {!showVendorForm ? (
          <button
            onClick={() => { setShowVendorForm(true); setShowComplaints(false); setShowStreetlightList(false); }}
            style={buttonStyle}
          >
            Add Vendor
          </button>
        ) : (
          <form onSubmit={handleAddVendor} style={{width:'100%'}}>
            <input
              type="email"
              value={vendorEmail}
              onChange={e => setVendorEmail(e.target.value)}
              placeholder="Email"
              required
              style={{width:'100%',padding:'10px',marginBottom:'10px',borderRadius:'8px',border:'1px solid #ccc'}}
            />
            <input
              type="tel"
              value={vendorPhone}
              onChange={e => setVendorPhone(e.target.value)}
              placeholder="Phone Number"
              required
              style={{width:'100%',padding:'10px',marginBottom:'10px',borderRadius:'8px',border:'1px solid #ccc'}}
            />
            <input
              type="text"
              value={vendorUsername}
              onChange={e => setVendorUsername(e.target.value)}
              placeholder="User ID"
              required
              style={{width:'100%',padding:'10px',marginBottom:'10px',borderRadius:'8px',border:'1px solid #ccc'}}
            />
            <input
              type="password"
              value={vendorPassword}
              onChange={e => setVendorPassword(e.target.value)}
              placeholder="Password"
              required
              style={{width:'100%',padding:'10px',marginBottom:'10px',borderRadius:'8px',border:'1px solid #ccc'}}
            />
            <input
              type="text"
              value={vendorDistrict}
              readOnly
              placeholder="District"
              style={{width:'100%',padding:'10px',marginBottom:'10px',borderRadius:'8px',border:'1px solid #ccc',background:'#f5f5f5',color:'#888'}}
            />
            <input
              type="text"
              value={vendorPanchayath}
              readOnly
              placeholder="Panchayath"
              style={{width:'100%',padding:'10px',marginBottom:'10px',borderRadius:'8px',border:'1px solid #ccc',background:'#f5f5f5',color:'#888'}}
            />
            <button
              type="submit"
              disabled={vendorLoading}
              style={buttonStyle}
            >
              {vendorLoading ? 'Adding...' : 'Add Vendor'}
            </button>
            <button
              type="button"
              onClick={() => setShowVendorForm(false)}
              style={{width:'100%',padding:'12px',marginTop:'8px',background:'#eee',color:'#333',border:'none',borderRadius:'8px',fontWeight:'bold',fontSize:'1rem',cursor:'pointer'}}
            >
              Cancel
            </button>
          </form>
        )}
        {vendorMessage && (
          <div style={{marginTop:'12px',textAlign:'center',color: vendorMessage.includes('success') ? '#1db954' : '#d32f2f'}}>{vendorMessage}</div>
        )}
      </div>
      {/* Vendor List Box */}
      <div style={boxStyle}>
        <button
          onClick={() => router.push('/vendorlist')}
          style={buttonStyle}
        >
          Vendor List
        </button>
      </div>
      {/* Complaints Box */}
      <div style={boxStyle}>
        <button
          onClick={() => router.push('/complaintslist')}
          style={buttonStyle}
        >
          Complaints
        </button>
      </div>
      {/* Streetlight List Box */}
      <div style={boxStyle}>
        <button
          onClick={() => router.push('/streetlightlist')}
          style={buttonStyle}
        >
          Streetlight List
        </button>
      </div>
      {/* Map Box */}
      <div style={boxStyle}>
        <button
          onClick={() => router.push('/adminmap')}
          style={buttonStyle}
        >
          Map
        </button>
      </div>
    </div>
  );
} 