/*!

=========================================================
* Paper Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/Tables.js";
import Maps from "views/Map.js";
import UserPage from "views/User.js";
import Profile from "views/Profile";
import Advertisements from "views/Advertisements";
import Promotions from "views/Promotions";
import Bookings from "views/Bookings";
import Announcements from "views/Announcements";
import Products from "views/Products";
import Credits from "views/Credits";
import Orders from "views/Orders";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-layout-11",
    component: Dashboard,
    layout: "/admin",
  },
  /*{
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    component: Icons,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: UserPage,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Table List",
    icon: "nc-icon nc-tile-56",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-caps-small",
    component: Typography,
    layout: "/admin",
  },*/
  {
    path: "/profile",
    name: "Profile",
    icon: "nc-icon nc-badge",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/credits",
    name: "Credits",
    icon: "nc-icon nc-money-coins",
    component: Credits,
    layout: "/admin"
  },
  {
    path: "/products",
    name: "Products",
    icon: "nc-icon nc-shop",
    component: Products,
    layout: "/admin"
  },
  {
    path: "/bookings",
    name: "Bookings",
    icon: "nc-icon nc-bookmark-2",
    component: Bookings,
    layout: "/admin"
  },
  {
    path: "/orders",
    name: "Orders",
    icon: "nc-icon nc-paper",
    component: Orders,
    layout: "/admin"
  },
  {
    path: "/promotions",
    name: "Promotions",
    icon: "nc-icon nc-tag-content",
    component: Promotions,
    layout: "/admin"
  },
  {
    path: "/advertisements",
    name: "Advertisements",
    icon: "nc-icon nc-image",
    component: Advertisements,
    layout: "/admin"
  },
  {
    path: "/announcements",
    name: "Announcements",
    icon: "nc-icon nc-chat-33",
    component: Announcements,
    layout: "/admin"
  },
];
export default routes;
