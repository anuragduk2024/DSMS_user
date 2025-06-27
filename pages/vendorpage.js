import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function VendorPage() {
  const [district, setDistrict] = useState('');
  const [panchayath, setPanchayath] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendorInfoAndComplaints() {
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
        .select('district, panchayath')
        .eq('id', userId)
        .single();
      if (userError || !userData) {
        setLoading(false);
        return;
      }
      setDistrict(userData.district || '');
      setPanchayath(userData.panchayath || '');
      // Fetch complaints for this district and panchayath
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('complaints')
        .select('*')
        .eq('district', userData.district)
        .eq('panchayath', userData.panchayath);
      if (!complaintsError) setComplaints(complaintsData || []);
      setLoading(false);
    }
    fetchVendorInfoAndComplaints();
  }, []);

  const columns = complaints.length > 0 ? Object.keys(complaints[0]) : [];

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f5',margin:'0',padding:'0'}}>
      <div style={{width:'100%',background:'#1db954',padding:'32px 0 18px 0',borderRadius:'0 0 16px 16px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)',textAlign:'center'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:'bold',color:'#fff',margin:0}}>Vendor Page</h1>
      </div>
      <div style={{maxWidth:'1100px',margin:'32px auto 0 auto',background:'#fff',borderRadius:'16px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)',padding:'32px'}}>
        <h2 style={{fontSize:'1.2rem',fontWeight:'bold',color:'#1db954',marginBottom:'18px',textAlign:'center'}}>Complaints for {district} / {panchayath}</h2>
        {loading ? (
          <div style={{textAlign:'center',color:'#888'}}>Loading...</div>
        ) : complaints.length === 0 ? (
          <div style={{textAlign:'center',color:'#888'}}>No complaints found.</div>
        ) : (
          <table style={{width:'100%',borderCollapse:'collapse',marginTop:'12px',fontSize:'0.98rem'}}>
            <thead>
              <tr style={{background:'#f5f5f5'}}>
                {columns.map(col => (
                  <th key={col} style={{padding:'10px',borderBottom:'1px solid #ddd',textAlign:'left'}}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints.map((row, idx) => (
                <tr key={idx} style={{borderBottom:'1px solid #eee'}}>
                  {columns.map(col => (
                    <td key={col} style={{padding:'10px'}}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 