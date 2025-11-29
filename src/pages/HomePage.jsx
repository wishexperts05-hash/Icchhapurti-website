import React from 'react'
import HeroSection from '../components/HeroSection'
import OurProducts from '../components/OurProducts'
import DownloadAppSection from '../components/DownloadAppSection'

const HomePage = () => {
    return (
        <div className='md:max-w-7xl mx-auto'>

            <HeroSection />
            <OurProducts />
            <DownloadAppSection/>
        </div>
    )
}

export default HomePage