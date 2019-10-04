import React, {Component} from 'react';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

import {
  AppAside,
  AppHeader,
  AppBreadcrumb
} from '@coreui/react';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedWindow: 'dashboard',
      user_email: this.props.email,
      logout: this.props.logout,
      username: this.props.username,
    }
  }

  render() {
    return(
      <AppHeader fixed>
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: "logo", width: 89, height: 25, alt: 'Wallet' }}
          minimized={{ src: "sygnet", width: 30, height: 30, alt: 'Wallet' }}
        />

        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={'public/assets/img/logo.png'} className="img-avatar" alt={this.props.username} />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem onClick={this.props.logout}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
      </AppHeader>
    );
  }

}

export default Header;
