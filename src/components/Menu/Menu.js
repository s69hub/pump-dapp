import React, { useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import pump from "../../images/pump.svg";
import Balances from "../Balances/Balances";
import StakingV1 from "../StakingV1/StakingV1";
import Wallet from "../Wallet/Wallet";

export default function Menu() {


  return (
    <Navbar collapseOnSelect variant="dark" expand="md" className="fixed-top">
      <Container fluid>
        <Navbar.Brand
          href="https://www.pumptoken.net/"
          target="blank"
          className="ps-md-3"
        >
          <img src={pump} alt="PUMP" height="20px" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="text-center mt-3 mt-md-0">
            <StakingV1 />

            <a
              href="https://pancakeswap.finance/swap?outputCurrency=0x91Ebe3E0266B70be6AE41b8944170A27A08E3C2e"
              target="blank"
            >
              <Button
                variant="primary"
                className="mb-3 mb-md-0 me-0 me-md-3 mt-3 mt-md-0 ms-0 ms-md-3"
              >
                Buy with <b className="text-warning">BNB</b>
              </Button>
            </a>

            <a
              href="https://pancakeswap.finance/swap?outputCurrency=0x91Ebe3E0266B70be6AE41b8944170A27A08E3C2e&inputCurrency=0x324E8E649A6A3dF817F97CdDBED2b746b62553dD"
              target="blank"
            >
              <Button variant="primary" className="mb-3 mb-md-0">
                Buy with <b className="color-xusd">xUSD</b>
              </Button>
            </a>
          </Nav>
          <Nav className="me-0 ms-auto pe-md-3">
            <Balances />
            <Wallet />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
