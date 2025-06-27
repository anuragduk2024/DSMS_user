import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('id, email, phone_number, username, password, registered_date, district, panchayath')
      .eq('user_role', 'vendor');
    if (error) {
      console.error('Supabase error:', error);
    }
    setVendors(data || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    setDeletingId(id);
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    setDeletingId(null);
    if (error) {
      alert('Failed to delete vendor: ' + error.message);
    } else {
      fetchVendors();
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f5',padding:'40px 0'}}>
      <div style={{maxWidth:'950px',margin:'0 auto',background:'#fff',borderRadius:'16px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)',padding:'32px'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:'bold',color:'#1db954',marginBottom:'24px',textAlign:'center'}}>Vendor Lists</h1>
        {loading ? (
          <div style={{textAlign:'center',color:'#888'}}>Loading...</div>
        ) : vendors.length === 0 ? (
          <div style={{textAlign:'center',color:'#888'}}>No vendors found.</div>
        ) : (
          <table style={{width:'100%',borderCollapse:'collapse',marginTop:'12px',fontSize:'0.98rem'}}>
            <thead>
              <tr style={{background:'#f5f5f5'}}>
                <th style={{padding:'10px',borderBottom:'1px solid #ddd',textAlign:'left'}}>Email</th>
                <th style={{padding:'10px',borderBottom:'1px solid #ddd',textAlign:'left'}}>Phone Number</th>
                <th style={{padding:'10px',borderBottom:'1px solid #ddd',textAlign:'left'}}>Username</th>
                <th style={{padding:'10px',borderBottom:'1px solid #ddd',textAlign:'left'}}>Password</th>
                <th style={{padding:'10px',borderBottom:'1px solid #ddd',textAlign:'left'}}>Registered Date</th>
                <th style={{padding:'10px',borderBottom:'1px solid #ddd',textAlign:'left'}}>District</th>
                <th style={{padding:'10px',borderBottom:'1px solid #ddd',textAlign:'left'}}>Panchayath</th>
                <th style={{padding:'10px',borderBottom:'1px solid #ddd',textAlign:'center'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v, idx) => (
                <tr key={v.id || idx} style={{borderBottom:'1px solid #eee'}}>
                  <td style={{padding:'10px'}}>{v.email}</td>
                  <td style={{padding:'10px'}}>{v.phone_number}</td>
                  <td style={{padding:'10px'}}>{v.username}</td>
                  <td style={{padding:'10px'}}>{v.password}</td>
                  <td style={{padding:'10px'}}>{v.registered_date}</td>
                  <td style={{padding:'10px'}}>{v.district}</td>
                  <td style={{padding:'10px'}}>{v.panchayath}</td>
                  <td style={{padding:'10px',textAlign:'center'}}>
                    <button
                      onClick={() => handleDelete(v.id)}
                      disabled={deletingId === v.id}
                      style={{background:'#d32f2f',color:'#fff',border:'none',borderRadius:'6px',padding:'6px 14px',fontWeight:'bold',cursor:'pointer'}}
                    >
                      {deletingId === v.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 