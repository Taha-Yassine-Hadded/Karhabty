import React from "react";
import SparePartsTabs from "./SparePartsTabs";

const CarDetailsSpareParts = ({ spareParts, recommendedTechnicians }) => {
  return <SparePartsTabs spareParts={spareParts} recommendedTechnicians={recommendedTechnicians} />;
};

export default CarDetailsSpareParts;
