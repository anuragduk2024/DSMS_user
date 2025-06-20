import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';

function formatDropdownText(text) {
  return text
    .split(' ')
    .map(word => word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : '')
    .join(' ');
}

const POST_NUMBERS = [
  'P001', 'P002', 'P003', 'P004', 'P005', 'P006', 'P007', 'P008', 'P009', 'P010'
];

export default function ThirdPage() {
  const [showServices, setShowServices] = useState(false);
  const [showStreetLightModal, setShowStreetLightModal] = useState(false);
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showEnterComplaint, setShowEnterComplaint] = useState(false);
  const [postNumber, setPostNumber] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Fetch complaints from Firestore
  useEffect(() => {
    setUpdatesLoading(true);
    // Get current user info from localStorage
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '';
    const userPhone = typeof window !== 'undefined' ? localStorage.getItem('userPhone') : '';
    const unsub = onSnapshot(collection(db, 'complaints'), (snapshot) => {
      setUpdates(
        snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(row => row.email === userEmail && row.phone === userPhone)
      );
      setUpdatesLoading(false);
    });
    return () => unsub();
  }, []);

  const handleServicesClick = () => {
    setShowServices(v => !v);
  };
  const handleUpdatesClick = () => {
    setShowUpdatesModal(true);
  };
  const handleStreetLightClick = () => {
    setShowStreetLightModal(true);
    setShowServices(false);
    setShowEnterComplaint(false);
    setPostNumber('');
    setRegisterError('');
  };
  const handleCloseModal = () => {
    setShowStreetLightModal(false);
    setShowUpdatesModal(false);
    setShowEnterComplaint(false);
    setPostNumber('');
    setRegisterError('');
  };

  // Show input for entering complaint
  const handleEnterComplaintClick = () => {
    setShowEnterComplaint(true);
    setPostNumber('');
    setRegisterError('');
  };

  // Register a new complaint with post number
  const handleRegisterComplaint = async (e) => {
    e.preventDefault();
    if (!postNumber.trim()) {
      setRegisterError('Please enter a post number');
      return;
    }
    setRegistering(true);
    // Get user info from localStorage
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '';
    const userPhone = typeof window !== 'undefined' ? localStorage.getItem('userPhone') : '';
    // Get location info from localStorage
    const selectedState = typeof window !== 'undefined' ? localStorage.getItem('selectedState') : '';
    const selectedDistrict = typeof window !== 'undefined' ? localStorage.getItem('selectedDistrict') : '';
    const selectedPanchayath = typeof window !== 'undefined' ? localStorage.getItem('selectedPanchayath') : '';
    const selectedWard = typeof window !== 'undefined' ? localStorage.getItem('selectedWard') : '';
    await addDoc(collection(db, 'complaints'), {
      number: postNumber.trim(),
      regDate: new Date().toISOString(),
      update: 'Registered',
      compDate: '',
      approved: false,
      email: userEmail || '',
      phone: userPhone || '',
      state: selectedState || '',
      district: selectedDistrict || '',
      panchayath: selectedPanchayath || '',
      ward: selectedWard || ''
    });
    setShowEnterComplaint(false);
    setShowStreetLightModal(false);
    setPostNumber('');
    setRegisterError('');
    setRegistering(false);
  };

  // Approve a complaint
  const handleApprove = async (id) => {
    setUpdatesLoading(true);
    const complaintRef = doc(db, 'complaints', id);
    await updateDoc(complaintRef, { approved: true });
    setUpdatesLoading(false);
  };

  // Delete a complaint
  const handleDelete = async (id) => {
    setUpdatesLoading(true);
    await deleteDoc(doc(db, 'complaints', id));
    setUpdatesLoading(false);
  };

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',height:'100%',width:'100%'}}>
      <div style={{width:'100%',maxWidth:'390px',display:'flex',flexDirection:'row',justifyContent:'space-between',gap:'12px',padding:'18px 0 10px 0',position:'relative'}}>
        <div style={{flex:1,position:'relative'}}>
          <button style={{width:'100%',padding:'14px 0',fontSize:'1.1rem',fontWeight:'500',background:'#1db954',color:'#fff',border:'none',borderRadius:'12px',cursor:'pointer'}} onClick={handleServicesClick}>
            Services
          </button>
          {showServices && (
            <div style={{position:'absolute',top:'110%',left:0,right:0,background:'rgba(255,255,255,0.85)',border:'1px solid #1db954',borderRadius:'12px',boxShadow:'0 4px 16px rgba(0,0,0,0.08)',zIndex:10}}>
              <div style={{padding:'12px 18px',fontSize:'1rem',color:'#1db954',cursor:'pointer',borderBottom:'1px solid #f0f0f0',fontWeight:'bold'}} onClick={handleStreetLightClick}>{formatDropdownText('STREET LIGHT')}</div>
              <div style={{padding:'12px 18px',fontSize:'1rem',color:'#1db954',cursor:'pointer',fontWeight:'bold'}}>{formatDropdownText('-OTHER-')}</div>
            </div>
          )}
        </div>
        <div style={{flex:1,position:'relative'}}>
          <button style={{width:'100%',padding:'14px 0',fontSize:'1.1rem',fontWeight:'500',background:'#f5f5f5',color:'#1db954',border:'1px solid #1db954',borderRadius:'12px',cursor:'pointer'}} onClick={handleUpdatesClick}>
            Updates
          </button>
        </div>
      </div>
      <div style={{width:'100%',maxWidth:'390px',flex:'1 1 0',height:'100%',display:'flex'}}>
        <iframe
          src="https://map.opendatakerala.org/thiruvananthapuram/mangalapuram-grama-panchayat/"
          title="Mangalapuram Map"
          width="100%"
          height="100%"
          style={{border: 'none', minHeight:0, flex:1}}
          allowFullScreen
        ></iframe>
      </div>
      {showStreetLightModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'18px',boxShadow:'0 4px 24px rgba(0,0,0,0.18)',padding:'28px 18px 18px 18px',width:'90%',maxWidth:'340px',display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
            <button onClick={handleCloseModal} style={{position:'absolute',top:10,right:14,background:'none',border:'none',fontSize:'1.5rem',color:'#888',cursor:'pointer'}}>&times;</button>
            <div style={{fontWeight:'bold',fontSize:'1.1rem',marginBottom:'18px',textAlign:'center'}}>Click any one option to register the complaint</div>
            {!showEnterComplaint ? (
              <button style={{width:'100%',padding:'12px 0',marginBottom:'12px',fontSize:'1rem',fontWeight:'500',background:'#f5f5f5',color:'#1db954',border:'1px solid #1db954',borderRadius:'10px',cursor:'pointer'}} onClick={handleEnterComplaintClick}>Enter Complaint</button>
            ) : (
              <form onSubmit={handleRegisterComplaint} style={{width:'100%'}}>
                <label style={{display:'block',marginBottom:'6px',fontWeight:'500'}}>Enter post number</label>
                <input
                  type="text"
                  value={postNumber}
                  onChange={e => setPostNumber(e.target.value)}
                  placeholder="Enter post number"
                  style={{width:'100%',padding:'10px',marginBottom:'12px',fontSize:'1rem',borderRadius:'8px',border:'1px solid #ccc'}}
                  required
                />
                <button type="submit" style={{width:'100%',padding:'12px 0',marginBottom:'12px',fontSize:'1rem',fontWeight:'500',background:'#1db954',color:'#fff',border:'none',borderRadius:'10px',cursor:'pointer'}}>Done</button>
                {registerError && <div style={{color:'#d32f2f',marginBottom:'8px',textAlign:'center'}}>{registerError}</div>}
              </form>
            )}
            <button style={{width:'100%',padding:'12px 0',marginBottom:'12px',fontSize:'1rem',fontWeight:'500',background:'#f5f5f5',color:'#1db954',border:'1px solid #1db954',borderRadius:'10px',cursor:'pointer'}}>Upload Photo (Optional)</button>
            <button style={{width:'100%',padding:'12px 0',fontSize:'1rem',fontWeight:'500',background:'#f5f5f5',color:'#1db954',border:'1px solid #1db954',borderRadius:'10px',cursor:'pointer'}}>Posts Near Me (Location)</button>
            {registering && <div style={{marginTop:'10px',color:'#888'}}>Registering...</div>}
          </div>
        </div>
      )}
      {showUpdatesModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'18px',boxShadow:'0 4px 24px rgba(0,0,0,0.18)',padding:'24px 10px 18px 10px',width:'96%',maxWidth:'370px',display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
            <button onClick={handleCloseModal} style={{position:'absolute',top:10,right:14,background:'none',border:'none',fontSize:'1.5rem',color:'#888',cursor:'pointer'}}>&times;</button>
            <div style={{fontWeight:'bold',fontSize:'1.1rem',marginBottom:'18px',textAlign:'center'}}>Updates</div>
            <div style={{overflowX:'auto',width:'100%'}}>
              {updatesLoading && <div style={{marginBottom:'10px',color:'#888'}}>Loading...</div>}
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.98rem'}}>
                <thead>
                  <tr style={{background:'#f5f5f5'}}>
                    <th style={{padding:'8px',fontWeight:'bold',borderBottom:'1px solid #ddd'}}>Complaint number</th>
                    <th style={{padding:'8px',fontWeight:'bold',borderBottom:'1px solid #ddd'}}>Registered date</th>
                    <th style={{padding:'8px',fontWeight:'bold',borderBottom:'1px solid #ddd'}}>Update</th>
                    <th style={{padding:'8px',fontWeight:'bold',borderBottom:'1px solid #ddd'}}>Completed date</th>
                    <th style={{padding:'8px',fontWeight:'bold',borderBottom:'1px solid #ddd'}}>Approval</th>
                    <th style={{padding:'8px',fontWeight:'bold',borderBottom:'1px solid #ddd'}}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {updates.map((row, idx) => (
                    <tr key={row.id} style={{background: idx%2 ? '#fafafa' : '#fff'}}>
                      <td style={{padding:'8px',textAlign:'center'}}>{row.number}</td>
                      <td style={{padding:'8px',textAlign:'center'}}>{row.regDate}</td>
                      <td style={{padding:'8px',textAlign:'center'}}>{row.update}</td>
                      <td style={{padding:'8px',textAlign:'center'}}>{row.compDate}</td>
                      <td style={{padding:'8px',textAlign:'center'}}>
                        <button disabled={row.approved} onClick={()=>handleApprove(row.id)} style={{padding:'6px 12px',borderRadius:'8px',border:'none',background:row.approved?'#bdbdbd':'#1db954',color:'#fff',fontWeight:'bold',cursor:row.approved?'not-allowed':'pointer'}}>
                          {row.approved ? 'Approved' : 'Approve'}
                        </button>
                      </td>
                      <td style={{padding:'8px',textAlign:'center'}}>
                        <button onClick={()=>handleDelete(row.id)} style={{padding:'6px 12px',borderRadius:'8px',border:'none',background:'#d32f2f',color:'#fff',fontWeight:'bold',cursor:'pointer'}}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 