import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container
} from "reactstrap";

import routes from "routes.js";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      annDropdownOpen: false, //announcement drop down
      color: "transparent",
      merchantId: parseInt(Cookies.get('merchantUser')),
      authToken: JSON.parse(Cookies.get('authToken')),
      notifications: [],
      announcements: []
    };
    this.toggle = this.toggle.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.annDropdownToggle = this.annDropdownToggle.bind(this);
    this.sidebarToggle = React.createRef();
  }

  toggle() {
    if (this.state.isOpen) {
      this.setState({
        color: "transparent",
      });
    } else {
      this.setState({
        color: "dark",
      });
    }
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  dropdownToggle(e) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }
  annDropdownToggle(e) {
    this.setState({
      annDropdownOpen: !this.state.annDropdownOpen,
    });
  }

  getBrand() {
    let brandName = "Dashboard";
    routes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  }
  openSidebar() {
    document.documentElement.classList.toggle("nav-open");
    this.sidebarToggle.current.classList.toggle("toggled");
  }
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  updateColor() {
    if (window.innerWidth < 993 && this.state.isOpen) {
      this.setState({
        color: "dark",
      });
    } else {
      this.setState({
        color: "transparent",
      });
    }
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateColor.bind(this));

    console.log(parseInt(Cookies.get('merchantUser')))
    console.log(JSON.parse(Cookies.get('authToken')))

    let authToken = JSON.parse(Cookies.get('authToken'))

    // GET NOTIFICATIONS
    axios.get(`/notification/merchant/${parseInt(Cookies.get('merchantUser'))}`, 
    {
      headers: {
        AuthToken: authToken
      }
    }).then((res) => {
      const notifs = res.data
      this.setState({notifications: notifs})
    }).catch (function(error){
      console.log(error.response.data)
    })

    // GET ANNOUNCEMENTS
    axios.get("/announcements", 
    {
        headers: {
            AuthToken: authToken
        }
    }).then(res => {
      const anncemts = res.data
      this.setState({announcements: anncemts})
    }).catch (function(error){
      console.log(error.response.data)
    })

  }

  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      this.sidebarToggle.current.classList.toggle("toggled");
    }
  }


  render() {
    return (
      <Navbar
        color={
          this.props.location.pathname.indexOf("full-screen-maps") !== -1
            ? "dark"
            : this.state.color
        }
        expand="lg"
        className={
          this.props.location.pathname.indexOf("full-screen-maps") !== -1
            ? "navbar-absolute fixed-top"
            : "navbar-absolute fixed-top " +
              (this.state.color === "transparent" ? "navbar-transparent " : "")
        }
      >
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-toggle">
              <button
                type="button"
                ref={this.sidebarToggle}
                className="navbar-toggler"
                onClick={() => this.openSidebar()}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand href="/">{this.getBrand()}</NavbarBrand>
          </div>
          <NavbarToggler onClick={this.toggle}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse
            isOpen={this.state.isOpen}
            navbar
            className="justify-content-end"
          >
            <Nav navbar>

              {/* NOTIFICATIONS */}
              <Dropdown nav isOpen={this.state.dropdownOpen} toggle={(e) => this.dropdownToggle(e)}>
                <DropdownToggle caret nav className="dropdown-toggle-split">
                  <i className="nc-icon nc-bell-55" />
                </DropdownToggle>
                <DropdownMenu right className="pre-scrollable">
                  <DropdownItem header>Notifications</DropdownItem>
                  {this.state.notifications.map(notification => 
                    <div key={notification.id}>
                      <DropdownItem>
                        <div>
                          <p>{notification.title}</p>
                          <br></br>
                          <p className="text-muted">{notification.description}</p>
                        </div>
                      </DropdownItem>
                      <DropdownItem divider />
                    </div>
                    )}
                </DropdownMenu>
              </Dropdown>

              {/* ANNOUNCEMENTS */}
              <Dropdown nav isOpen={this.state.annDropdownOpen} toggle={(e) => this.annDropdownToggle(e)}>
                <DropdownToggle caret nav className="dropdown-toggle-split">
                  <i className="nc-icon nc-chat-33" />
                </DropdownToggle>
                <DropdownMenu right className="pre-scrollable">
                  <DropdownItem header>Announcements</DropdownItem>
                  {this.state.announcements.map(announcement => 
                    <div key={announcement.id}>
                      <DropdownItem>
                        <div>
                          <p>{announcement.title}</p>
                          <br></br>
                          <p className="text-muted">{announcement.description}</p>
                        </div>
                      </DropdownItem>
                      <DropdownItem divider/>
                    </div>
                    )}
                </DropdownMenu>
              </Dropdown>

              <NavItem>
                <Link to="#pablo" className="nav-link btn-rotate">
                  <i className="nc-icon nc-settings-gear-65" />
                  <p>
                    <span className="d-lg-none d-md-block">Account</span>
                  </p>
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

// to use when viewing 
function formatDate(d) {
  if (d === undefined){
      d = (new Date()).toISOString()
      console.log(undefined)
  }
  let currDate = new Date(d);
  console.log("currDate: " + currDate)
  let year = currDate.getFullYear();
  let month = currDate.getMonth() + 1;
  let dt = currDate.getDate();
  let time = currDate.toLocaleTimeString('en-SG')

  if (dt < 10) {
      dt = '0' + dt;
  }
  if (month < 10) {
      month = '0' + month;
  }

  return dt + "/" + month + "/" + year + " " + time ;
}

export default Header;
