import React from 'react'
import HeroSection from '../components/HeroSection'
import OurProducts from '../components/OurProducts'
import DownloadAppSection from '../components/DownloadAppSection'
import ManifestationPenHero from '../components/ManifestationPenHero'
import ManifestationBenefits from '../components/ManifestationBenefits'
import HowToUseManifestationPen from '../components/HowToUseManifestationPen'
import ManifestationFeatures from '../components/ManifestationFeatures'
import CustomerReviews from '../components/CustomerReviews'
import ManifestationStory from '../components/ManifestationStory'
import ImageCarousel from '../components/ImageCarousel'

const HomePage = () => {
    return (
        <div className=' mx-auto'>

            

            {/* <HeroSection /> */}
            <ImageCarousel/>
            <ManifestationPenHero/>
            <ManifestationBenefits/>
            <HowToUseManifestationPen/>
            <ManifestationFeatures/>
            <CustomerReviews/>
            <ManifestationStory/>
            {/* <OurProducts /> */}
            {/* <DownloadAppSection/> */}
        </div>
    )
}

export default HomePage