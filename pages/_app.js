import '../styles/globals.css'
import MobileFrame from '../components/MobileFrame'

function MyApp({ Component, pageProps }) {
  return (
    <MobileFrame>
      <Component {...pageProps} />
    </MobileFrame>
  )
}

export default MyApp
