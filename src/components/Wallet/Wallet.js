import React, { useState } from "react";
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
  const { authenticate, isAuthenticated, user, chainId } = useMoralis();

  const login = async () => {
    setButtonText("Connecting...");
    await authenticate()
      .then(function (user, chainId) {
        const userAddress = getEllipsisTxt(user.get("ethAddress"), 4);
        if (chainId === 56) {
          setButtonText(userAddress);
          setShow(false);
        } else {
          setButtonText("Wrong network");
          switchNetwork(0x38)
            .then(() => setButtonText(userAddress))
            .catch(() => setButtonText("Wrong network"));
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
                <a onClick={login} href="#">
                  <img src={metamask} alt="MetaMask" width={170} />
                </a>
              </Col>
              {/* <Col lg={6}>
                <img src={walletconnect} alt="WalletConnect" width={190} />
              </Col> */}
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Wallet;
