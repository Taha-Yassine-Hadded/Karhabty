import React from "react";
import SparePartsTabs from "./SparePartsTabs";

const CarDetailsSpareParts = ({ spareParts, recommendedTechnicians, currentCarKilometrage, carId }) => {
  return <SparePartsTabs spareParts={spareParts} recommendedTechnicians={recommendedTechnicians} currentCarKilometrage={currentCarKilometrage} carId={carId} />;
};

export default CarDetailsSpareParts;
