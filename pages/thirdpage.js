import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const [showServices, setShowServices] = useState(false);
  const [showStreetLightModal, setShowStreetLightModal] = useState(false);
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showEnterComplaint, setShowEnterComplaint] = useState(false);
  const [postNumber, setPostNumber] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Registration form state
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');

  const [districtMap, setDistrictMap] = useState({});
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedPanchayath, setSelectedPanchayath] = useState('');
  const [localBodyUrl, setLocalBodyUrl] = useState('');
  const [username, setUsername] = useState('');

  const [postNumberSuggestions, setPostNumberSuggestions] = useState([]);
  const [allPostNumbers, setAllPostNumbers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch('/district_localbody_mapping.json')
      .then(res => res.json())
      .then(data => setDistrictMap(data));
  }, []);

  useEffect(() => {
    // Get selected district and panchayath from localStorage
    const district = typeof window !== 'undefined' ? localStorage.getItem('selectedDistrict') : '';
    const panchayath = typeof window !== 'undefined' ? localStorage.getItem('selectedPanchayath') : '';
    setSelectedDistrict(district || '');
    setSelectedPanchayath(panchayath || '');
    if (district && panchayath && districtMap[district]) {
      const found = districtMap[district].find(lb => lb.LocalBody === panchayath);
      setLocalBodyUrl(found ? found.HTMLPage : '');
    } else {
      setLocalBodyUrl('');
    }

    // Fetch username
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : '';
    if (userId) {
      fetchUsername(userId);
    }
  }, [districtMap]);

  useEffect(() => {
    // Fetch post numbers for selected district and panchayath
    async function fetchPostNumbers() {
      if (!selectedDistrict || !selectedPanchayath) return;
      const { data, error } = await supabase
        .from('DSMS')
        .select('post_number')
        .eq('district', selectedDistrict)
        .eq('panchayath', selectedPanchayath);
      if (!error && data) {
        setAllPostNumbers(data.map(d => d.post_number));
      } else {
        setAllPostNumbers([]);
      }
    }
    fetchPostNumbers();
  }, [selectedDistrict, selectedPanchayath]);

  useEffect(() => {
    if (postNumber && allPostNumbers.length > 0) {
      const filtered = allPostNumbers.filter(pn => pn && pn.toLowerCase().includes(postNumber.toLowerCase()));
      setPostNumberSuggestions(filtered.slice(0, 5));
      setShowDropdown(filtered.length > 0);
    } else {
      setPostNumberSuggestions([]);
      setShowDropdown(false);
    }
  }, [postNumber, allPostNumbers]);

  const fetchUsername = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const handleServicesClick = () => {
    setShowServices(v => !v);
  };
  const handleUpdatesClick = async () => {
    setShowUpdatesModal(true);
    setUpdatesLoading(true);
    // Fetch complaints for this user
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : '';
    if (userId) {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', userId);
      if (!error) setUpdates(data || []);
    }
    setUpdatesLoading(false);
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

  // Navigate to map page
  const handleMapClick = () => {
    router.push('/usermap');
  };

  // Navigate back to hello page
  const handleBackClick = () => {
    router.push('/hello');
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
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : '';
    const selectedDistrict = typeof window !== 'undefined' ? localStorage.getItem('selectedDistrict') : '';
    const selectedPanchayath = typeof window !== 'undefined' ? localStorage.getItem('selectedPanchayath') : '';
    // Insert complaint into Supabase
    const { error } = await supabase
      .from('complaints')
      .insert([
        {
          user_id: userId || null,
          post_number: postNumber.trim(),
          issue_description: '', // You can add a field for this if needed
          status: 'pending',
          district: selectedDistrict,
          panchayath: selectedPanchayath
        }
      ]);
    if (error) {
      setRegisterError('Failed to register complaint: ' + error.message);
      setRegistering(false);
      return;
    }
    setShowEnterComplaint(false);
    setPostNumber('');
    setRegisterError('');
    setRegistering(false);
    alert('Complaint registered successfully!');
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

  // Registration form submit handler
  const handleRegister = (e) => {
    e.preventDefault();
    if (!regEmail.trim() || !regPhone.trim() || !regUsername.trim() || !regPassword.trim()) {
      setRegError('All fields are required.');
      setRegSuccess('');
      return;
    }
    // Store in localStorage (for demo)
    if (typeof window !== 'undefined') {
      localStorage.setItem('regEmail', regEmail.trim());
      localStorage.setItem('regPhone', regPhone.trim());
      localStorage.setItem('regUsername', regUsername.trim());
      localStorage.setItem('regPassword', regPassword); // In real apps, never store plain passwords!
    }
    setRegSuccess('Account created successfully!');
    setRegError('');
    setRegEmail('');
    setRegPhone('');
    setRegUsername('');
    setRegPassword('');
  };

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',height:'100%',width:'100%'}}>
      {/* Back Button Box */}
      <div style={{
        width: '100%',
        maxWidth: '390px',
        background: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
        margin: '8px 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button 
          onClick={handleBackClick}
          style={{
            background: '#1db954',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#16a34a'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1db954'}
        >
          ← Back
        </button>
        
        <div style={{
          fontSize: '0.9rem',
          color: '#666',
          fontWeight: '500'
        }}>
          {username ? `User: ${username}` : 'User: N/A'}
        </div>
      </div>
      
      <div style={{width:'100%',maxWidth:'390px',background:'#f5f5f5',borderRadius:'16px',padding:'24px',margin:'0',boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
        <div style={{fontWeight:'bold',fontSize:'1.3rem',marginBottom:'18px',textAlign:'center',color:'#1db954'}}>STREET LIGHT</div>
        <div style={{background:'#fff',borderRadius:'12px',padding:'18px',boxShadow:'0 1px 6px rgba(0,0,0,0.06)',textAlign:'center'}}>
          <div style={{fontWeight:'500',fontSize:'1.1rem',marginBottom:'12px'}}>Complaints</div>
          <button style={{width:'100%',padding:'12px 0',fontSize:'1rem',fontWeight:'500',background:'#1db954',color:'#fff',border:'none',borderRadius:'10px',cursor:'pointer',marginBottom:'10px'}} onClick={handleEnterComplaintClick}>Register Complaint</button>
          <button style={{width:'100%',padding:'12px 0',fontSize:'1rem',fontWeight:'500',background:'#f5f5f5',color:'#1db954',border:'1px solid #1db954',borderRadius:'10px',cursor:'pointer'}} onClick={handleUpdatesClick}>Updates</button>
        </div>
      </div>
      <div style={{width:'100%',maxWidth:'390px',background:'#fff',borderRadius:'16px',padding:'18px',margin:'18px 0 0 0',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',textAlign:'center'}}>
        <div style={{fontWeight:'500',fontSize:'1.1rem',marginBottom:'10px'}}>Map</div>
        <button 
          style={{
            width:'100%',
            padding:'12px 0',
            fontSize:'1rem',
            fontWeight:'500',
            background:'#1db954',
            color:'#fff',
            border:'none',
            borderRadius:'10px',
            cursor:'pointer'
          }} 
          onClick={handleMapClick}
        >
          Map of Your Panchayath
        </button>
      </div>
      {/* Complaint Registration Modal */}
      {showEnterComplaint && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'18px',boxShadow:'0 4px 24px rgba(0,0,0,0.18)',padding:'28px 18px 18px 18px',width:'90%',maxWidth:'340px',display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
            <button onClick={handleCloseModal} style={{position:'absolute',top:10,right:14,background:'none',border:'none',fontSize:'1.5rem',color:'#888',cursor:'pointer'}}>&times;</button>
            <div style={{fontWeight:'bold',fontSize:'1.1rem',marginBottom:'18px',textAlign:'center'}}>Enter Post Number</div>
            <form onSubmit={handleRegisterComplaint} style={{width:'100%'}} autoComplete="off">
              <div style={{position:'relative',width:'100%'}}>
                <input
                  type="text"
                  value={postNumber}
                  onChange={e => setPostNumber(e.target.value)}
                  onFocus={() => setShowDropdown(postNumberSuggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="Enter post number"
                  style={{width:'100%',padding:'10px',marginBottom:'12px',fontSize:'1rem',borderRadius:'8px',border:'1px solid #ccc'}}
                  required
                />
                {showDropdown && postNumberSuggestions.length > 0 && (
                  <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#fff',border:'1px solid #ddd',borderRadius:'0 0 8px 8px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',zIndex:10}}>
                    {postNumberSuggestions.map((pn, idx) => (
                      <div
                        key={pn+idx}
                        onMouseDown={() => { setPostNumber(pn); setShowDropdown(false); }}
                        style={{padding:'8px 12px',cursor:'pointer',fontSize:'1rem',color:'#333',borderBottom: idx !== postNumberSuggestions.length-1 ? '1px solid #eee' : 'none'}}
                        onMouseOver={e => e.target.style.background='#f5f5f5'}
                        onMouseOut={e => e.target.style.background='#fff'}
                      >
                        {pn}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" style={{width:'100%',padding:'12px 0',fontSize:'1rem',fontWeight:'500',background:'#1db954',color:'#fff',border:'none',borderRadius:'10px',cursor:'pointer'}}>Submit</button>
              {registerError && <div style={{color:'#d32f2f',marginTop:'8px',textAlign:'center'}}>{registerError}</div>}
            </form>
          </div>
        </div>
      )}
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
              {updatesLoading ? (
                <div style={{marginBottom:'10px',color:'#888'}}>Loading...</div>
              ) : updates.length === 0 ? (
                <div style={{marginBottom:'10px',color:'#888'}}>No complaints found.</div>
              ) : (
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.98rem'}}>
                  <thead>
                    <tr style={{background:'#f5f5f5'}}>
                      {Object.keys(updates[0]).map(col => (
                        <th key={col} style={{padding:'8px',fontWeight:'bold',borderBottom:'1px solid #ddd'}}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {updates.map((row, idx) => (
                      <tr key={row.id || idx} style={{background: idx%2 ? '#fafafa' : '#fff'}}>
                        {Object.keys(updates[0]).map(col => (
                          <td key={col} style={{padding:'8px',textAlign:'center'}}>{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 