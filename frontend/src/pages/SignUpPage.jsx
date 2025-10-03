import React, { useEffect, useState } from "react";
import HeaderOne from "../components/HeaderOne";
import FooterAreaOne from "../components/FooterAreaOne";
import Preloader from "../helper/Preloader";
import SignUpForm from "../components/SignUpForm";

const SignUpPage = () => {
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

      {/* Signup Form */}
      <SignUpForm />

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default SignUpPage;