import { useEffect, useRef, useState, useContext } from "react";
import Router from "next/router";
import NextLink from "next/link";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Logo } from "../../components/logo";
import { AuthContext } from "../../contexts/auth-context";
import { getAuth, setProfileAuth, setRole } from "../../service/identity.service";
import { handleRoleFlat, scopeMethod } from "../../utils/method";
import profileData from '../../data/profile.json';

const parseUrl = () => {
  // const token = getAuth();
  const  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  return { token };
};

const Page = () => {
  const authContext = useContext(AuthContext);
  const confirmed = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const profile = profileData?.results

  setProfileAuth(profile);
  // const profileRole = handleRoleFlat(profile?.role);
  const scopeOfRole = scopeMethod('SUPER_ADMIN');
  setRole(scopeOfRole);

  const confirm = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (confirmed.current) {
      return;
    }

    confirmed.current = true;

    // Extract the token from the page URL
    const { token } = parseUrl();

    try {
      // This can be call inside AuthProvider component, but we do it here for simplicity

      // Get the user from your database
      const user = token;

      if (!token) {
        Router.push("/sign-in").catch(console.error);
        return;
      }

      // Update Auth Context state
      authContext.signIn(user);
      if (user) {
        if (profile && profile?.first_name) {
          Router.push("/property").catch(console.error);
        }
        if (profile && !profile?.first_name) {
          Router.push("/profile").catch(console.error);
        }
        return;
      }

      // Redirect to home page
      // Router.push("/").catch(console.error);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    confirm().catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Box sx={{ p: 3 }}>
          <NextLink href="/" passHref>
            <a>
              <Logo
                sx={{
                  height: 42,
                  width: 42,
                }}
              />
            </a>
          </NextLink>
        </Box>
        <Typography sx={{ mb: 1 }} variant="h4">
          Oops!
        </Typography>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  return null;
};

// Page.getInitialProps = async () => {
//   // const  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
//   // const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   // const res = await fetch(`${baseUrl}/api/account/profile/`, {
//   //   method: "GET",
//   //   headers: {
//   //     Authorization: `Bearer ${token}`,
//   //   },
//   // });
//   // const json = await res.json();
//   return { profile: profileData };
// };

export default Page;
