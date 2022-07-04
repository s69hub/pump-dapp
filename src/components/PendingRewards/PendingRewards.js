import React, { useState, useEffect } from "react";
import {
  useMoralis,
  useWeb3ExecuteFunction,
  useTokenPrice,
} from "react-moralis";
import pendingRewardsABI from "./PendingRewardsABI";
import { Card } from "react-bootstrap";
import { limitDigits } from "../../helpers/formatters";
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_DUMP_PRICE_API,
});

/* global BigInt */

function PendingRewards() {
  const contractProcessor = useWeb3ExecuteFunction();
  const [rewards, setRewards] = useState(0);
  const [dumpPrice, setDumpPrice] = useState(0);
  const { account, isAuthenticated, Moralis } = useMoralis();

  const fetchLastPrice = async () => {
    await API.get("/price").then((response) => {
      setDumpPrice(response.data[response.data.length - 1].price);
    });
  };

  const pendingRewards = {
    contractAddress: process.env.REACT_APP_STAKING_V2_CONTRACT,
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
    fetchLastPrice();
    return () => clearInterval(interval);
  }, [account, isAuthenticated]);

  return (
    <>
      <Card.Text className="fs-4">
        Total $DUMP Rewards
        <br />
        {isAuthenticated ? limitDigits(rewards, 3) + " $DUMP" : "0"}
        {isAuthenticated
          ? " (" + limitDigits(rewards * dumpPrice, 3) + " $USD)"
          : ""}
      </Card.Text>
    </>
  );
}

export default PendingRewards;
