import React, { useEffect, useState } from "react";
import HeaderOne from "../components/HeaderOne";
import HeroOne from "../components/HeroOne";
import CounterOne from "../components/CounterOne";
import AboutOne from "../components/AboutOne";
import TestimonialOne from "../components/TestimonialOne";
import ProcessAreaOne from "../components/ProcessAreaOne";
import FaqAreaOne from "../components/FaqAreaOne";
import FooterAreaOne from "../components/FooterAreaOne";
import SubscribeOne from "../components/SubscribeOne";
import Preloader from "../helper/Preloader";

const HomePage = () => {
  let [active, setActive] = useState(true);
  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);
  return (
    <>
      {/* Preloader */}
      {active === true && <Preloader />}

      {/* Header one */}
      <HeaderOne />

      {/* Hero One */}
      <HeroOne />

      {/* Counter One */}
      <CounterOne />

      {/* About One */}
      <AboutOne />

      {/* Testimonial One */}
      <TestimonialOne />

      {/* Process Area One */}
      <ProcessAreaOne />

      {/* Faq Area One */}
      <FaqAreaOne />

      {/* Subscribe One */}
      <SubscribeOne />

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default HomePage;
