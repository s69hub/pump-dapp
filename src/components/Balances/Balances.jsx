import React, { useEffect, useState, useContext } from "react";
import { Button } from "react-bootstrap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import balanceOfABI from "./BalanceOfABI";
import { StateContext } from "../../contexts/StateContext";

/* global BigInt */

function Balances() {
  const { refresh, setRefrest } = useContext(StateContext);
  const { account, isAuthenticated } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const pmp = {
    contractAddress: process.env.REACT_APP_PMP_CONTRACT,
    functionName: "balanceOf",
    abi: balanceOfABI,
    params: { account: account },
  };

  const dump = {
    contractAddress: process.env.REACT_APP_DUMP_CONTRACT,
    functionName: "balanceOf",
    abi: balanceOfABI,
    params: { account: account },
  };

  const [pmpTxt, setPmpTxt] = useState(0);
  const [dumpTxt, setDumpTxt] = useState(0);

  const fetchBalances = async () => {
    const pmpBalance = await contractProcessor.fetch({ params: pmp });
    const dumpBalance = await contractProcessor.fetch({ params: dump });
    setPmpTxt((pmpBalance / 10 ** 18).toString());
    setDumpTxt((dumpBalance / 10 ** 18).toString());
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
        {isAuthenticated ? pmpTxt : "0"} $PMP <br />{" "}
        {isAuthenticated ? dumpTxt : "0"} $DUMP
      </small>
    </>
  );
}

export default Balances;
