import React, { useEffect, useState } from "react";
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
import SuccessModal from "../SuccessModal/SuccessModal";
import { addDecimals } from "../../helpers/formatters";
import approveABI from "./ApproveABI";
import stakeABI from "./StakeABI";
import unstakeABI from "./UnstakeABI";
import claimABI from "./ClaimABI";

/* global BigInt */

function Stake() {
  const [isApproved, setIsApproved] = useState(false);
  const [stakeStep, setStakeStep] = useState(0);
  const [claimStep, setClaimStep] = useState(0);

  const [stakeAmount, setStakeAmount] = useState(0);
  const [claimAmount, setClaimAmount] = useState(0);

  const { user, Moralis } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

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
      onSuccess: () => setStakeStep(0),
    });
  };

  const fetchUnstake = async () => {
    await contractProcessor.fetch({
      params: unstake,
      onSuccess: () => setStakeStep(0),
    });

    //setSuccessModalVisible(true);
  };

  const fetchClaim = async () => {
    await contractProcessor.fetch({
      params: claimRewards,
      onSuccess: () => {
        return (
          <SuccessModal
            msg="Successfully claimed rewards"
            show="true"
            size="sm"
          />
        );
      },
    });
  };

  // useEffect(() => {
  //   fetchAllowance().then((res) => {
  //     if (res > 0) {
  //       setIsApproved(true);
  //     }
  //   });
  // }, [user]);

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
                  100
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
                  100
                </Card.Text>
                {claimStep === 0 && (
                  <>
                    <Button onClick={fetchClaim} variant="primary" size="lg">
                      Claim $xUSD
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Stake;
