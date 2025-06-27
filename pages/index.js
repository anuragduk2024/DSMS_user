import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import CreateAccountForm from '../components/CreateAccountForm'
import LoginForm from '../components/LoginForm'

export default function Home() {
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleCreateAccount = () => {
    setShowRegister(true);
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
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
      <div style={{display:'flex',flexDirection:'column',gap:'8px',justifyContent:'center',alignItems:'center',marginTop:'24px'}}>
        <button className={styles.googleLogin} onClick={handleCreateAccount}>
          Create Account
        </button>
        <button className={styles.googleLogin} onClick={handleLogin}>
          Login
        </button>
      </div>
      <div className={styles.bottomIcons}>
        <img src="/pic/icon3.png" alt="icon3" className={styles.largeBottomIcon} />
      </div>
      {showRegister && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'18px',boxShadow:'0 4px 24px rgba(0,0,0,0.18)',padding:'28px 18px 18px 18px',width:'90%',maxWidth:'400px',position:'relative'}}>
            <button onClick={handleCloseRegister} style={{position:'absolute',top:10,right:14,background:'none',border:'none',fontSize:'1.5rem',color:'#888',cursor:'pointer'}}>&times;</button>
            <CreateAccountForm />
          </div>
        </div>
      )}
      {showLogin && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:101,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'18px',boxShadow:'0 4px 24px rgba(0,0,0,0.18)',padding:'28px 18px 18px 18px',width:'90%',maxWidth:'400px',position:'relative'}}>
            <button onClick={handleCloseLogin} style={{position:'absolute',top:10,right:14,background:'none',border:'none',fontSize:'1.5rem',color:'#888',cursor:'pointer'}}>&times;</button>
            <LoginForm />
          </div>
        </div>
      )}
    </div>
  )
}
