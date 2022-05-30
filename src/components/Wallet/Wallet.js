import React, { useEffect, useState } from "react";
import { Button, Container, Col, Row, Modal } from "react-bootstrap";
import { useChain, useMoralis } from "react-moralis";
import metamask from "../../images/metamask.svg";
import walletconnect from "../../images/walletconnect.svg";

import { getEllipsisTxt } from "../../helpers/formatters";

function Wallet() {
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { switchNetwork } = useChain();
  const { authenticate, user, account, chainId } = useMoralis();

  const metamaskConnect = async () => {
    setButtonText("Connecting...");
    await authenticate({
      onSuccess: () => handleClose(),
    })
      .then(function () {
        const userAddress = getEllipsisTxt(account, 4);
        if (chainId === process.env.REACT_APP_CHAIN_ID_HEX) {
          handleClose();
          setButtonText(userAddress);
        } else {
          setButtonText("Wrong network");
          switchNetwork(process.env.REACT_APP_CHAIN_ID_HEX)
            .then(() => setButtonText(userAddress))
            .catch(() => {
              setButtonText("Wrong network");
              handleClose();
            });
        }
      })
      .catch(function (error) {
        console.log(error);
        setButtonText("Connect Wallet");
      });
  };

  const walletConnect = async () => {
    setButtonText("Connecting...");
    await authenticate({
      provider: "walletConnect",
      chainId: process.env.REACT_APP_CHAIN_ID,
      onSuccess: () => handleClose(),
    })
      .then(function (user) {
        const userAddress = getEllipsisTxt(account, 4);
        if (chainId === process.env.REACT_APP_CHAIN_ID_HEX) {
          handleClose();
          setButtonText(userAddress);
        } else {
          setButtonText("Wrong network");
          switchNetwork(process.env.REACT_APP_CHAIN_ID_HEX)
            .then(() => setButtonText(userAddress))
            .catch(() => {
              setButtonText("Wrong network");
              handleClose();
            });
        }
      })
      .catch(function (error) {
        console.log(error);
        setButtonText("Connect Wallet");
      });
  };

  useEffect(() => {
    if (!account) {
      setButtonText("Connect Wallet");
    } else {
      const userAddress = getEllipsisTxt(account, 4);
      setButtonText(userAddress);
    }
  }, [account, user]);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {buttonText}
      </Button>

      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Choose Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="text-center">
            <Row>
              <Col lg={6}>
                <a onClick={metamaskConnect} href="#">
                  <img src={metamask} alt="MetaMask" width={170} />
                </a>
              </Col>
              <Col lg={6}>
                <a onClick={walletConnect} href="#">
                  <img src={walletconnect} alt="WalletConnect" width={190} />
                </a>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Wallet;
