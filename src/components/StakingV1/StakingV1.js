import React, { useEffect, useState } from "react";
import { Button, CloseButton, Modal } from "react-bootstrap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import balanceOfABI from "./BalanceOfABI";
import pendingRewardsABI from "./PendingRewardsABI";
import withdrawABI from "./WithdrawABI";

/* global BigInt */

function StakingV1() {
  const contractProcessor = useWeb3ExecuteFunction();
  const { account, isAuthenticated } = useMoralis();
  const [pmpStaked, setPmpStaked] = useState(0);
  const [rewards, setRewards] = useState(0);

  const [modalShow, setModalShow] = useState(false);

  const fetchPmpStaked = async () => {
    if (!isAuthenticated) {
      setPmpStaked(0);
    }
    await contractProcessor.fetch({
      params: balanceOf,
      onSuccess: (result) => {
        setPmpStaked(BigInt(result._hex).toString() / Math.pow(10, 18));
      },
    });
  };

  const fetchPendingRewards = async () => {
    await contractProcessor.fetch({
      params: pendingRewards,
      onSuccess: (result) => {
        setRewards(BigInt(result._hex).toString() / Math.pow(10, 18));
      },
    });
  };

  const handleUnstakeAndClaim = async () => {
    console.log(BigInt(pmpStaked * 1e18).toString());
    // await contractProcessor.fetch({
    //   params: unstakeAndClaim,
    //   onSuccess: setModalShow(false),
    // });
  };

  const unstakeAndClaim = {
    contractAddress: process.env.REACT_APP_STAKING_V1_CONTRACT,
    functionName: "withdraw",
    abi: withdrawABI,
    params: { amount: BigInt(pmpStaked * 1e18).toString() },
  };

  const balanceOf = {
    contractAddress: process.env.REACT_APP_STAKING_V1_CONTRACT,
    functionName: "balanceOf",
    abi: balanceOfABI,
    params: { account: account },
  };

  const pendingRewards = {
    contractAddress: process.env.REACT_APP_STAKING_V1_CONTRACT,
    functionName: "pendingRewards",
    abi: pendingRewardsABI,
    params: { shareholder: account },
  };

  useEffect(() => {
    fetchPmpStaked();
    fetchPendingRewards();
  }, [account, isAuthenticated, modalShow]);

  return (
    <>
      <Button
        variant="primary"
        className="ms-3"
        onClick={() => setModalShow(true)}
      >
        Staking v1
      </Button>

      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            PUMP Staking V1
          </Modal.Title>
          <CloseButton onClick={() => setModalShow(false)} />
        </Modal.Header>
        <Modal.Body>
          <h5>Welcome to a new era!</h5>
          <h6>
            Where a token called DUMP never goes down in price, and neither will
            your rewards!
          </h6>
          <p className="pt-2">
            We've upgraded our staking contract to <b>V2</b>.
            <br />
            <b>Stake PUMP, earn DUMP.</b> It's that simple!
          </p>
          <p>
            <b>Total Staked in V1:</b> {pmpStaked.toFixed(5)} $PMP
            <br />
            <b>Total Pending Rewards:</b> {rewards.toFixed(5)} $xUSD
            <br />
          </p>
          <p>
            We recommend you unstake & claim now, and then enjoy the V2 staking
            contract to earn DUMP!{" "}
            <small>
              <b>(There is no early unstake fee.)</b>
            </small>
          </p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button size="lg" onClick={handleUnstakeAndClaim}>
            Claim & Unstake All
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StakingV1;
