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
  const [lang, setLang] = useState('en')
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false)
  const [showPanchayathDropdown, setShowPanchayathDropdown] = useState(false)
  const [showWardDropdown, setShowWardDropdown] = useState(false)
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedPanchayath, setSelectedPanchayath] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [reminder, setReminder] = useState('')
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [districtMap, setDistrictMap] = useState({});
  const router = useRouter();

  // Helper to get display value for selected option
  const getDisplay = (en, ml) => lang === 'ml' ? ml : en;

  useEffect(() => {
    fetch('/district_localbody_mapping.json')
      .then(res => res.json())
      .then(data => setDistrictMap(data));
  }, []);

  useEffect(() => {
    // Check for user_id in localStorage on mount
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('user_id');
      if (userId) {
        setLoggedIn(true);
      }
    }
  }, []);

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
      <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'flex-end',padding:'0 18px 10px 0',gap:'10px'}}>
        <button className={styles.contactBtn}>{lang === 'ml' ? 'ബന്ധപ്പെടുക' : 'Contact'}</button>
        <label htmlFor="languageSelect">{getDisplay('Language:', 'ഭാഷ:')}</label>
        <select
          id="languageSelect"
          className={styles.languageSelect}
          value={lang}
          onChange={e => setLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="ml">Malayalam</option>
        </select>
      </div>
      <img src="/pic/icon6.png" alt="icon6" className={styles.dashboardIcon} />
      <div className={styles.selectionOptions}>
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
    