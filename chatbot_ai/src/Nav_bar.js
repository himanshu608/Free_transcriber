import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from 'react-router-dom';
function Nav_bar() {
  return (
    <Navbar sticky="top" collapseOnSelect expand="md" bg="dark" variant="dark" className="border-bottom">
    <Container >
    <Link to="/" className="text-decoration-none text-white">
    <Navbar.Brand  className="me-5">SymblAiCorner</Navbar.Brand>
          </Link>
    
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto ms-auto text-light">
          <Link to="/chatbot" className="text-decoration-none text-white">
          <Nav>ChatBot</Nav>
          </Link>
        </Nav>
        <Nav className="me-auto text-light">
          
          <Link to="/videotranscript" className="text-decoration-none text-white">
          <Nav >Transcript</Nav>
          </Link>
        </Nav>
        <Nav className="me-5 text-light">
          <Link to="/discordbot" className="text-decoration-none text-white">
          <Nav >DiscordBot</Nav>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
}

export default Nav_bar;
