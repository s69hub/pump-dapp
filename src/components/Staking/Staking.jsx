import React, { Fragment, useContext, useEffect, useState } from "react";
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
import pendingRewardsABI from "./PendingRewardsABI";
import approveABI from "./ApproveABI";
import stakeABI from "./StakeABI";
import claimABI from "./ClaimABI";
import allowanceABI from "./AllowanceABI";
import { StateContext } from "../../contexts/StateContext";
import PmpStaked from "../PmpStaked/PmpStaked";
import Unstake from "../Unstake/Unstake";

/* global BigInt */

function Stake() {
  const { refresh, setRefresh } = useContext(StateContext);

  const [isApproved, setIsApproved] = useState(false);
  const [stakeStep, setStakeStep] = useState(0);

  const [stakeAmount, setStakeAmount] = useState(0);

  const [rewards, setRewards] = useState(0);

  const { user, account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

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

  const fetchPendingRewards = async () => {
    await contractProcessor.fetch({
      params: pendingRewards,
      onSuccess: (data) => {
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

  const fetchClaim = async () => {
    await contractProcessor.fetch({
      params: claimRewards,
      onSuccess: () => setRefresh(refresh + 1),

      // onSuccess: () => setClaimSuccessModalVisible(true),
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPendingRewards();
    }, 3000);
    fetchAllowance();
    return () => clearInterval(interval);
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
          <Col lg={{ span: 5, offset: 1 }} className="text-center px-5">
            <Card>
              <Card.Body className="pb-4">
                <Card.Title className="pt-3">
                  <img src={logo} alt="PUMP Token" width={70} />{" "}
                </Card.Title>
                <Card.Text className="fs-4">
                  Total $PMP Staked
                  <br />
                  <PmpStaked />
                </Card.Text>
                {isApproved === false && stakeStep === 0 && (
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
                  <Fragment>
                    <div className="text-center">
                      <Button
                        onClick={() => setStakeStep(1)}
                        variant="primary"
                        size="lg"
                        className="me-sm-3 me-md-3 me-lg-3 me-0"
                      >
                        Stake $PMP
                      </Button>

                      <Button
                        onClick={() => setStakeStep(2)}
                        variant="primary"
                        size="lg"
                        className="mt-xs-3 mt-lg-3 mt-xl-0 mt-0"
                      >
                        Unstake $PMP
                      </Button>
                    </div>
                  </Fragment>
                )}
                {stakeStep === 1 && isApproved === true && (
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

                {stakeStep === 2 && isApproved === true && (
                  <Unstake setStakeStep={setStakeStep} />
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={5} className="text-center px-5 pt-5 pt-lg-0 mb-5">
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
