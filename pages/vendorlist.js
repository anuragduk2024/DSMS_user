import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [adminUsername, setAdminUsername] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchVendors();
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
    setVendorToDelete(id);
    setShowDeleteConfirm(true);
  }

  async function confirmDelete() {
    if (!vendorToDelete) return;
    
    setDeletingId(vendorToDelete);
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', vendorToDelete);
    setDeletingId(null);
    setShowDeleteConfirm(false);
    setVendorToDelete(null);
    
    if (error) {
      alert('Failed to delete vendor: ' + error.message);
    } else {
      fetchVendors();
    }
  }

  function cancelDelete() {
    setShowDeleteConfirm(false);
    setVendorToDelete(null);
  }

  const handleExportPDF = () => {
    // PDF export functionality
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(29, 185, 84); // Green color
    doc.text('Vendor Lists', 14, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Prepare table data
    const tableData = vendors.map(v => [
      v.email,
      v.phone_number,
      v.username,
      v.password,
      v.registered_date,
      v.district,
      v.panchayath
    ]);
    
    // Add table
    autoTable(doc, {
      head: [['Email', 'Phone', 'Username', 'Password', 'Date', 'District', 'Panchayath']],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [29, 185, 84], // Green header
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 40, right: 14, bottom: 14, left: 14 },
      columnStyles: {
        0: { cellWidth: 40 }, // Email
        1: { cellWidth: 25 }, // Phone
        2: { cellWidth: 25 }, // Username
        3: { cellWidth: 25 }, // Password
        4: { cellWidth: 25 }, // Date
        5: { cellWidth: 25 }, // District
        6: { cellWidth: 25 }  // Panchayath
      }
    });
    
    // Save the PDF
    doc.save('vendor_list.pdf');
    setShowExportDropdown(false);
  };

  const handleExportCSV = () => {
    // CSV export functionality
    const csvContent = [
      ['Email', 'Phone', 'Username', 'Password', 'Date', 'District', 'Panchayath'],
      ...vendors.map(v => [
        v.email,
        v.phone_number,
        v.username,
        v.password,
        v.registered_date,
        v.district,
        v.panchayath
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendor_list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportDropdown(false);
  };

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
            <h1 style={{fontSize:'1.2rem',fontWeight:'bold',color:'#1db954',margin:0}}>Vendor Lists</h1>
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
          ) : vendors.length === 0 ? (
            <div style={{textAlign:'center',color:'#888'}}>No vendors found.</div>
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
                    <th style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'left',fontSize:'0.8rem'}}>Email</th>
                    <th style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'left',fontSize:'0.8rem'}}>Phone</th>
                    <th style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'left',fontSize:'0.8rem'}}>Username</th>
                    <th style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'left',fontSize:'0.8rem'}}>Password</th>
                    <th style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'left',fontSize:'0.8rem'}}>Date</th>
                    <th style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'left',fontSize:'0.8rem'}}>District</th>
                    <th style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'left',fontSize:'0.8rem'}}>Panchayath</th>
                    <th style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'center',fontSize:'0.8rem'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v, idx) => (
                    <tr key={v.id || idx} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'8px 6px',fontSize:'0.8rem'}}>{v.email}</td>
                      <td style={{padding:'8px 6px',fontSize:'0.8rem'}}>{v.phone_number}</td>
                      <td style={{padding:'8px 6px',fontSize:'0.8rem'}}>{v.username}</td>
                      <td style={{padding:'8px 6px',fontSize:'0.8rem'}}>{v.password}</td>
                      <td style={{padding:'8px 6px',fontSize:'0.8rem'}}>{v.registered_date}</td>
                      <td style={{padding:'8px 6px',fontSize:'0.8rem'}}>{v.district}</td>
                      <td style={{padding:'8px 6px',fontSize:'0.8rem'}}>{v.panchayath}</td>
                      <td style={{padding:'8px 6px',textAlign:'center'}}>
                        <button
                          onClick={() => handleDelete(v.id)}
                          disabled={deletingId === v.id}
                          style={{
                            background:'#d32f2f',
                            color:'#fff',
                            border:'none',
                            borderRadius:'4px',
                            padding:'4px 8px',
                            fontWeight:'bold',
                            cursor:'pointer',
                            fontSize:'0.75rem'
                          }}
                        >
                          {deletingId === v.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
              color: '#d32f2f',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Confirm Delete
            </h3>
            <p style={{
              margin: '0 0 24px 0',
              color: '#666',
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              Are you sure you want to delete this vendor? This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={cancelDelete}
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
                onClick={confirmDelete}
                disabled={deletingId === vendorToDelete}
                style={{
                  background: deletingId === vendorToDelete ? '#6c757d' : '#d32f2f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: deletingId === vendorToDelete ? 'not-allowed' : 'pointer',
                  opacity: deletingId === vendorToDelete ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (deletingId !== vendorToDelete) {
                    e.target.style.background = '#c62828';
                  }
                }}
                onMouseOut={(e) => {
                  if (deletingId !== vendorToDelete) {
                    e.target.style.background = '#d32f2f';
                  }
                }}
              >
                {deletingId === vendorToDelete ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 