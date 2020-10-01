import Dashboard from "views/Dashboard.js";
import Profile from "views/User/Profile";
import Advertisements from "views/Advertisement/Advertisements";
import Promotions from "views/Promotion/Promotions";
import Bookings from "views/Booking/Bookings";
import Products from "views/Product/Products";
import Credits from "views/Payment/Credits";
import Orders from "views/Order/Orders";
import TestProducts from "views/Product/TestProducts"
import ListProduct from "views/Product/ListProduct";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-layout-11",
    component: Dashboard,
    layout: "/admin",
  },
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
    path: "/listProduct",
    name: "List A Product",
    icon: "nc-icon nc-shop",
    component: ListProduct,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/testProducts",
    name: "Test Products",
    icon: "nc-icon nc-shop",
    component: TestProducts,
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
  }
];
export default routes;
