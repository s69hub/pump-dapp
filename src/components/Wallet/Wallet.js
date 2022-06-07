import React, { useEffect, useState } from "react";
import { Button, Container, Col, Row, Modal } from "react-bootstrap";
import { useChain, useMoralis } from "react-moralis";
import metamask from "../../images/metamask.svg";
import walletconnect from "../../images/walletconnect.svg";
import dappbrowser from "../../images/dappbrowser.svg";
import { BrowserView, MobileView } from "react-device-detect";
import { getEllipsisTxt } from "../../helpers/formatters";
import Balances from "../Balances/Balances";
import { ConnectButton, WalletModal } from "web3uikit";

function Wallet() {
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { switchNetwork } = useChain();
  const { authenticate, user, account, chainId, isAuthenticated, logout } =
    useMoralis();

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
    if (!isAuthenticated) {
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
      {/* <ConnectButton
        chainId={56}
        moralisAuth={true}
        signingMessage="Welcome to PUMP!"
      /> */}

      {!isAuthenticated && (
        <WalletModal
          moralisAuth="true"
          signingMessage="Welcome to PUMP!"
          chainId={56}
          isOpened={show}
          setIsOpened={setShow}
        />
        // <Modal
        //   aria-labelledby="contained-modal-title-vcenter"
        //   centered
        //   show={show}
        //   onHide={handleClose}
        // >
        //   <Modal.Header closeButton>
        //     <Modal.Title>Choose Method</Modal.Title>
        //   </Modal.Header>
        //   <Modal.Body>
        //     <Container className="text-center">
        //       <Row>
        //         <Col lg={6}>
        //           <a onClick={metamaskConnect} href="#">
        //             <BrowserView>
        //               <img src={metamask} alt="MetaMask" width={170} />
        //             </BrowserView>
        //             <MobileView>
        //               <img src={dappbrowser} alt="Web3Provider" width={170} />
        //             </MobileView>
        //           </a>
        //         </Col>
        //         <Col lg={6}>
        //           <a onClick={walletConnect} href="#">
        //             <img src={walletconnect} alt="WalletConnect" width={190} />
        //           </a>
        //         </Col>
        //       </Row>
        //     </Container>
        //   </Modal.Body>
        // </Modal>
      )}

      {isAuthenticated && (
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Disconnect</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="text-center">
              <Row>
                <Col lg={12}>{account ? account : ""}</Col>
                <Col lg={12} className="mb-2">
                  <Balances />
                </Col>
                <Col lg={12}>
                  <Button variant="danger" onClick={logout}>
                    Disconnect
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default Wallet;
