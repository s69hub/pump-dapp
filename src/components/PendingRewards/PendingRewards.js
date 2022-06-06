import React, { useState, useEffect } from "react";
import {
  useMoralis,
  useWeb3ExecuteFunction,
  useTokenPrice,
} from "react-moralis";
import pendingRewardsABI from "./PendingRewardsABI";
import { Card, Button } from "react-bootstrap";
import { limitDigits } from "../../helpers/formatters";

/* global BigInt */

function PendingRewards() {
  const contractProcessor = useWeb3ExecuteFunction();
  const [rewards, setRewards] = useState(0);
  const [xusdPrice, setXUSDPrice] = useState(0);
  const { account, isAuthenticated, Moralis } = useMoralis();

  const { fetchTokenPrice } = useTokenPrice({
    address: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    chain: "bsc",
  });

  const fetchXusdPrice = async () => {
    const price = await fetchTokenPrice({
      params: {
        address: "0x324E8E649A6A3dF817F97CdDBED2b746b62553dD",
        chain: "bsc",
      },
      onSuccess: (price) => {
        setXUSDPrice(price.usdPrice);
      },
    });
  };

  const pendingRewards = {
    contractAddress: process.env.REACT_APP_STAKING_CONTRACT,
    functionName: "pendingRewards",
    abi: pendingRewardsABI,
    params: { shareholder: account },
  };

  const fetchPendingRewards = async () => {
    await contractProcessor.fetch({
      params: pendingRewards,
      onSuccess: (data) => {
        setRewards(BigInt(data._hex).toString() / Math.pow(10, 18));
      },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPendingRewards();
    }, 5000);
    fetchXusdPrice();
    return () => clearInterval(interval);
  }, [account, isAuthenticated]);

  return (
    <>
      <Card.Text className="fs-4">
        Total xUSD Rewards
        <br />
        {isAuthenticated ? limitDigits(rewards, 3) + " xUSD" : "0"} (
        {isAuthenticated ? limitDigits(rewards * xusdPrice, 3) + " USD" : "0"})
      </Card.Text>
    </>
  );
}

export default PendingRewards;
