import React, { useEffect, useState } from "react";
import HeaderOne from "../components/HeaderOne";
import FooterAreaOne from "../components/FooterAreaOne";
import Preloader from "../helper/Preloader";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
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

      {/* Login Form */}
      <LoginForm />

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default LoginPage;