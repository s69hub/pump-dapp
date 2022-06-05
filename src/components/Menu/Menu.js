import React, { useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import pump from "../../images/pump.svg";
import Balances from "../Balances/Balances";
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
          {/* <Nav>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </Nav> */}
          <Nav className="me-0 ms-auto pe-md-3">
            <Balances />
            <Wallet />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
