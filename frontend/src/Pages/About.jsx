import React from 'react';
import AboutUs from '../Components/AboutUs';
import CountUpFood from '../Components/CountUpFood';

import LeafletBanner from '../Components/LeafletBanner';
import { FaqFaqSection } from '../Components/FaqSection';

const About = () => {
    return (
        <>
        <LeafletBanner
        pageTitle="About Us"
        breadcrumb={["Home", "About"]}
        ></LeafletBanner>
        <AboutUs></AboutUs>
        <CountUpFood></CountUpFood>
        <FaqFaqSection></FaqFaqSection>
            
        </>
    );
};

export default About;