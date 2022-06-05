import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import currentBountyABI from "./CurrentBountyABI";
import triggerABI from "./TriggerABI";
import { limitDigits } from "../../helpers/formatters";

/* global BigInt */

function Bounty() {
  const { account, Moralis, isAuthenticated } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const fetchBounty = async () => {
    if (!isAuthenticated) {
      await Moralis.enableWeb3();
    }

    await contractProcessor.fetch({
      params: {
        contractAddress: process.env.REACT_APP_FEERECEIVER_CONTRACT,
        functionName: "currentBounty",
        abi: currentBountyABI,
        params: {},
      },
      onSuccess: (result) => {
        if (result > 0) {
          setBounty(
            limitDigits(BigInt(result._hex).toString() / Math.pow(10, 18), 2)
          );
        } else {
          setBounty(0);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const handleTrigger = async () => {
    await contractProcessor.fetch({
      params: {
        contractAddress: process.env.REACT_APP_FEERECEIVER_CONTRACT,
        functionName: "trigger",
        abi: triggerABI,
        params: {},
      },
      // onSuccess: () => setBountySuccessModalVisible(true),
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const [bounty, setBounty] = useState(0);

  useEffect(() => {
    fetchBounty();
    const interval = setInterval(() => {
      fetchBounty();
    }, 2000);
    return () => clearInterval(interval);
  }, [account]);

  return (
    <Container>
      <Row>
        <Col>
          <Button size="lg" variant="bounty" onClick={handleTrigger}>
            Grab {bounty} $PMP
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Bounty;
