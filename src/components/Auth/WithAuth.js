/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
// import { getAuth, isAuthenticated } from '@services/identity.service';
// import { isProtected } from './Security';
import { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import PropTypes from "prop-types";
import * as ProtectedRoutes from "./Security";
import { useRouter } from "next/router";
import { getProfileAuth, isInRole, setRole } from "../../service/identity.service";
import { handleRoleFlat, scopeMethod } from "../../utils/method";

export const WithAuth = (props) => {
  const { children } = props;
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);


  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (ignore.current) {
      return;
    }
    // profile data from local storage
    const dataProfile = getProfileAuth();

    const profileRole = handleRoleFlat(dataProfile?.role);
    const scopeOfRole = scopeMethod(profileRole);
    setRole(scopeOfRole);

    ignore.current = true;

    let validUser = false;

    if (scopeOfRole && scopeOfRole === "SUPER_ADMIN") {
      validUser = ProtectedRoutes.SUPER_ADMIN(router.pathname);
    }
    if (scopeOfRole && scopeOfRole === "CLUB_MANAGER") {
      validUser = ProtectedRoutes.CLUB_MANAGER(router.pathname);
    }
    if (scopeOfRole && scopeOfRole === "PROPERTY_OWNER") {
      validUser = ProtectedRoutes.PROPERTY_OWNER(router.pathname);
    }
    if (scopeOfRole && scopeOfRole === "USER") {
      validUser = ProtectedRoutes.USER(router.pathname);
    }
    // if (scopeOfRole && scopeOfRole === "PROMOTER") {
    //   validUser = ProtectedRoutes.PROMOTER(router.pathname);
    // }
    // if (scopeOfRole && scopeOfRole === "DJ") {
    //   validUser = ProtectedRoutes.DJ(router.pathname);
    // }

  
    if (validUser) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [router.isReady]);

  if (checked) {
    location.replace('/404')
    return;
  } else {
    return children;
  }
};

WithAuth.propTypes = {
  children: PropTypes.node,
};
