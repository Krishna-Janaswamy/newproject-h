export const isProtected = (route) => {
  let unprotectedRoutes = ["/", "/reset-password", "/reset-password/verify"];
  return !unprotectedRoutes.includes(route);
};

export const USER = (route) => {
  let unAccessibleRoutes = [
    "/admin",
    "/admin/createpropertyadmin/",
    "admin/[paramId]",
    "/admin/*",
    "/party",
    "/party/createparty",
    "/party/[partyId]",
    "/deals",
    "/deals/createdeal/",
    "/deals/[dealId]",
    "/flashdeal",
    "/flashdeal/createflashdeal",
    "/flashdeal/[flashId]",
    "/assignrole",
  ];
  return unAccessibleRoutes.includes(route);
};

export const SUPER_ADMIN = (route) => {
  let unAccessibleRoutes = []; //INFO: admin can access all routes
  return unAccessibleRoutes.includes(route);
};

export const CLUB_MANAGER = (route) => {
  let unAccessibleRoutes = ["/admin", "/admin/createpropertyadmin/", "/assignrole"];
  return unAccessibleRoutes.includes(route);
};

export const PROPERTY_OWNER = (route) => {
  let unAccessibleRoutes = ["/admin", "/admin/createpropertyadmin/", "/assignrole"];
  return unAccessibleRoutes.includes(route);
};

export const PROMOTER = (route) => {
  let unAccessibleRoutes = [];
  return unAccessibleRoutes.includes(route);
};
export const DJ = (route) => {
  let unAccessibleRoutes = [];
  return unAccessibleRoutes.includes(route);
};
