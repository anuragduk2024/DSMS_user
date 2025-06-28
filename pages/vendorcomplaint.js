import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function VendorComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorUsername, setVendorUsername] = useState('');
  const [district, setDistrict] = useState('');
  const [panchayath, setPanchayath] = useState('');
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showDeleteAssignConfirm, setShowDeleteAssignConfirm] = useState(false);
  const [complaintToAction, setComplaintToAction] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchVendorComplaints();
  }, []);

  async function fetchVendorComplaints() {
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
      .select('district, panchayath, username')
      .eq('id', userId)
      .eq('user_role', 'vendor')
      .single();

    if (userError || !userData) {
      setLoading(false);
      return;
    }

    setVendorUsername(userData.username || '');
    setDistrict(userData.district || '');
    setPanchayath(userData.panchayath || '');

    // Fetch complaints for this district and panchayath
    const { data: complaintsData, error: complaintsError } = await supabase
      .from('complaints')
      .select('*')
      .eq('district', userData.district)
      .eq('panchayath', userData.panchayath);

    if (!complaintsError) {
      setComplaints(complaintsData || []);
      // Debug: Log the first complaint to see available fields
      if (complaintsData && complaintsData.length > 0) {
        console.log('Available fields in complaints table:', Object.keys(complaintsData[0]));
      }
    }
    setLoading(false);
  }

  const columns = complaints.length > 0 ? Object.keys(complaints[0]).filter(col => col !== 'vendor') : [];

  const handleAssignComplaint = async (complaintId) => {
    setComplaintToAction(complaintId);
    setShowAssignConfirm(true);
  };

  const confirmAssign = async () => {
    if (!complaintToAction) return;
    
    try {
      // Update the complaint with vendor username and assigned date
      const { error } = await supabase
        .from('complaints')
        .update({
          vendor: vendorUsername,
          vendor_assigned_date: new Date().toISOString() // Full timestamp with timezone
        })
        .eq('id', complaintToAction);

      if (error) {
        alert('Failed to assign complaint: ' + error.message);
        return;
      }

      // Refresh the complaints list to show updated data
      await fetchVendorComplaints();
      alert(`Complaint ${complaintToAction} assigned successfully!`);
    } catch (error) {
      console.error('Error assigning complaint:', error);
      alert('Failed to assign complaint. Please try again.');
    } finally {
      setShowAssignConfirm(false);
      setComplaintToAction(null);
    }
  };

  const cancelAssign = () => {
    setShowAssignConfirm(false);
    setComplaintToAction(null);
  };

  const handleCompleteComplaint = async (complaintId) => {
    setComplaintToAction(complaintId);
    setShowCompleteConfirm(true);
  };

  const confirmComplete = async () => {
    if (!complaintToAction) return;
    
    try {
      // Update the complaint status to completed and set completion date
      const { error } = await supabase
        .from('complaints')
        .update({
          status: 'completed',
          completed_date: new Date().toISOString() // Full timestamp with timezone
        })
        .eq('id', complaintToAction);

      if (error) {
        alert('Failed to complete complaint: ' + error.message);
        return;
      }

      // Refresh the complaints list to show updated data
      await fetchVendorComplaints();
      alert(`Complaint ${complaintToAction} marked as completed!`);
    } catch (error) {
      console.error('Error completing complaint:', error);
      alert('Failed to complete complaint. Please try again.');
    } finally {
      setShowCompleteConfirm(false);
      setComplaintToAction(null);
    }
  };

  const cancelComplete = () => {
    setShowCompleteConfirm(false);
    setComplaintToAction(null);
  };

  const handleDeleteAssignment = async (complaintId) => {
    setComplaintToAction(complaintId);
    setShowDeleteAssignConfirm(true);
  };

  const confirmDeleteAssignment = async () => {
    if (!complaintToAction) return;
    
    try {
      // Remove the vendor assignment and assigned date
      const { error } = await supabase
        .from('complaints')
        .update({
          vendor: null,
          vendor_assigned_date: null
        })
        .eq('id', complaintToAction);

      if (error) {
        alert('Failed to delete assignment: ' + error.message);
        return;
      }

      // Refresh the complaints list to show updated data
      await fetchVendorComplaints();
      alert(`Assignment removed successfully!`);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment. Please try again.');
    } finally {
      setShowDeleteAssignConfirm(false);
      setComplaintToAction(null);
    }
  };

  const cancelDeleteAssignment = () => {
    setShowDeleteAssignConfirm(false);
    setComplaintToAction(null);
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
          <h1 style={{fontSize:'1.2rem',fontWeight:'bold',color:'#1db954',marginBottom:'16px',textAlign:'center'}}>Complaints</h1>
          {loading ? (
            <div style={{textAlign:'center',color:'#888'}}>Loading...</div>
          ) : complaints.length === 0 ? (
            <div style={{textAlign:'center',color:'#888'}}>No complaints found.</div>
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
                    <th style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'center',fontSize:'0.8rem'}}>
                      ACTION
                    </th>
                    <th style={{padding:'8px 6px',borderBottom:'1px solid #ddd',textAlign:'center',fontSize:'0.8rem'}}>
                      REMOVE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((row, idx) => (
                    <tr key={idx} style={{borderBottom:'1px solid #eee'}}>
                      {columns.map(col => (
                        <td key={col} style={{padding:'8px 6px',fontSize:'0.8rem'}}>{row[col]}</td>
                      ))}
                      <td style={{padding:'8px 6px',textAlign:'center'}}>
                        <div style={{display:'flex',gap:'4px',justifyContent:'center'}}>
                          <button
                            onClick={() => handleAssignComplaint(row.id)}
                            disabled={row.vendor !== null && row.vendor !== undefined}
                            style={{
                              background: (row.vendor === null || row.vendor === undefined) ? '#1db954' : '#ccc',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontWeight: '600',
                              cursor: (row.vendor === null || row.vendor === undefined) ? 'pointer' : 'not-allowed',
                              fontSize: '0.75rem'
                            }}
                            onMouseOver={(e) => {
                              if (row.vendor === null || row.vendor === undefined) {
                                e.target.style.background = '#18a34b';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (row.vendor === null || row.vendor === undefined) {
                                e.target.style.background = '#1db954';
                              }
                            }}
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => handleCompleteComplaint(row.id)}
                            disabled={row.vendor !== vendorUsername || row.status === 'completed' || row.status === 'verified'}
                            style={{
                              background: (row.vendor === vendorUsername && row.status !== 'completed' && row.status !== 'verified') ? '#007bff' : '#ccc',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontWeight: '600',
                              cursor: (row.vendor === vendorUsername && row.status !== 'completed' && row.status !== 'verified') ? 'pointer' : 'not-allowed',
                              fontSize: '0.75rem'
                            }}
                            onMouseOver={(e) => {
                              if (row.vendor === vendorUsername && row.status !== 'completed' && row.status !== 'verified') {
                                e.target.style.background = '#0056b3';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (row.vendor === vendorUsername && row.status !== 'completed' && row.status !== 'verified') {
                                e.target.style.background = '#007bff';
                              }
                            }}
                          >
                            {row.status === 'verified' ? 'VERIFIED' : 'Complete'}
                          </button>
                        </div>
                      </td>
                      <td style={{padding:'8px 6px',textAlign:'center'}}>
                        <button
                          onClick={() => handleDeleteAssignment(row.id)}
                          disabled={row.vendor !== vendorUsername || row.status === 'completed' || row.status === 'verified'}
                          style={{
                            background: (row.vendor === vendorUsername && row.status !== 'completed' && row.status !== 'verified') ? '#dc3545' : '#ccc',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontWeight: '600',
                            cursor: (row.vendor === vendorUsername && row.status !== 'completed' && row.status !== 'verified') ? 'pointer' : 'not-allowed',
                            fontSize: '0.75rem'
                          }}
                          onMouseOver={(e) => {
                            if (row.vendor === vendorUsername && row.status !== 'completed' && row.status !== 'verified') {
                              e.target.style.background = '#c62828';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (row.vendor === vendorUsername && row.status !== 'completed' && row.status !== 'verified') {
                              e.target.style.background = '#dc3545';
                            }
                          }}
                        >
                          Remove
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
      
      {/* Assign Confirmation Modal */}
      {showAssignConfirm && (
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
              color: '#1db954',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Confirm Assignment
            </h3>
            <p style={{
              margin: '0 0 24px 0',
              color: '#666',
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              Are you sure you want to assign this complaint to yourself? You will be responsible for completing this work.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={cancelAssign}
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
                onClick={confirmAssign}
                style={{
                  background: '#1db954',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.background = '#18a34b'}
                onMouseOut={(e) => e.target.style.background = '#1db954'}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Confirmation Modal */}
      {showCompleteConfirm && (
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
              color: '#007bff',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Confirm Completion
            </h3>
            <p style={{
              margin: '0 0 24px 0',
              color: '#666',
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              Are you sure you want to mark this complaint as completed? This action will update the status and completion date.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={cancelComplete}
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
                onClick={confirmComplete}
                style={{
                  background: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.background = '#0056b3'}
                onMouseOut={(e) => e.target.style.background = '#007bff'}
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Assignment Confirmation Modal */}
      {showDeleteAssignConfirm && (
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
              color: '#dc3545',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Remove Assignment
            </h3>
            <p style={{
              margin: '0 0 24px 0',
              color: '#666',
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              Are you sure you want to remove your assignment from this complaint? This will clear the assigned date and make the complaint available for other vendors.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={cancelDeleteAssignment}
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
                onClick={confirmDeleteAssignment}
                style={{
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.background = '#c62828'}
                onMouseOut={(e) => e.target.style.background = '#dc3545'}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 