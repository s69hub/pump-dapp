import React, { Fragment, useEffect, useState } from "react";
import { useTokenPrice } from "react-moralis";
import { limitDigits } from "../../helpers/formatters";

function PmpPrice() {
  const [pumpPrice, setPumpPrice] = useState();
  const { fetchTokenPrice } = useTokenPrice({
    address: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    chain: "bsc",
  });

  const fetchPmpPrice = async () => {
    const price = await fetchTokenPrice({
      params: {
        address: "0x91Ebe3E0266B70be6AE41b8944170A27A08E3C2e",
        chain: "bsc",
      },
      onSuccess: (price) => {
        setPumpPrice(price.usdPrice);
      },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPmpPrice();
    }, 10000);
  }, []);

  return (
    <Fragment>{pumpPrice ? limitDigits(pumpPrice, 6) + " $USD" : ""}</Fragment>
  );
}

export default PmpPrice;
