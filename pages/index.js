import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    setShowModal(true);
  };

  const handleProceed = () => {
    if (!email.trim() || !phone.trim()) {
      setError('Both email and phone number are required.');
      return;
    }
    // Save to localStorage
    localStorage.setItem('userEmail', email.trim());
    localStorage.setItem('userPhone', phone.trim());
    setShowModal(false);
    router.push('/hello');
  };

  return (
    <div className={styles.customContainer}>
      <Head>
        <title>Digital Service Management System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <img src="/pic/icon1.png" alt="icon1" className={styles.topIcon} />
      <h1 className={styles.titleText}>DIGITAL SERVICE MANAGEMENT SYSTEM</h1>
      <img src="/pic/icon2.png" alt="icon2" className={styles.mainIcon} />
      <div className={styles.middleText}>SMART STREETLIGHT MANAGEMENT SYSTEM</div>
      <button className={styles.googleLogin} onClick={handleGoogleLogin}>
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className={styles.googleLogo} />
        Login with Google
      </button>
      <div className={styles.bottomIcons}>
        <img src="/pic/icon3.png" alt="icon3" className={styles.largeBottomIcon} />
      </div>
      {showModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'18px',boxShadow:'0 4px 24px rgba(0,0,0,0.18)',padding:'28px 18px 18px 18px',width:'90%',maxWidth:'340px',display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
            <div style={{fontWeight:'bold',fontSize:'1.1rem',marginBottom:'18px',textAlign:'center'}}>Enter your Email and Phone Number</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email ID"
              style={{width:'100%',padding:'10px',marginBottom:'12px',fontSize:'1rem',borderRadius:'8px',border:'1px solid #ccc'}}
              required
            />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Phone Number"
              style={{width:'100%',padding:'10px',marginBottom:'12px',fontSize:'1rem',borderRadius:'8px',border:'1px solid #ccc'}}
              required
            />
            {error && <div style={{color:'#d32f2f',marginBottom:'8px',textAlign:'center'}}>{error}</div>}
            <button onClick={handleProceed} style={{width:'100%',padding:'12px 0',fontSize:'1rem',fontWeight:'500',background:'#1db954',color:'#fff',border:'none',borderRadius:'10px',cursor:'pointer'}}>Proceed</button>
          </div>
        </div>
      )}
    </div>
  )
}
