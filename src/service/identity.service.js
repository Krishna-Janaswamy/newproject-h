import { color } from "@mui/system";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getAuth = () => {
  const auth = cookies.get("AUTH");
  return auth;
};

export const getProfileAuth = () => {
  const auth = cookies.get("ProfileAuth");
  return auth;
};

export const getUserMobile = () => {
  const auth = cookies.get("mobile");
  return auth;
};

export const getRole = () => {
  const auth = cookies.get("role");
  return auth;
};

export const setAuth = (authObject) => {
  cookies.set("AUTH", JSON.stringify(authObject), { path: "/" });
  return authObject;
};

export const setProfileAuth = (authObject) => {
  cookies.set("ProfileAuth", JSON.stringify(authObject), { path: "/" });
  return authObject;
};

export const setRole = (authObject) => {
  cookies.set("role", JSON.stringify(authObject), { path: "/" });
};

export const setUserMobile = (authObject) => {
  cookies.set("mobile", JSON.stringify(authObject), { path: "/" });
  return authObject;
};

export const removeAuth = () => {
  cookies.remove("AUTH", { path: "/" });
  return;
};

export const removeUserMobile = () => {
  cookies.remove("mobile", { path: "/" });
  return;
};

export const removeProfileAuth = () => {
  cookies.remove("ProfileAuth", { path: "/" });
};

export const removeRole = () => {
  cookies.remove("role", { path: "/" });
};

export const isInRole = (role, roles) => {
  return roles && roles.includes(role);
};

export const isAuthenticated = (user) => {
  return user && user != null && user.token;
};

export const getMenu = (user) => {};

const menu = {
  admin: {
    main: [
      { name: "Dashboard", url: "/dashboard" },
      { name: "Manage Properties", url: "/property" },
      { name: "Manage Deals", url: "/deals" },
    ],
  },
};
