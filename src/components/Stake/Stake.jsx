import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import pump from "../../images/pump.svg";
import logo from "../../images/logo.svg";
import xusd from "../../images/xusd.svg";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { stakeABI, unstakeABI, claimRewardsABI } from "./StakingContractABI";

function Stake() {
  const [stakeStep, setStakeStep] = useState(0);
  const [claimStep, setClaimStep] = useState(0);

  const [stakeAmount, setStakeAmount] = useState(0);
  const [claimAmount, setClaimAmount] = useState(0);

  const { user } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const stake = {
    contractAddress: "0x8dBC995946ad745dD77186d1aC10019b8Ea6694A",
    functionName: "stake",
    abi: stakeABI,
    params: { amount: stakeAmount },
  };

  const unstake = {
    contractAddress: "0x8dBC995946ad745dD77186d1aC10019b8Ea6694A",
    functionName: "unstake",
    abi: unstakeABI,
    params: { amount: stakeAmount },
  };

  const claimRewards = {
    contractAddress: "0x8dBC995946ad745dD77186d1aC10019b8Ea6694A",
    functionName: "claimRewards",
    abi: claimRewardsABI,
    params: {},
  };

  const fetchStake = async () => {
    await contractProcessor
      .fetch({ params: stake })
      .then(() => setStakeStep(0));
    //setSuccessModalVisible(true);
  };

  const fetchUnstake = async () => {
    await contractProcessor
      .fetch({ params: unstake })
      .then(() => setStakeStep(0));
    //setSuccessModalVisible(true);
  };

  const fetchClaim = async () => {
    await contractProcessor
      .fetch({ params: claimRewards })
      .then(() => setClaimStep(0));
    //setSuccessModalVisible(true);
  };

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
                {stakeStep === 0 && (
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
                        onChange={(e) => setStakeAmount(e.target.value)}
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
                        onChange={(e) => setStakeAmount(e.target.value)}
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
                    <Button
                      onClick={() => setClaimStep(1)}
                      variant="primary"
                      size="lg"
                    >
                      Claim $xUSD
                    </Button>
                  </>
                )}
                {claimStep === 1 && (
                  <>
                    <InputGroup className="mt-3 px-4" size="lg">
                      <FormControl
                        onChange={(e) => setClaimAmount(e.target.value)}
                        type="number"
                        placeholder="Enter $xUSD Amount"
                        aria-label="Enter $xUSD Amount"
                        style={{
                          borderTopLeftRadius: "1.25rem",
                          borderBottomLeftRadius: "1.25rem",
                        }}
                      />
                      <Button
                        onClick={fetchClaim}
                        variant="primary"
                        style={{
                          borderTopRightRadius: "1.25rem",
                          borderBottomRightRadius: "1.25rem",
                        }}
                      >
                        Claim!
                      </Button>
                    </InputGroup>
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
