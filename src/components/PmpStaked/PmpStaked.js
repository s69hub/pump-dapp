import React, { useContext, useEffect, useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { StateContext } from "../../contexts/StateContext";
import balanceOfABI from "./BalanceOfABI";

/* global BigInt */

function PmpStaked() {
  const { refresh } = useContext(StateContext);
  const contractProcessor = useWeb3ExecuteFunction();
  const { account } = useMoralis();
  const [pmpStaked, setPmpStaked] = useState(0);

  const fetchPmpStaked = async () => {
    await contractProcessor.fetch({
      params: balanceOf,
      onSuccess: (result) => {
        setPmpStaked(BigInt(result._hex).toString() / Math.pow(10, 18));
      },
    });
  };

  const balanceOf = {
    contractAddress: process.env.REACT_APP_STAKING_CONTRACT,
    functionName: "balanceOf",
    abi: balanceOfABI,
    params: { account: account },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPmpStaked();
    }, 5000);
    fetchPmpStaked();
    return () => clearInterval(interval);
  }, [account, refresh]);

  return <>{pmpStaked}</>;
}

export default PmpStaked;
