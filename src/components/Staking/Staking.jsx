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
import approveABI from "./ApproveABI";
import stakeABI from "./StakeABI";
import claimABI from "./ClaimABI";
import allowanceABI from "./AllowanceABI";
import { StateContext } from "../../contexts/StateContext";
import PmpStaked from "../PmpStaked/PmpStaked";
import Unstake from "../Unstake/Unstake";
import Bounty from "../Bounty/Bounty";
import PendingRewards from "../PendingRewards/PendingRewards";
import PmpPrice from "../PmpPrice/PmpPrice";

/* global BigInt */

function Stake() {
  const { refresh, setRefresh } = useContext(StateContext);

  const [isApproved, setIsApproved] = useState(false);
  const [stakeStep, setStakeStep] = useState(0);

  const [stakeAmount, setStakeAmount] = useState(0);

  const { user, account, isAuthenticated, authenticate, Moralis } =
    useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

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
    setStakeAmount(BigInt(amount));
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
    if (!isAuthenticated) {
      await Moralis.enableWeb3();
      await authenticate({
        onError: () => {
          throw new Error("Connect to web3 provider failed!");
        },
      });
    }
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
    fetchAllowance();
    if (!isAuthenticated) {
      setStakeStep(0);
    }
  }, [user, account, refresh, isAuthenticated]);

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
            <p className="text-white fs-5">
              $PMP = <PmpPrice />{" "}
            </p>
          </Col>
        </Row>
        <Row className="pt-2">
          <Col className="text-center">
            <Bounty />
          </Col>
        </Row>
        <Row className="pt-4 mt-2 text-center">
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
                {(!isApproved || !isAuthenticated) && stakeStep === 0 && (
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

                {stakeStep === 0 && isApproved && isAuthenticated && (
                  <Fragment>
                    <Container>
                      <Row>
                        <Col lg={12} className="d-flex justify-content-evenly">
                          <Button
                            onClick={() => setStakeStep(1)}
                            variant="primary"
                            size="lg"
                            className="me-3 btn-wide"
                          >
                            Stake
                          </Button>

                          <Button
                            onClick={() => setStakeStep(2)}
                            variant="primary"
                            size="lg"
                            className="btn-wide"
                          >
                            Unstake
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                  </Fragment>
                )}
                {stakeStep === 1 && isApproved && isAuthenticated && (
                  <Fragment>
                    <Container>
                      <Row>
                        <Col xs={2}>
                          <Button
                            onClick={() => setStakeStep(0)}
                            variant="primary"
                            size="lg"
                            className="me-1"
                          >
                            <i class="bi bi-chevron-double-left"></i>
                          </Button>
                        </Col>
                        <Col xs={10}>
                          <InputGroup className="" size="lg">
                            <FormControl
                              onChange={handleStakeAmount}
                              type="number"
                              placeholder="$PMP Amount"
                              aria-label="$PMP Amount"
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
                        </Col>
                      </Row>
                    </Container>
                  </Fragment>
                )}

                {stakeStep === 2 && isApproved && isAuthenticated && (
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
                <PendingRewards />
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
