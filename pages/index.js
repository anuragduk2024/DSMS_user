import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

export default function Home() {
  const router = useRouter();
  const handleGoogleLogin = () => {
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
    </div>
  )
}
