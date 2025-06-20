import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

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
  const router = useRouter();

  // Helper to get display value for selected option
  const getDisplay = (en, ml) => lang === 'ml' ? ml : en

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
  const handleDistrictSelect = (district, districtMl) => {
    setSelectedDistrict(lang === 'ml' ? districtMl : district)
    setShowDistrictDropdown(false)
    setSelectedPanchayath('')
    setSelectedWard('')
  }
  const handlePanchayathSelect = (panchayath, panchayathMl) => {
    setSelectedPanchayath(lang === 'ml' ? panchayathMl : panchayath)
    setShowPanchayathDropdown(false)
    setSelectedWard('')
  }
  const handleWardSelect = (ward, wardMl) => {
    setSelectedWard(lang === 'ml' ? wardMl : ward)
    setShowWardDropdown(false)
  }

  // Dropdown options
  let districtOptions = [];
  let panchayathOptions = [];
  let wardOptions = [];
  const isKerala = (lang === 'en' && selectedState === 'KERALA') || (lang === 'ml' && selectedState === 'കേരളം');

  if (!isKerala && selectedState) {
    districtOptions = [NOT_AVAILABLE[lang]];
    panchayathOptions = [NOT_AVAILABLE[lang]];
    wardOptions = [NOT_AVAILABLE[lang]];
  } else if (isKerala) {
    districtOptions = lang === 'ml' ? DISTRICTS_ML : DISTRICTS;
    if (
      (lang === 'en' && selectedDistrict === 'THIRUVANANTHAPURAM') ||
      (lang === 'ml' && selectedDistrict === 'തിരുവനന്തപുരം')
    ) {
      panchayathOptions = lang === 'ml' ? PANCHAYATHS_TVM_ML : PANCHAYATHS_TVM;
    } else if (selectedDistrict) {
      panchayathOptions = [NOT_AVAILABLE[lang]];
    }
    if (
      (lang === 'en' && selectedPanchayath === 'MANGALAPURAM') ||
      (lang === 'ml' && selectedPanchayath === 'മംഗലപുരം')
    ) {
      wardOptions = lang === 'ml' ? WARDS_MANGALAPURAM_ML : WARDS_MANGALAPURAM;
    } else if (selectedPanchayath) {
      wardOptions = [NOT_AVAILABLE[lang]];
    }
  }

  const handleProceed = () => {
    if (!selectedState || !selectedDistrict || !selectedPanchayath || !selectedWard) {
      setReminder(lang === 'ml' ? 'ദയവായി എല്ലാ ഓപ്ഷനുകളും തിരഞ്ഞെടുക്കുക' : 'Please complete all options');
      return;
    }
    setReminder('');
    // Save selections to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedState', selectedState);
      localStorage.setItem('selectedDistrict', selectedDistrict);
      localStorage.setItem('selectedPanchayath', selectedPanchayath);
      localStorage.setItem('selectedWard', selectedWard);
    }
    router.push('/thirdpage');
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
        {/* State Button and Dropdown */}
        <div className={styles.dropdownWrapper}>
          <button className={styles.selectionBtn} onClick={handleStateClick}>
            {selectedState || getDisplay('State', 'സംസ്ഥാനം')}
          </button>
          {showStateDropdown && (
            <div className={styles.dropdownMenu}>
              {(lang === 'ml' ? STATES_ML : STATES).map((state, idx) => (
                <div
                  key={state}
                  className={styles.dropdownItem}
                  onClick={() => handleStateSelect(STATES[idx], STATES_ML[idx])}
                >
                  {state}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* District Button and Dropdown */}
        <div className={styles.dropdownWrapper}>
          <button className={styles.selectionBtn} onClick={handleDistrictClick}>
            {selectedDistrict || getDisplay('District', 'ജില്ല')}
          </button>
          {showDistrictDropdown && districtOptions.length > 0 && (
            <div className={styles.dropdownMenu}>
              {districtOptions.map((district, idx) => (
                <div
                  key={district}
                  className={styles.dropdownItem}
                  onClick={() => {
                    if (isKerala) {
                      handleDistrictSelect(DISTRICTS[idx], DISTRICTS_ML[idx]);
                    } else {
                      handleDistrictSelect(NOT_AVAILABLE[lang], NOT_AVAILABLE[lang]);
                    }
                  }}
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
              {panchayathOptions.map((option, idx) => (
                <div
                  key={option}
                  className={styles.dropdownItem}
                  onClick={() => {
                    if (isKerala && ((lang === 'en' && selectedDistrict === 'THIRUVANANTHAPURAM') || (lang === 'ml' && selectedDistrict === 'തിരുവനന്തപുരം'))) {
                      handlePanchayathSelect(PANCHAYATHS_TVM[idx], PANCHAYATHS_TVM_ML[idx]);
                    } else {
                      handlePanchayathSelect(NOT_AVAILABLE[lang], NOT_AVAILABLE[lang]);
                    }
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Ward/Council Button and Dropdown */}
        <div className={styles.dropdownWrapper}>
          <button className={styles.selectionBtn} onClick={handleWardClick}>
            {selectedWard || getDisplay('Ward/Council', 'വാർഡ്/കൗൺസിൽ')}
          </button>
          {showWardDropdown && wardOptions.length > 0 && (
            <div className={styles.dropdownMenu}>
              {wardOptions.map((option, idx) => (
                <div
                  key={option}
                  className={styles.dropdownItem}
                  onClick={() => {
                    if (isKerala && ((lang === 'en' && selectedPanchayath === 'MANGALAPURAM') || (lang === 'ml' && selectedPanchayath === 'മംഗലപുരം'))) {
                      handleWardSelect(WARDS_MANGALAPURAM[idx], WARDS_MANGALAPURAM_ML[idx]);
                    } else {
                      handleWardSelect(NOT_AVAILABLE[lang], NOT_AVAILABLE[lang]);
                    }
                  }}
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
    