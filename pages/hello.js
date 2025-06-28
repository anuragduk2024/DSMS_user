import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { supabase } from '../lib/supabase'

const OPTIONS = {
  en: [
    'State',
    'District',
    'Panchayath/Municipality',
    'Ward/Council',
  ],
  ml: [
    'സംസ്ഥാനം',
    'ജില്ല',
    'പഞ്ചായത്ത്/മുനിസിപ്പാലിറ്റി',
    'വാർഡ്/കൗൺസിൽ',
  ],
}

const STATES = ['KERALA', '-OTHERS-']
const STATES_ML = ['കേരളം', '-മറ്റുള്ളവ-']
const DISTRICTS = [
  'THIRUVANANTHAPURAM', 'KOLLAM', 'PATHANAMTHITTA', 'ALAPPUZHA', 'KOTTAYAM',
  'IDUKKI', 'ERNAKULAM', 'THRISSUR', 'PALAKKAD', 'MALAPPURAM',
  'KOZHIKODE', 'WAYANAD', 'KANNUR', 'KASARAGOD'
]
const DISTRICTS_ML = [
  'തിരുവനന്തപുരം', 'കൊല്ലം', 'പത്തനംതിട്ട', 'ആലപ്പുഴ', 'കോട്ടയം',
  'ഇടുക്കി', 'എറണാകുളം', 'തൃശ്ശൂർ', 'പാലക്കാട്', 'മലപ്പുറം',
  'കോഴിക്കോട്', 'വയനാട്', 'കണ്ണൂർ', 'കാസർഗോഡ്'
]
const PANCHAYATHS_TVM = ['MANGALAPURAM', 'POTHENCODE', '-OTHERS-']
const PANCHAYATHS_TVM_ML = ['മംഗലപുരം', 'പൊതൻകോഡ്', '-മറ്റുള്ളവ-']
const WARDS_MANGALAPURAM = [
  'KAILATHUKONAM', 'CHEMBAKAMANGALAM', 'POIKAYIL', 'PUNNAIKUNNAM', 'KUDAVOOR',
  'MURINGAMON', 'PATTAM', 'THONNAKKAL', 'MANGALAPURAM', 'KARAMOODU',
  'EDAVILAKOM', 'VARIKKAMUKKU', 'MURUKKUMPUZHA', 'KOZHIMADA', 'MUNDAKKAL',
  'VALIKONAM', 'MULLASSERY', 'KOTTARAKKARI', 'VEILOOR', 'SASTHAVATTOM'
]
const WARDS_MANGALAPURAM_ML = [
  'കൈലത്തുകോണം', 'ചെമ്പകമംഗലം', 'പൊയ്കയിൽ', 'പുന്നൈക്കുന്നം', 'കുടവൂർ',
  'മുറിങ്ങമൺ', 'പട്ടം', 'തൊണ്ണക്കൽ', 'മംഗലപുരം', 'കരമൂട്',
  'എടവിലകം', 'വരിക്കമുക്ക്', 'മുറുക്കുമ്പുഴ', 'കോഴിമട', 'മുണ്ടക്കൽ',
  'വളികോണം', 'മുള്ളശ്ശേരി', 'കൊറ്ററക്കരി', 'വെയിലൂർ', 'ശാസ്താവട്ടം'
]
const OTHERS = {
  en: '-OTHERS-',
  ml: '-മറ്റുള്ളവ-'
}
const NOT_AVAILABLE = {
  en: '-NOT AVAILABLE-',
  ml: '-ലഭ്യമല്ല-'
}

