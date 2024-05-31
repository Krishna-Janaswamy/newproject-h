import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getProfileData } from '../service/account.service';
import { getAuth, setProfileAuth, setRole } from '../service/identity.service';
import { handleRoleFlat, scopeMethod } from '../utils/method';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  UPDATEPROFILE:'UPDATEPROFILE',
  MOBILE: "MOBILE",
  ROLE: "ROLE"
};


const initialState = {
  isAuthenticated: false,
  defaultRole: '',
  isLoading: true,
  user: null,
  profile:null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload?.user;
    const role = action.payload?.role;
    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user,
            role
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  },
  [HANDLERS.UPDATEPROFILE]:(state,action)=>{
    const profile = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      profile:profile,
    }
  },
  [HANDLERS.MOBILE]:(state,action)=>{
    const mobile = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      profile:{
      ...state.profile,  
      mobile: mobile
      },
    }
  },
  [HANDLERS.ROLE]:(state,action)=>{
    const Role = action.payload;
    return {
      ...state,
    role: Role,
    }
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });
AuthContext.displayName = 'AuthContext';

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  const [profileData, setProfileData] = useState([]);


  const initialize = async () => {

    
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    try {
      // Check if user is authenticated
      const isAuthenticated = getAuth();

      if (isAuthenticated) {
        fetch("/api/profile")
        .then((response) => response.json())
        .then((data) => {
        setProfileAuth(data?.results);
        const profileRole = handleRoleFlat(data?.results?.role);
        const scopeOfRole = scopeMethod(profileRole);
        setRole(scopeOfRole);
        
        // Get user from your database
         const user = isAuthenticated;
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: {
            user,
            profile: data?.results,
            role: scopeOfRole
          }
        });
        dispatch({
          type: HANDLERS.UPDATEPROFILE,
          payload: data?.results
        });
      })
      } else {
        dispatch({
          type: HANDLERS.INITIALIZE
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(() => {
    initialize().catch(console.error);
  }, []);

  const signIn = (user) => {
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  const updateProfile = (profile)=>{
    dispatch({
      type:HANDLERS.UPDATEPROFILE,
      payload:profile
    })
  }

  const updateMobile = (mobile)=>{
    dispatch({
      type:HANDLERS.MOBILE,
      payload:mobile
    })
  }

  const updateRole = (role)=>{
    dispatch({
      type:HANDLERS.ROLE,
      payload:role
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        updateProfile,
        updateMobile,
        updateRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
