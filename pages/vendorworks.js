import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function VendorWorks() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorUsername, setVendorUsername] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchVendorWorks();
  }, []);

  async function fetchVendorWorks() {
    setLoading(true);
    let userId = '';
    if (typeof window !== 'undefined') {
      userId = localStorage.getItem('user_id') || '';
    }
    if (!userId) {
      setLoading(false);
      return;
    }

    // Fetch vendor's info
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .eq('user_role', 'vendor')
      .single();

    if (userError || !userData) {
      setLoading(false);
      return;
    }

    setVendorUsername(userData.username || '');

    // Fetch complaints assigned to this vendor
    const { data: complaintsData, error: complaintsError } = await supabase
      .from('complaints')
      .select('*')
      .eq('vendor', userData.username);

    if (!complaintsError) {
      setComplaints(complaintsData || []);
      // Debug: Log the first complaint to see available fields
      if (complaintsData && complaintsData.length > 0) {
        console.log('Available fields in vendor works:', Object.keys(complaintsData[0]));
      }
    }
    setLoading(false);
  }

  const columns = complaints.length > 0 ? Object.keys(complaints[0]).filter(col => col !== 'vendor') : [];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(29, 185, 84);
    doc.text('My Works - Vendor Complaints', 14, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Get all column names dynamically
    const columns = complaints.length > 0 ? Object.keys(complaints[0]).filter(col => col !== 'vendor') : [];
    
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
    
    doc.save('vendor_works.pdf');
    setShowExportDropdown(false);
  };

  const handleExportCSV = () => {
    const columns = complaints.length > 0 ? Object.keys(complaints[0]).filter(col => col !== 'vendor') : [];
    
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
    a.download = 'vendor_works.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportDropdown(false);
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
          onClick={() => router.push('/vendorpage')}
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
            {vendorUsername || 'Vendor'}
          </div>
        </div>

        <div style={{padding:'16px'}}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h1 style={{fontSize:'1.2rem',fontWeight:'bold',color:'#1db954',margin:0}}>My Works</h1>
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
          ) : complaints.length === 0 ? (
            <div style={{textAlign:'center',color:'#888'}}>No assigned complaints found.</div>
          ) : (
            <div style={{
              overflowX: 'auto',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 200px)',
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
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((row, idx) => (
                    <tr key={idx} style={{borderBottom:'1px solid #eee'}}>
                      {columns.map(col => (
                        <td key={col} style={{padding:'8px 6px',fontSize:'0.8rem'}}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 