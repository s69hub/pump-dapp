import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
  Card,
} from "react-bootstrap";
import { StateContext } from "../../contexts/StateContext";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { addDecimals } from "../../helpers/formatters";
import unstakeABI from "./UnstakeABI";
import timeUntileUnlockABI from "./TimeUntilUnlockABI";
import Countdown from "react-countdown";

/* global BigInt */

function Unstake(props) {
  const { account } = useMoralis();
  const { refresh, setRefresh } = useContext(StateContext);

  const [timeUU, setTimeUU] = useState(0);
  const [unstakeAmount, setUnstakeAmount] = useState(0);
  const [earlyAmount, setEarlyAmount] = useState(0);

  const handleUnstakeAmount = (e) => {
    const amount = addDecimals(e.target.value, 18);
    setUnstakeAmount(BigInt(amount));
    setEarlyAmount(e.target.value * 0.95);
  };

  const contractProcessor = useWeb3ExecuteFunction();

  const timeUntilUnlock = {
    contractAddress: process.env.REACT_APP_STAKING_CONTRACT,
    functionName: "timeUntilUnlock",
    abi: timeUntileUnlockABI,
    params: { user: account },
  };

  const unstake = {
    contractAddress: process.env.REACT_APP_STAKING_CONTRACT,
    functionName: "withdraw",
    abi: unstakeABI,
    params: { amount: BigInt(unstakeAmount) },
  };

  const fetchUnstake = async () => {
    await contractProcessor.fetch({
      params: unstake,
      onSuccess: () => {
        props.setStakeStep(0);
        setRefresh(refresh + 1);
      },
      // onSuccess: () => setUnstakeSuccessModalVisible(true),
    });
  };

  const fetchTimeUntilUnlock = async () => {
    await contractProcessor.fetch({
      params: timeUntilUnlock,
      onSuccess: (result) => {
        const TUU = BigInt(result._hex).toString() * 1000 * 3;
        setTimeUU(TUU);
      },
    });
  };

  useEffect(() => {
    fetchTimeUntilUnlock();
  }, []);

  return (
    <Container>
      <Row>
        {timeUU > 0 && (
          <Col>
            <Button
              onClick={() => props.setStakeStep(0)}
              variant="primary"
              size="lg"
              width="30px"
              className="me-3"
            >
              <i class="bi bi-chevron-double-left"></i>
            </Button>
            <Button size="lg" disabled={true}>
              Unlocks In{" "}
              {
                <Countdown
                  date={Date.now() + timeUU}
                  onComplete={fetchTimeUntilUnlock}
                />
              }
            </Button>
            <Card className="mt-4 pb-3 card-inner">
              <p className="fs-5 my-2">Early Unlock (5% fee)</p>

              <InputGroup className="px-3">
                <FormControl
                  onChange={handleUnstakeAmount}
                  type="number"
                  placeholder="$PMP Amount"
                  aria-label="$PMP Amount"
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
                  Early Unstake!
                </Button>
              </InputGroup>
              <p className="text-warning fs-6 mt-2 mb-0">
                {earlyAmount > 0 ? `You will receive ${earlyAmount} $PMP` : ""}
              </p>
            </Card>
          </Col>
        )}
        {timeUU === 0 && (
          <Container>
            <Row>
              <Col xs={2}>
                <Button
                  onClick={() => props.setStakeStep(0)}
                  variant="primary"
                  size="lg"
                  className="me-1"
                >
                  <i class="bi bi-chevron-double-left"></i>
                </Button>
              </Col>
              <Col xs={10}>
                <InputGroup size="lg">
                  <FormControl
                    onChange={handleUnstakeAmount}
                    type="number"
                    placeholder="$PMP Amount"
                    aria-label="$PMP Amount"
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
              </Col>
            </Row>
          </Container>
        )}
      </Row>
    </Container>
  );
}

export default Unstake;
