import Dashboard from "views/Dashboard.js";
import Profile from "views/User/Profile";
import Advertisements from "views/Advertisement/Advertisements";
import Promotions from "views/Promotion/Promotions";
import Bookings from "views/Booking/Bookings";
import Products from "views/Product/Products";
import Credits from "views/Payment/Credits";
import Orders from "views/Order/Orders";
//import TestProducts from "views/Product/TestProducts"
import ListProduct from "views/Product/ListProduct";
import ProductDetails from "./views/Product/ProductDetails";
import ListAdvertisement from "./views/Advertisement/ListAdvertisement"
import AdvertisementDetails from "./views/Advertisement/AdvertisementDetails"
import PromotionDetails from "views/Promotion/PromotionDetails";
import OrderDetails from "views/Order/OrderDetails";
import ChooseBookingPackageModel from "views/Booking/ChooseBookingPackageModel"
import BookingPackages from "views/BookingPackage/BookingPackages";
import BookingPackageDetails from "views/BookingPackage/BookingPackageDetails.";

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
  // {
  //   path: "/credits",
  //   name: "Credits",
  //   icon: "nc-icon nc-money-coins",
  //   component: Credits,
  //   layout: "/admin"
  // },
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
    path: "/productDetails",
    name: "Product Details",
    icon: "nc-icon nc-shop",
    component: ProductDetails,
    layout: "/admin",
    invisible: true
  },
  // {
  //   path: "/testProducts",
  //   name: "Test Products",
  //   icon: "nc-icon nc-shop",
  //   component: TestProducts,
  //   layout: "/admin"
  // },
  {
    path: "/bookings",
    name: "Bookings",
    icon: "nc-icon nc-bookmark-2",
    component: Bookings,
    layout: "/admin"
  },
  {
    path: "/bookingPackages",
    name: "Booking Packages",
    icon: "nc-icon nc-box",
    component: BookingPackages,
    layout: "/admin"
  },
  {
    path: "/bookingPackageDetails",
    name: "Booking Package Details",
    icon: "nc-icon nc-box",
    component: BookingPackageDetails,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/orders",
    name: "Orders",
    icon: "nc-icon nc-paper",
    component: Orders,
    layout: "/admin"
  },
  {
    path: "/orderDetails",
    name: "Order Details",
    icon: "nc-icon nc-paper",
    component: OrderDetails,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/promotions",
    name: "Promotions",
    icon: "nc-icon nc-tag-content",
    component: Promotions,
    layout: "/admin"
  },
  {
    path: "/promotionDetails",
    name: "Promotion Details",
    icon: "nc-icon nc-tag-content",
    component: PromotionDetails,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/advertisements",
    name: "Advertisements",
    icon: "nc-icon nc-image",
    component: Advertisements,
    layout: "/admin"
  },
  {
    path: "/listAdvertisement",
    name: "List an Advertisement",
    icon: "nc-icon nc-image",
    component: ListAdvertisement,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/advertisementDetails",
    name: "Advertisement Details",
    icon: "nc-icon nc-image",
    component: AdvertisementDetails,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/chooseBookingPackageModel",
    name: "Choose Booking Package Model",
    icon: "nc-icon nc-image",
    component: ChooseBookingPackageModel,
    layout: "/admin",
    invisible: true
  }
];
export default routes;
