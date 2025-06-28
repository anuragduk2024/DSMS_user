import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUsername, setAdminUsername] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showVerifyConfirm, setShowVerifyConfirm] = useState(false);
  const [complaintToVerify, setComplaintToVerify] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchComplaints() {
      setLoading(true);
      let userId = '';
      if (typeof window !== 'undefined') {
        userId = localStorage.getItem('user_id') || '';
      }
      if (!userId) {
        setLoading(false);
        return;
      }

      // Fetch admin's district and panchayath
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('district, panchayath')
        .eq('id', userId)
        .eq('user_role', 'admin')
        .single();

      if (userError || !userData) {
        setLoading(false);
        return;
      }

      // Fetch complaints for this district and panchayath
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('district', userData.district)
        .eq('panchayath', userData.panchayath);
      setComplaints(data || []);
      setLoading(false);
    }
    fetchComplaints();
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(29, 185, 84);
    doc.text('Complaints List', 14, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Get all column names dynamically
    const columns = complaints.length > 0 ? Object.keys(complaints[0]) : ['id','user_id','post_number','issue_description','status','district','panchayath'];
    
    // Prepare table data
    const tableData = complaints.map(complaint => 
      columns.map(col => complaint[col])
    );
    
    // Add table
    autoTable(doc, {
      head: [columns.map(col => col.replace(/_/g, ' ').toUpperCase())],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 7,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [29, 185, 84],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 40, right: 14, bottom: 14, left: 14 }
    });
    
    doc.save('complaints_list.pdf');
    setShowExportDropdown(false);
  };

  const handleExportCSV = () => {
    const columns = complaints.length > 0 ? Object.keys(complaints[0]) : ['id','user_id','post_number','issue_description','status','district','panchayath'];
    
    const csvContent = [
      columns.map(col => col.replace(/_/g, ' ').toUpperCase()),
      ...complaints.map(complaint => 
        columns.map(col => complaint[col])
      )
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complaints_list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportDropdown(false);
  };

  const handleVerify = async (complaintId) => {
    setComplaintToVerify(complaintId);
    setShowVerifyConfirm(true);
  };

  const confirmVerify = async () => {
    if (!complaintToVerify) return;
    
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ 
          status: 'verified',
          admin_verified: new Date().toISOString()
        })
        .eq('id', complaintToVerify);
      
      if (error) {
        console.error('Error verifying complaint:', error);
        alert('Error verifying complaint');
        return;
      }
      
      // Update the local state
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint.id === complaintToVerify 
            ? { ...complaint, status: 'verified', admin_verified: new Date().toISOString() }
            : complaint
        )
      );
      
      alert('Complaint verified successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error verifying complaint');
    } finally {
      setShowVerifyConfirm(false);
      setComplaintToVerify(null);
    }
  };

  const cancelVerify = () => {
    setShowVerifyConfirm(false);
    setComplaintToVerify(null);
  };

  // Get all column names dynamically
  const columns = complaints.length > 0 ? Object.keys(complaints[0]) : ['id','user_id','post_number','issue_description','status','district','panchayath'];

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f5',padding:'5px 0'}}>
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

        <div style={{padding:'16px'}}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h1 style={{fontSize:'1.2rem',fontWeight:'bold',color:'#1db954',margin:0}}>Complaints List</h1>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                style={{
                  background: '#1db954',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
                onMouseOver={(e) => e.target.style.background = '#18a34b'}
                onMouseOut={(e) => e.target.style.background = '#1db954'}
              >
                Export
              </button>
              {showExportDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  minWidth: '100px'
                }}>
                  <button
                    onClick={handleExportPDF}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      textAlign: 'left',
                      borderBottom: '1px solid #eee'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                  >
                    PDF
                  </button>
                  <button
                    onClick={handleExportCSV}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                  >
                    CSV
                  </button>
                </div>
              )}
            </div>
          </div>
          {loading ? (
            <div style={{textAlign:'center',color:'#888'}}>Loading...</div>
          ) : (
            <div style={{
              overflowX: 'auto',
              borderRadius: '8px',
              border: '1px solid #eee'
            }}>
              <table style={{
                width: '100%',
                minWidth: '600px',
                borderCollapse: 'collapse',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{background:'#f5f5f5'}}>
                    {columns.map(col => (
                      <th key={col} style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'left',fontSize:'0.8rem'}}>
                        {col.replace(/_/g, ' ').toUpperCase()}
                      </th>
                    ))}
                    <th style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'center',fontSize:'0.8rem'}}>
                      VERIFY
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr><td colSpan={columns.length + 1} style={{textAlign:'center',color:'#888',padding:'16px'}}>No complaints found.</td></tr>
                  ) : (
                    complaints.map((row, idx) => (
                      <tr key={row.id || idx} style={{borderBottom:'1px solid #eee'}}>
                        {columns.map(col => (
                          <td key={col} style={{padding:'8px 6px',fontSize:'0.8rem'}}>{row[col]}</td>
                        ))}
                        <td style={{padding:'8px 6px',textAlign:'center'}}>
                          {row.status === 'verified' ? (
                            <span style={{
                              background: '#28a745',
                              color: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: '600'
                            }}>
                              VERIFIED
                            </span>
                          ) : row.vendor && row.completed_date ? (
                            <button
                              onClick={() => handleVerify(row.id)}
                              disabled={row.status === 'verified'}
                              style={{
                                background: row.status === 'verified' ? '#6c757d' : '#1db954',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                cursor: row.status === 'verified' ? 'not-allowed' : 'pointer',
                                opacity: row.status === 'verified' ? 0.6 : 1
                              }}
                              onMouseOver={(e) => {
                                if (row.status !== 'verified') {
                                  e.target.style.background = '#18a34b';
                                }
                              }}
                              onMouseOut={(e) => {
                                if (row.status !== 'verified') {
                                  e.target.style.background = '#1db954';
                                }
                              }}
                            >
                              {row.status === 'verified' ? 'VERIFIED' : 'Verify'}
                            </button>
                          ) : (
                            <span style={{
                              background: !row.vendor ? '#dc3545' : '#ffc107',
                              color: !row.vendor ? '#fff' : '#000',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: '600'
                            }}>
                              {!row.vendor ? 'NO VENDOR' : 'NOT COMPLETED'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Verify Confirmation Modal */}
      {showVerifyConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '320px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              color: '#28a745',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Confirm Verification
            </h3>
            <p style={{
              margin: '0 0 24px 0',
              color: '#666',
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              Are you sure you want to verify this complaint? This action will mark the complaint as verified and cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={cancelVerify}
                style={{
                  background: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.background = '#5a6268'}
                onMouseOut={(e) => e.target.style.background = '#6c757d'}
              >
                Cancel
              </button>
              <button
                onClick={confirmVerify}
                style={{
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.background = '#218838'}
                onMouseOut={(e) => e.target.style.background = '#28a745'}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 