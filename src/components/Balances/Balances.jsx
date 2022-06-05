import React, { useEffect, useState, useContext } from "react";
import { Button } from "react-bootstrap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import pmpABI from "./pmpABI";
import xusdABI from "./xusdABI";
import { StateContext } from "../../contexts/StateContext";

  /* global BigInt */

function Balances() {
  const { refresh, setRefrest } = useContext(StateContext);
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const pmp = {
    contractAddress: process.env.REACT_APP_PMP_CONTRACT,
    functionName: "balanceOf",
    abi: pmpABI,
    params: { account: account },
  };

  const xusd = {
    contractAddress: process.env.REACT_APP_XUSD_CONTRACT,
    functionName: "balanceOf",
    abi: xusdABI,
    params: { account: account },
  };

  const [pmpTxt, setPmpTxt] = useState(0);
  const [xusdTxt, setXusdTxt] = useState(0);

  const fetchBalances = async () => {
    const pmpBalance = await contractProcessor.fetch({ params: pmp });
    const xusdBalance = await contractProcessor.fetch({ params: xusd });
    setPmpTxt((pmpBalance / 10 ** 18).toString());
    setXusdTxt((xusdBalance / 10 ** 18).toString());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBalances();
    }, 15000);
    fetchBalances();
    return () => clearInterval(interval);
  }, [account, refresh]);

  return (
    <>
      <small className="text-center pe-md-4 pb-3 pb-md-0 text-gray fw-400">
        {pmpTxt || 0} $PMP <br /> {xusdTxt || 0} $xUSD
      </small>
    </>
  );
}

export default Balances;
