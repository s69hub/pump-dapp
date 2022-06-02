import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import currentBountyABI from "./CurrentBountyABI";
import triggerABI from "./TriggerABI";

/* global BigInt */

function Bounty() {
  const { account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const fetchBounty = async () => {
    await contractProcessor.fetch({
      params: {
        contractAddress: process.env.REACT_APP_FEERECEIVER_CONTRACT,
        functionName: "currentBounty",
        abi: currentBountyABI,
        params: {},
      },
      onSuccess: (result) => {
        console.log(result);
        setBounty(BigInt(result._hex).toString() / Math.pow(10, 18));
        console.log(bounty);
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
    });
  };

  const [bounty, setBounty] = useState(0);

  useEffect(() => {
    fetchBounty();
    const interval = setInterval(() => {
      fetchBounty();
    }, 5000);
    return () => clearInterval(interval);
  }, [account]);

  return (
    <Container>
      <Row>
        <Col>
          <Button size="lg" variant="bounty" onClick={handleTrigger}>
            Grab {bounty} BNB
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Bounty;
