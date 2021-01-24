import React, { Component} from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';


class Header extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            navCollapsed: true,
            showNavbar: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
       
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">Home </NavbarBrand>
                    <NavbarBrand href="/gameoflife">Game of Life </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                       
                            <UncontrolledDropdown nav inNavbar>

                                <DropdownMenu right>
                       
                                  
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <UncontrolledDropdown nav inNavbar>
                           
                                <DropdownMenu right>
                                
                                
                                </DropdownMenu>
                            </UncontrolledDropdown>

                          
                          

                           
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}
export default Header