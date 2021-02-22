import React from 'react'
import {BrowserRouter as Router,Switch,Route } from "react-router-dom";
import { Navbar,Nav,NavDropdown,Form,FormControl,Button } from 'react-bootstrap'
 

function BootNavbar() {
   
    return(
        <div>
            <div className="row">
                <div className="col-md-12">                   
                        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                            <Navbar.Brand href="#home">Safe Streets</Navbar.Brand>
                            
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />

                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                <Nav.Link href="/">Login</Nav.Link>
                                <Nav.Link href="/search">Search</Nav.Link>
                                <Nav.Link href="/favourites">Favourites</Nav.Link>                               
                                </Nav>                              
                            </Navbar.Collapse>
                            
                        </Navbar>                  
                </div>
            </div>
        </div>
    )  
}

export default BootNavbar

