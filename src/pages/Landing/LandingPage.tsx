import Header from './sections/Header'
import Footer from './sections/Footer'
import Hero from './sections/Hero'

const LandingPage = () => {
  return (
    <div>
        <Header/>
        <div className='container'>
            <Hero/>
        </div>
        <Footer/>
    </div>
  )
}

export default LandingPage
