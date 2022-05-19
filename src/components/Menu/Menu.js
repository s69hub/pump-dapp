import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import pump from "../../images/pump.svg";
import Wallet from "../Wallet/Wallet";

export default function Menu() {
  return (
    <Navbar
      collapseOnSelect
      variant="dark"
      expand="md"
      className="fixed-top mt-3"
    >
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
          <Nav>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </Nav>
          <Nav className="me-0 ms-auto pe-md-3">
            {/* <Link to="/stake" className="nav-link pe-md-5">
              Stake
            </Link>
            <Link to="/" className="nav-link pe-md-5">
              Home
            </Link> */}
            <small className="text-center pe-md-4 pb-3 pb-md-0 text-gray fw-400">
              1024.3506 $PMP <br /> 327.32 $xUSD
            </small>
            <Wallet />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
