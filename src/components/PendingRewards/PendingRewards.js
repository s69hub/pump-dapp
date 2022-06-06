import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import pendingRewardsABI from "./PendingRewardsABI";
import { Card } from "react-bootstrap";

/* global BigInt */

function PendingRewards() {
  const contractProcessor = useWeb3ExecuteFunction();
  const [rewards, setRewards] = useState(0);
  const { account, isAuthenticated } = useMoralis();

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
    return () => clearInterval(interval);
  }, [account, isAuthenticated]);

  return (
    <>
      <Card.Text className="fs-4">
        Total xUSD Rewards
        <br />
        {isAuthenticated ? rewards : "0"}
      </Card.Text>
    </>
  );
}

export default PendingRewards;
