import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  InputGroup,
  FormControl,
  Modal,
} from "react-bootstrap";

import pump from "../../images/pump.svg";
import logo from "../../images/logo.svg";
import xusd from "../../images/xusd.svg";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { addDecimals } from "../../helpers/formatters";
import balanceOfABI from "./BalanceOfABI";
import pendingRewardsABI from "./PendingRewardsABI";
import approveABI from "./ApproveABI";
import stakeABI from "./StakeABI";
import unstakeABI from "./UnstakeABI";
import claimABI from "./ClaimABI";
import allowanceABI from "./AllowanceABI";
import { StateContext } from "../../contexts/StateContext";

/* global BigInt */

function Stake() {
  const { refresh, setRefresh } = useContext(StateContext);

  const [isApproved, setIsApproved] = useState(false);
  const [stakeStep, setStakeStep] = useState(0);

  const [stakeAmount, setStakeAmount] = useState(0);

  const [pmpStaked, setPmpStaked] = useState(0);
  const [timeToUnlock, setTimeToUnlock] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [earlyFee, setEarlyFee] = useState(0);

  const { user, account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const balanceOf = {
    contractAddress: process.env.REACT_APP_STAKING_CONTRACT,
    functionName: "balanceOf",
    abi: balanceOfABI,
    params: { account: account },
  };

  const pendingRewards = {
    contractAddress: process.env.REACT_APP_STAKING_CONTRACT,
    functionName: "pendingRewards",
    abi: pendingRewardsABI,
    params: { shareholder: account },
  };

  const allowance = {
    contractAddress: process.env.REACT_APP_PMP_CONTRACT,
    functionName: "allowance",
    abi: allowanceABI,
    params: {
      holder: account,
      spender: process.env.REACT_APP_STAKING_CONTRACT,
    },
  };

  const stake = {
    contractAddress: process.env.REACT_APP_STAKING_CONTRACT,
    functionName: "stake",
    abi: stakeABI,
    params: { amount: BigInt(stakeAmount) },
  };

  const unstake = {
    contractAddress: process.env.REACT_APP_STAKING_CONTRACT,
    functionName: "withdraw",
    abi: unstakeABI,
    params: { amount: BigInt(stakeAmount) },
  };

  const claimRewards = {
    contractAddress: process.env.REACT_APP_STAKING_CONTRACT,
    functionName: "claimRewards",
    abi: claimABI,
    params: {},
  };

  const approve = {
    contractAddress: process.env.REACT_APP_PMP_CONTRACT,
    functionName: "approve",
    abi: approveABI,
    params: {
      spender: process.env.REACT_APP_STAKING_CONTRACT,
      amount: BigInt(Math.pow(2, 128) - 1),
    },
  };

  const handleStakeAmount = (e) => {
    const amount = addDecimals(e.target.value, 18);
    setStakeAmount(amount);
  };

  const fetchPmpStaked = async () => {
    await contractProcessor.fetch({
      params: balanceOf,
      onSuccess: (result) => {
        setPmpStaked(BigInt(result._hex).toString() / Math.pow(10, 18));
      },
    });
  };

  const fetchPendingRewards = async () => {
    console.log("fetching pending rewards");
    await contractProcessor.fetch({
      params: pendingRewards,
      onSuccess: (data) => {
        console.log(BigInt(data._hex).toString() / Math.pow(10, 18));
        setRewards(BigInt(data._hex).toString() / Math.pow(10, 18));
      },
    });
  };

  const fetchAllowance = async () => {
    await contractProcessor.fetch({
      params: allowance,
      onSuccess: (result) => {
        if (result.toString() > "0") {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      },
    });
  };

  const fetchApprove = async () => {
    await contractProcessor.fetch({
      params: approve,
      onError: (error) => {
        console.log(error);
      },
      onSuccess: () => setIsApproved(true),
    });
  };

  const fetchStake = async () => {
    await contractProcessor.fetch({
      params: stake,
      onSuccess: () => {
        setStakeStep(0);
        setRefresh(refresh + 1);
      },
      // onSuccess: () => setStakeSuccessModalVisible(true),
    });
  };

  const fetchUnstake = async () => {
    await contractProcessor.fetch({
      params: unstake,
      onSuccess: () => {
        setStakeStep(0);
        setRefresh(refresh + 1);
      },
      // onSuccess: () => setUnstakeSuccessModalVisible(true),
    });
  };

  const fetchClaim = async () => {
    await contractProcessor.fetch({
      params: claimRewards,
      onSuccess: () => setRefresh(refresh + 1),

      // onSuccess: () => setClaimSuccessModalVisible(true),
    });
  };

  useEffect(() => {
    fetchPmpStaked();
    fetchPendingRewards();
    fetchAllowance();
  }, [user, account, refresh]);

  return (
    <>
      <Container className="pt-5">
        <Row className="pt-5">
          <Col className="text-center pt-5 mt-5">
            <img src={pump} alt="PUMP" height="125px" className="img-fluid" />
            <br />
            <p className="pt-3 fs-3 text-white">
              Stake $PMP and watch your xUSD grow!
            </p>
          </Col>
        </Row>
        <Row className="pt-5 mt-2">
          <Col md={{ span: 5, offset: 1 }} className="text-center px-5">
            <Card>
              <Card.Body className="pb-4">
                <Card.Title className="pt-3">
                  <img src={logo} alt="PUMP Token" width={70} />{" "}
                </Card.Title>
                <Card.Text className="fs-4">
                  Total $PMP Staked
                  <br />
                  {pmpStaked}
                </Card.Text>
                {isApproved === false && (
                  <>
                    <div className="px-5">
                      <Button
                        onClick={fetchApprove}
                        variant="primary"
                        size="lg"
                        className="btn-wide"
                      >
                        Enable
                      </Button>
                    </div>
                  </>
                )}

                {stakeStep === 0 && isApproved === true && (
                  <>
                    <Button
                      onClick={() => setStakeStep(1)}
                      variant="primary"
                      size="lg"
                      className="me-3"
                    >
                      Stake $PMP
                    </Button>

                    <Button
                      onClick={() => setStakeStep(2)}
                      variant="primary"
                      size="lg"
                    >
                      Unstake $PMP
                    </Button>
                  </>
                )}
                {stakeStep === 1 && (
                  <>
                    <InputGroup className="mt-3 px-4" size="lg">
                      <FormControl
                        onChange={handleStakeAmount}
                        type="number"
                        placeholder="Enter $PMP Amount"
                        aria-label="Enter $PMP Amount"
                        style={{
                          borderTopLeftRadius: "1.25rem",
                          borderBottomLeftRadius: "1.25rem",
                        }}
                      />
                      <Button
                        onClick={fetchStake}
                        variant="primary"
                        style={{
                          borderTopRightRadius: "1.25rem",
                          borderBottomRightRadius: "1.25rem",
                        }}
                      >
                        Stake!
                      </Button>
                    </InputGroup>
                  </>
                )}

                {stakeStep === 2 && (
                  <>
                    <InputGroup className="mt-3 px-4" size="lg">
                      <FormControl
                        onChange={handleStakeAmount}
                        type="number"
                        placeholder="Enter $PMP Amount"
                        aria-label="Enter $PMP Amount"
                        style={{
                          borderTopLeftRadius: "1.25rem",
                          borderBottomLeftRadius: "1.25rem",
                        }}
                      />
                      <Button
                        onClick={fetchUnstake}
                        variant="primary"
                        style={{
                          borderTopRightRadius: "1.25rem",
                          borderBottomRightRadius: "1.25rem",
                        }}
                      >
                        Unstake!
                      </Button>
                    </InputGroup>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={5} className="text-center px-5 pt-5 pt-md-0">
            <Card>
              <Card.Body className="pb-4">
                <Card.Title className="pt-3">
                  <img src={xusd} alt="xUSD" width={100} />{" "}
                </Card.Title>
                <Card.Text className="fs-4">
                  Total xUSD Rewards
                  <br />
                  {rewards}
                </Card.Text>
                <Button onClick={fetchClaim} variant="primary" size="lg">
                  Claim $xUSD
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Stake;
