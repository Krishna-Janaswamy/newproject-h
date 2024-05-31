import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { User as UserIcon } from '../icons/user';
import LiquorIcon from '@mui/icons-material/Liquor';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { NavItem } from './nav-item';
import { AuthContext } from '../contexts/auth-context';
import { getRole } from '../service/identity.service';

const items = [
  {
    href: '/property',
    icon: (<LocationCityIcon fontSize="small" />),
    title: 'Properties'
  },
  {
    href: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: "/admin",
    icon: <UserIcon fontSize="small" />,
    title: "Administrator",
  },
  {
    href: '/assignmanager',
    icon: (<ManageAccountsIcon fontSize="small" />),
    title: 'Assign Manager'
  },
  {
    href: '/party',
    icon: (<LiquorIcon fontSize="small" />),
    title: 'Parties'
  },
  {
    href: "/deals",
    icon: <LocalOfferIcon fontSize="small" />,
    title: "Deals",
  },
  {
    href: '/flashdeal',
    icon: (<FlashOnIcon fontSize="small" />),
    title: 'Flash Deals'
  },
  {
    href: '/enquiry',
    icon: (<LiveHelpIcon fontSize="small" />),
    title: 'Enquiries'
  },
];

const user_Items = [
  {
    href: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: '/property',
    icon: (<LocationCityIcon fontSize="small" />),
    title: 'Properties'
  },
];

const super_admin_Items = [
  {
    href: '/property',
    icon: (<LocationCityIcon fontSize="small" />),
    title: 'Properties'
  },
  {
    href: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: "/admin",
    icon: <UserIcon fontSize="small" />,
    title: "Administrator",
  },
  {
    href: '/assignrole',
    icon: (<ManageAccountsIcon fontSize="small" />),
    title: 'Assign Role'
  },
  {
    href: '/assignmanager',
    icon: (<ManageAccountsIcon fontSize="small" />),
    title: 'Assign Manager'
  },
  {
    href: '/party',
    icon: (<LiquorIcon fontSize="small" />),
    title: 'Parties'
  },
  {
    href: "/deals",
    icon: <LocalOfferIcon fontSize="small" />,
    title: "Deals",
  },
  {
    href: '/flashdeal',
    icon: (<FlashOnIcon fontSize="small" />),
    title: 'Flash Deals'
  },
  {
    href: '/enquiry',
    icon: (<LiveHelpIcon fontSize="small" />),
    title: 'Enquires'
  },
];

const club_manager_Items = [
  {
    href: '/property',
    icon: (<LocationCityIcon fontSize="small" />),
    title: 'Properties'
  },
  {
    href: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: '/party',
    icon: (<LiquorIcon fontSize="small" />),
    title: 'Parties'
  },
  {
    href: "/deals",
    icon: <LocalOfferIcon fontSize="small" />,
    title: "Deals",
  },
  {
    href: '/flashdeal',
    icon: (<FlashOnIcon fontSize="small" />),
    title: 'Flash Deals'
  },
  {
    href: '/enquiry',
    icon: (<LiveHelpIcon fontSize="small" />),
    title: 'Enquiries'
  },
];

const property_owner_Items = [
  {
    href: '/property',
    icon: (<LocationCityIcon fontSize="small" />),
    title: 'Properties'
  },
  {
    href: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: '/assignmanager',
    icon: (<ManageAccountsIcon fontSize="small" />),
    title: 'Assign Manager'
  },
  {
    href: '/party',
    icon: (<LiquorIcon fontSize="small" />),
    title: 'Parties'
  },
  {
    href: "/deals",
    icon: <LocalOfferIcon fontSize="small" />,
    title: "Deals",
  },
  {
    href: '/flashdeal',
    icon: (<FlashOnIcon fontSize="small" />),
    title: 'Flash Deals'
  },
  {
    href: '/enquiry',
    icon: (<LiveHelpIcon fontSize="small" />),
    title: 'Enquiries'
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });
  let role_items = user_Items;

  const roleOfUser = getRole()

  if (roleOfUser === 'USER') {
    role_items = user_Items;
  }
  if (roleOfUser === 'SUPER_ADMIN'){
    role_items = super_admin_Items;
  }

  if (roleOfUser === 'CLUB_MANAGER'){
    role_items = club_manager_Items;
  }
  if (roleOfUser === 'PROPERTY_OWNER'){
    role_items = property_owner_Items;
  }
  

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            {/* <NextLink
              href="/"
              passHref
            >
              <a>
                <Logo
                  sx={{
                    height: 42,
                    width: 42
                  }}
                />
              </a>
            </NextLink> */}
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                px: 3,
                py: "11px",
                borderRadius: 1,
              }}
            >
              <div>
                <Typography color="inherit" variant="subtitle1">
                  Welcome
                </Typography>
                <Typography color="inherit" variant="subtitle1">
                  To ProjectK
                </Typography>
              </div>
              {/* <SelectorIcon
                sx={{
                  color: 'neutral.500',
                  width: 14,
                  height: 14
                }}
              /> */}
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: "#2D3748",
            my: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {user_Items.map((item) => (
            <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
          ))}
        </Box>
        <Divider sx={{ borderColor: "#2D3748" }} />
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
