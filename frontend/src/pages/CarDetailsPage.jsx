import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderOne from "../components/HeaderOne";
import FooterAreaOne from "../components/FooterAreaOne";
import Breadcrumb from "../components/Breadcrumb";
import CarDetailsMain from "../components/CarDetailsMain";
import Preloader from "../helper/Preloader";

const CarDetailsPage = () => {
  const { id } = useParams();
  const [active, setActive] = useState(true);

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

      {/* Breadcrumb */}
      <Breadcrumb title={"Car Details"} />

      {/* Car Details */}
      <CarDetailsMain carId={id} />

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default CarDetailsPage;
