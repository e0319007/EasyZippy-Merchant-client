import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import Badge from '@material-ui/core/Badge';
import { makeStyles } from '@material-ui/core/styles';
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
  Container,
  NavLink, CardText, CardBody,
  NavbarText
} from "reactstrap";

import routes from "routes.js";
import { Card } from "@material-ui/core";
import { maxWidth } from "@material-ui/system";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      annDropdownOpen: false, //announcement drop down
      color: "transparent",
      merchantId: parseInt(Cookies.get('merchantUser')),
      creditBalance: localStorage.getItem('currentMerchant').creditBalance,
      authToken: JSON.parse(Cookies.get('authToken')),
      notifications: [],
      announcements: [],
      notifBadgeVisible: false
    };
    this.toggle = this.toggle.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.annDropdownToggle = this.annDropdownToggle.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.sidebarToggle = React.createRef();
    this.logout = this.logout.bind(this);
    // this.handleNotifVisibility = this.handleNotifVisibility.bind(this);

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
    //once dropdown, then mark all notifications as read 
    console.log("inside notifications dropdown toggle")
    let n = this.state.notifications;
    for (var i in n) {
      console.log("n index read: " + n[i].read)
      if (n[i].read === false) {
        n[i].read = true
        axios.put(`/readNotification/${n[i].id}`, {
          read: true
        },
        {
          headers: {
            AuthToken: this.state.authToken
          }
        }).then(res => {
          console.log("notifications set to read // axios went through")
        }).catch (function (err){
          console.log(err.response.data)
        })
      } else { //true
        continue;
      }
    }

    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      notifications: n,
      notifBadgeVisible: false
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
    console.log(JSON.parse(Cookies.get('authToken')))
    const merc = JSON.parse(localStorage.getItem('currentMerchant'))
    // GET NOTIFICATIONS
    axios.get(`/notification/merchant/${parseInt(Cookies.get('merchantUser'))}`, 
    {
      headers: {
        AuthToken: this.state.authToken
      }
    }).then((res) => {
      const notifs = res.data
      this.setState({notifications: notifs})
      let n = this.state.notifications;
      for(var i in n) {
        if (n[i].read === false) {
          this.setState({
            notifBadgeVisible: true
          })
        }
        break;
      }
    }).catch (function(error){
      console.log(error.response.data)
    })

    // GET ANNOUNCEMENTS
    axios.get("/announcements", 
    {
        headers: {
            AuthToken: this.state.authToken
        }
    }).then(res => {
      const anncemts = res.data
      this.setState({announcements: anncemts})
    }).catch (function(error){
      console.log(error)
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

  componentWillReceiveProps(e) {
    //if this isn't the first render, then keep updating when re-render
    if (this.state.notifications.length != 0) {
      axios.get(`/notification/merchant/${parseInt(Cookies.get('merchantUser'))}`, 
      {
        headers: {
          AuthToken: this.state.authToken
        }
      }).then((res) => {
        const notifs = res.data
        //checking if there are new notifications
        if (notifs.length > this.state.notifications.length) {
          this.setState({
            notifBadgeVisible: true
          })
        }
        this.setState({notifications: notifs})
      }).catch (function(error){
        console.log(error.response.data)
      })
    }

    //just to keep fetching in case got new i suppose
    if (this.state.announcements.length != 0) {
      axios.get("/announcements", 
      {
          headers: {
              AuthToken: this.state.authToken
          }
      }).then(res => {
        const anncemts = res.data
        this.setState({announcements: anncemts})
      }).catch (function(error){
        console.log(error.response.data)
      })
    }
  }

  logout(e) {
    console.log("in logout")
    Cookies.remove('authToken')
    Cookies.remove('merchantUser')
    localStorage.clear()
  }

  // to use when viewing 
  formatDate(d) {
    if (d === undefined){
        d = (new Date()).toISOString()
    }
    let currDate = new Date(d);
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

              <NavItem style={{paddingTop:"14px"}}>
                <Badge color="secondary" variant="dot" invisible={true}>
                  <i className="nc-icon nc-money-coins" />
                </Badge>
              </NavItem>

              <NavItem>
                &nbsp;&nbsp;
              </NavItem>

              <NavItem style={{paddingTop:"6px"}}>
                {/* <Badge color="secondary" variant="dot" invisible={true}> */}
                <NavbarText>
                  ${parseFloat(JSON.parse(localStorage.getItem('currentMerchant')).creditBalance).toFixed(2)}
                </NavbarText>
                {/* </Badge> */}
              </NavItem>
              
              <NavItem>
                &nbsp;
              </NavItem>

              {/* NOTIFICATIONS */}
              <Dropdown nav isOpen={this.state.dropdownOpen} toggle={(e) => this.dropdownToggle(e)}>
                <DropdownToggle caret nav className="dropdown-toggle-split">
                <Badge color="secondary" variant="dot" invisible={!this.state.notifBadgeVisible}>
                  <i className="nc-icon nc-bell-55"/>
                </Badge>  
                </DropdownToggle>
                <DropdownMenu right className="pre-scrollable">
                  <DropdownItem header>Notifications</DropdownItem>
                  {this.state.notifications.map(notification => 
                    <div key={notification.id}>
                      <DropdownItem style={{backgroundColor: 'transparent', flexGrow:'inherit', whiteSpace:'pre-wrap', width:'20rem'}}>                          
                          <p style={{fontWeight:'bold', color:'grey'}}>{notification.title}</p> 
                          <br></br>
                          <small style={{color:'grey'}}>{this.formatDate(notification.sentTime)}</small>
                          <br></br>
                          <p className="text-muted">{notification.description}</p>
                      </DropdownItem>
                      <DropdownItem divider/>
                    </div>
                    ).reverse()}
                </DropdownMenu>
              </Dropdown>

              {/* ANNOUNCEMENTS */}
              <Dropdown nav isOpen={this.state.annDropdownOpen} toggle={(e) => this.annDropdownToggle(e)}>
                <DropdownToggle caret nav className="dropdown-toggle-split">
                  <Badge color="secondary" variant="dot" invisible={true}>
                    <i className="nc-icon nc-chat-33" />
                  </Badge>
                </DropdownToggle>
                <DropdownMenu right className="pre-scrollable"
                  // modifiers={{
                  //   preventOverflow:true,
                  //   overflow:'auto',
                  //   maxWidth:'20rem'
                  // }}
                >
                  <DropdownItem header >Announcements</DropdownItem>
                  {this.state.announcements.map(announcement => 
                    <div key={announcement.id}>
                      <DropdownItem style={{backgroundColor: 'transparent', flexGrow:'inherit', whiteSpace:'pre-wrap', width:'20rem'}}> 
                        <div>
                          <p style={{fontWeight:'bold', color:'grey'}}>{announcement.title}</p>
                          {/* <p style={{fontWeight:'bold'}}>{announcement.title}</p> */}
                          <br></br>
                          <small style={{color:'grey'}}>{this.formatDate(announcement.sentTime)}</small>
                          <br></br>
                          <p className="text-muted">{announcement.description}</p>
                        </div>
                      </DropdownItem>
                      <DropdownItem divider/>
                    </div>
                    ).reverse()}
                </DropdownMenu>
              </Dropdown>
              <NavItem style={{paddingTop:"4px"}}>
                <Badge color="secondary" invisible={true}>
                  <NavLink onClick={e => this.logout(e)} href='/login'>
                      Logout
                  </NavLink>
                </Badge>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Header;
