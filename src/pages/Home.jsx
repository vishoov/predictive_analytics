import React from 'react'
import { PublicNav } from '../components/homepage/publicNav'
import { HeroSection } from '../components/homepage/HeroSection'
import { TrustedBySection } from '../components/homepage/Logos'
import { FeaturesSection } from '../components/homepage/Features'
import { CTABannerSection } from '../components/homepage/CTABanner'
import { FAQSection } from '../components/homepage/FAQ'
import { Footer } from '../components/Footer'
import { HowItWorksSection } from '../components/homepage/HowItWorks'
const Home = () => {
  return (
    <div>
        <PublicNav />
        <main>
            <HeroSection />
            <TrustedBySection />
            <FeaturesSection />
            <HowItWorksSection />
            <CTABannerSection />
            <FAQSection />
        </main>
        <Footer />
    </div>
  )
}

export default Home