import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
const AboutTwo = () => {
  return (
    <div className="space-top">
      <div className="container">
        <div className="row">
          <div className="col-xxl-7 col-xl-6">
            <div className="about-thumb2 mb-40 mb-xl-0">
              <div className="about-img-1">
                <img src="assets/img/normal/about_2-1.png" alt="Fixturbo" />
              </div>
              <div className="about-img-2">
                <img src="assets/img/normal/about_2-2.png" alt="Fixturbo" />
              </div>
              <div className="about-counter-wrap jump-reverse">
                <img src="assets/img/icon/about_icon2-1.svg" alt="Fixturbo" />
                <h3 className="about-counter">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number">
                          <CountUp delay={0} start={0} end={5} />
                          k+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h3>
                <h4 className="about-counter-text">Trusted Customer</h4>
              </div>
              <div className="about-year-wrap2 movingX">
                <div className="about-year-grid-wrap">
                  <div className="icon">
                    <img src="assets/img/icon/about_icon2-2.png" alt="Fixturbo" />
                  </div>
                  <h3 className="about-counter">
                    <span className="counter-number">8</span>+
                  </h3>
                </div>
                <h4 className="about-year-text">Years Of Experiences</h4>
              </div>
            </div>
          </div>
          <div className="col-xxl-5 col-xl-6">
            <div className="about-content-wrap">
              <div className="title-area mb-30">
                <span className="sub-title">Know About Us</span>
                <h2 className="sec-title">
                  <img
                    className="title-bg-shape shape-center"
                    src="assets/img/bg/title-bg-shape.png"
                    alt="Fixturbo"
                  />
                </h2>
                <p className="sec-text">
                  At Karhabty, we combine technology and automotive expertise to help you maintain your vehicle with confidence. Our system tracks mileage and spare part lifespan to recommend the right time for replacements — keeping your car reliable and safe on every journey.
                </p>
              </div>
              <div className="about-feature-wrap style-shadow">
                <div className="icon">
                  <img src="assets/img/icon/about_icon2-3.svg" alt="Fixturbo" />
                </div>
                <div className="about-feature-wrap-details">
                  <h5 className="about-feature-title">
                    Smart Maintenance Tracking
                  </h5>
                  <p className="about-feature-text">
                    Karhabty monitors your vehicle’s mileage and part lifespan to alert you when it’s time for maintenance or replacement{" "}
                  </p>
                </div>
              </div>
              <div className="about-feature-wrap style-shadow">
                <div className="icon">
                  <img src="assets/img/icon/about_icon2-4.svg" alt="Fixturbo" />
                </div>
                <div className="about-feature-wrap-details">
                  <h5 className="about-feature-title">Intelligent Part Recommendations</h5>
                  <p className="about-feature-text">
                    Our system analyzes real data from your car to suggest the right spare parts at the right time, helping you avoid costly repairs and stay safe on the road.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTwo;