export default function Hello() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [lang, setLang] = useState('en');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false)
  const [showPanchayathDropdown, setShowPanchayathDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedPanchayath, setSelectedPanchayath] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [reminder, setReminder] = useState('');
  const [districtMap, setDistrictMap] = useState({});
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        setLoggedIn(true);
        setUserId(storedUserId);
        // Fetch username from database
        fetchUsername(storedUserId);
      }
    }
  }, []);

  useEffect(() => {
    fetch('/district_localbody_mapping.json')
      .then(res => res.json())
      .then(data => setDistrictMap(data));
  }, []);

  const getDisplay = (en, ml) => lang === 'ml' ? ml : en;

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

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_id');
      localStorage.removeItem('selectedDistrict');
      localStorage.removeItem('selectedPanchayath');
    }
    setLoggedIn(false);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
    setUserId('');
    setUsername('');
    router.push('/');
  };

  const districtOptions = Object.keys(districtMap);
  const panchayathOptions = selectedDistrict && districtMap[selectedDistrict]
    ? districtMap[selectedDistrict].map(lb => lb.LocalBody)
    : [];

  const handleStateClick = () => {
    setShowStateDropdown(v => !v)
    setShowDistrictDropdown(false)
    setShowPanchayathDropdown(false)
    setShowWardDropdown(false)
  }
  const handleDistrictClick = () => {
    setShowDistrictDropdown(v => !v)
    setShowStateDropdown(false)
    setShowPanchayathDropdown(false)
    setShowWardDropdown(false)
  }
  const handlePanchayathClick = () => {
    setShowPanchayathDropdown(v => !v)
    setShowStateDropdown(false)
    setShowDistrictDropdown(false)
    setShowWardDropdown(false)
  }
  const handleWardClick = () => {
    setShowWardDropdown(v => !v)
    setShowStateDropdown(false)
    setShowDistrictDropdown(false)
    setShowPanchayathDropdown(false)
  }
  const handleStateSelect = (state, stateMl) => {
    setSelectedState(lang === 'ml' ? stateMl : state)
    setShowStateDropdown(false)
    setSelectedDistrict('')
    setSelectedPanchayath('')
    setSelectedWard('')
  }
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district)
    setShowDistrictDropdown(false)
    setSelectedPanchayath('')
  }
  const handlePanchayathSelect = (panchayath) => {
    setSelectedPanchayath(panchayath)
    setShowPanchayathDropdown(false)
  }
  const handleWardSelect = (ward, wardMl) => {
    setSelectedWard(lang === 'ml' ? wardMl : ward)
    setShowWardDropdown(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Both fields are required.');
      return;
    }
    // Query Supabase for user
    const { data, error } = await supabase
      .from('users')
      .select('id, username')
      .eq('username', loginUsername)
      .eq('password', loginPassword)
      .single();
    console.log({ data, error, loginUsername, loginPassword });
    if (error || !data) {
      setLoginError('Invalid username or password.');
      return;
    }
    setLoggedIn(true);
    setLoginError('');
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_id', data.id);
    }
  };

  const handleProceed = async () => {
    if (!selectedDistrict || !selectedPanchayath) {
      setReminder(lang === 'ml' ? 'ദയവായി ജില്ലയും പഞ്ചായത്തും തിരഞ്ഞെടുക്കുക' : 'Please select both district and panchayath');
      return;
    }
    setReminder('');
    // Save selections to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedDistrict', selectedDistrict);
      localStorage.setItem('selectedPanchayath', selectedPanchayath);
      // Update user's district and panchayath in Supabase
      const userId = localStorage.getItem('user_id');
      if (userId) {
        await supabase
          .from('users')
          .update({
            district: selectedDistrict,
            panchayath: selectedPanchayath
          })
          .eq('id', userId);
      }
    }
    router.push('/thirdpage');
  }

  if (!loggedIn) {
    return (
      <div className={styles.dashboardContainer}>
        <form onSubmit={handleLogin} style={{width:'100%',maxWidth:'340px',background:'#fff',borderRadius:'18px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',padding:'24px 18px 18px 18px',margin:'24px auto'}}>
          <div style={{fontWeight:'bold',fontSize:'1.1rem',marginBottom:'18px',textAlign:'center'}}>Login</div>
          <input
            type="text"
            value={loginUsername}
            onChange={e => setLoginUsername(e.target.value)}
            placeholder="Username"
            style={{width:'100%',padding:'10px',marginBottom:'10px',fontSize:'1rem',borderRadius:'8px',border:'1px solid #ccc'}}
            required
          />
          <input
            type="password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            placeholder="Password"
            style={{width:'100%',padding:'10px',marginBottom:'10px',fontSize:'1rem',borderRadius:'8px',border:'1px solid #ccc'}}
            required
          />
          {loginError && <div style={{color:'#d32f2f',marginBottom:'8px',textAlign:'center'}}>{loginError}</div>}
          <button type="submit" style={{width:'100%',padding:'12px 0',fontSize:'1rem',fontWeight:'500',background:'#1db954',color:'#fff',border:'none',borderRadius:'10px',cursor:'pointer'}}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>{getDisplay('DASHBOARD', 'ഡാഷ്ബോർഡ്')}</div>
      
      {/* User ID and Logout Section */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 18px',
        background: '#f8f9fa',
        borderBottom: '1px solid #e9ecef'
      }}>
        {/* User ID Box */}
        <div style={{
          background: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #dee2e6',
          fontSize: '0.875rem',
          color: '#495057',
          fontWeight: '500'
        }}>
          Username: {username || 'N/A'}
        </div>
        
        {/* Logout Switch */}
        <button 
          onClick={handleLogout}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
        >
          Logout
        </button>
      </div>
      
      <img src="/pic/icon6.png" alt="icon6" className={styles.dashboardIcon} />
      <div className={styles.selectionOptions}>
        {/* Choose Options Text Box */}
        <div style={{
          width: '100%',
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: '#1db954',
          border: '1px solid #1db954',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: '500',
          color: 'white'
        }}>
          {lang === 'ml' ? 'ഓപ്ഷനുകൾ തിരഞ്ഞെടുക്കുക' : 'Choose Options'}
        </div>
        
        {/* District Button and Dropdown */}
        <div className={styles.dropdownWrapper}>
          <button className={styles.selectionBtn} onClick={handleDistrictClick}>
            {selectedDistrict || getDisplay('District', 'ജില്ല')}
          </button>
          {showDistrictDropdown && districtOptions.length > 0 && (
            <div className={styles.dropdownMenu}>
              {districtOptions.map((district) => (
                <div
                  key={district}
                  className={styles.dropdownItem}
                  onClick={() => handleDistrictSelect(district)}
                >
                  {district}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Panchayath/Municipality Button and Dropdown */}
        <div className={styles.dropdownWrapper}>
          <button className={styles.selectionBtn} onClick={handlePanchayathClick}>
            {selectedPanchayath || getDisplay('Panchayath/Municipality', 'പഞ്ചായത്ത്/മുനിസിപ്പാലിറ്റി')}
          </button>
          {showPanchayathDropdown && panchayathOptions.length > 0 && (
            <div className={styles.dropdownMenu}>
              {panchayathOptions.map((option) => (
                <div
                  key={option}
                  className={styles.dropdownItem}
                  onClick={() => handlePanchayathSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {reminder && (
        <div className={styles.reminderMsg}>{reminder}</div>
      )}
      <button className={styles.proceedBtn} onClick={handleProceed}>
        {lang === 'ml' ? 'തുടരുക' : 'Proceed'}
      </button>
    </div>
  )
}
    