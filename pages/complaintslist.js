import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComplaints() {
      setLoading(true);
      const { data, error } = await supabase.from('complaints').select('*');
      setComplaints(data || []);
      setLoading(false);
    }
    fetchComplaints();
  }, []);

  // Get all column names dynamically
  const columns = complaints.length > 0 ? Object.keys(complaints[0]) : ['id','user_id','post_number','issue_description','status','district','panchayath'];

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f5',padding:'40px 0'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto',background:'#fff',borderRadius:'16px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)',padding:'32px'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:'bold',color:'#1db954',marginBottom:'24px',textAlign:'center'}}>Complaints List</h1>
        {loading ? (
          <div style={{textAlign:'center',color:'#888'}}>Loading...</div>
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
              {complaints.length === 0 ? (
                <tr><td colSpan={columns.length} style={{textAlign:'center',color:'#888',padding:'16px'}}>No complaints found.</td></tr>
              ) : (
                complaints.map((row, idx) => (
                  <tr key={row.id || idx} style={{borderBottom:'1px solid #eee'}}>
                    {columns.map(col => (
                      <td key={col} style={{padding:'10px'}}>{row[col]}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 