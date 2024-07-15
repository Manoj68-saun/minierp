import React, { useRef } from "react";

const Rej = () => {
  const pcsRef = useRef(null);
  const sizeRef = useRef(null);

  return { pcsRef, sizeRef };
};

export default Rej;
