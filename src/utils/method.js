import { isInRole } from "../service/identity.service";

export const formatState = (contents) => {
  const updateFormat = contents.map(({ name: label, code: value, ...rest }) => ({
    value,
    label,
    ...rest,
  }));
  return updateFormat;
};

export const formatManager = (contents) => {
  const updateFormat =
    contents.length &&
    contents.map(({ email: name, ...rest }) => ({
      name,
      ...rest,
    }));
  return updateFormat;
};
export const formatManagerUpdate = (contents) => {
  const updateFormat = contents.length
    ? contents.map(({ email: name, ...rest }) => ({
        name,
        ...rest,
        isSelected: true,
      }))
    : [];
  return updateFormat;
};

export const formatFacilities = (contents) => {
  const updateFormat = contents.map((content) => ({
    ...content,
    isSelected: false,
  }));
  return updateFormat;
};

export const formatIncomingPayments = (paymentContent, getPayments) => {
  const updatedPayments = paymentContent && paymentContent.filter((payment) => payment?.id);
  paymentContent.filter((payment) =>
    getPayments.some((getpayment) =>
      getpayment?.id === payment?.id ? (payment.isSelected = true) : (payment.isSelected = false)
    )
  );
  return updatedPayments;
};

export const formatIncomingFacilities = (paymentContent, getPayments) => {
  const updatedPayments = paymentContent && paymentContent.filter((payment) => payment?.id);
  paymentContent?.filter((payment) =>
    getPayments.some((getpayment) =>
      getpayment?.id === payment?.id ? (payment.isSelected = true) : (payment.isSelected = false)
    )
  );
  return updatedPayments;
};

export const filterIdToPost = (items) =>
  items && items.length !== 0
    ? items.map((item) => {
        let res = [];
        res.push(item?.id);
        return res[0];
      })
    : [];

    export const filterManagerMobile = (items) =>
    items && items.length !== 0
      ? items.map((item) => {
          let res = [];
          res.push(item?.mobile);
          return res[0];
        })
      : [];

export const filterIdToPostTrue = (items) => {
  const selectTrueId = items.filter((item) => item?.isSelected === true);
  const updatePost =
    selectTrueId && selectTrueId.length !== 0
      ? selectTrueId.map((item) => {
          let res = [];
          res.push(item?.id);
          return res[0];
        })
      : [];
  return updatePost;
};

export const formateUpdatedImagesGet = (contents) => {
  const updateFormat = contents?.map((content) => ({
    ...content,
    isSelected: true,
  }));
  return updateFormat;
};

export const formateInitialState = (contents) => {
  const updateFormat = contents.map((content) => ({
    ...content,
    isSelected: false,
    isEditDots: false,
  }));
  return updateFormat;
};

export const initialStateAddProperty = {
  name: "",
  description: "",
  email: "",
  state: "",
  city: "",
  country: 1,
  pin_code: "",
  opening_time: "",
  closing_time: "",
  seating_capacity: "",
  total_capacity: "",
  fee: "",
  lat: "",
  long: "",
  payment: [],
  manager: [],
  facilities: [],
  exterior_instagram: "",
  exterior_facebook: "",
  interior_instagram: "",
  interior_facebook: "",
  instagram: "",
  youtube: "",
  facebook: "",
  twitter: "",
  exterior_gallery: [],
  interior_gallery: [],
  menu_place: [],
  promoter: [],
  property_code: "",
  video_file: [],
  documents: [],
};

export const formateIsLoadingFalse = (contents) => {
  const updateFormat =
    contents &&
    contents.map((content) => ({
      ...content,
      isLoading: false,
    }));
  return updateFormat;
};

export const formateIsLoadingTrue = (contents) => {
  const updateFormat =
    contents &&
    contents.map((content) => {
      if (content.isLoading === false) {
        return {
          isLoading: true,
          ...content,
        };
      }
      return content;
    });
  return updateFormat;
};

export const getActiveStatus = (items) => {
  const today = new Date();
  const isFormated = today.toISOString();
  const updateData =
    items &&
    items.map((item) => {
      if (item) {
        return {
          isActive: item.end_date >= isFormated,
          ...item,
        };
      }
      return item;
    });
  return updateData;
};

export const toUpperCase = (contents) => {
  const updateFormat =
    contents &&
    contents.map((content) => ({
      ...content,
      name: content?.name.toUpperCase().replace(" ", "_"),
    }));
  return updateFormat;
};

export const toUpperCaseFlat = (contents) => {
  let value = "USER";
  contents &&
    contents.map((content) => {
      if (content.name === "SUPER_ADMIN") {
        value = content.name;
      } else if (content.name === "CLUB_OWNER") {
        value === content.name;
      }
    });
  return value;
};

export const handleRoleFlat = (contents) => {
  let value = [];
  contents &&
    contents.map((content) => {
      value.push(content?.name.toUpperCase().replace(" ", "_"));
    });
  return value;
};

export const scopeMethod = (roles) => {
  let SUPER_ADMIN = false;
  let CLUB_OWNER = false;
  let CLUB_MANAGER = false;
  let PROMOTER = false;
  let DJ = false;
  let USER = false;
  let PROPERTY_OWNER = false;
  let scope = "";
  if (roles.length) {
    SUPER_ADMIN = isInRole("SUPER_ADMIN", roles);
    CLUB_OWNER = isInRole("CLUB_OWNER", roles);
    PROPERTY_OWNER = isInRole("PROPERTY_OWNER", roles);
    CLUB_MANAGER = isInRole("CLUB_MANAGER", roles);
    PROMOTER = isInRole("PROMOTER", roles);
    DJ = isInRole("DJ", roles);
    USER = isInRole("USER", roles);

    switch ((scope, SUPER_ADMIN, CLUB_MANAGER, CLUB_OWNER, PROPERTY_OWNER, USER)) {
      case SUPER_ADMIN === true: {
        scope = "SUPER_ADMIN";
        break;
      }
      case CLUB_MANAGER === true && PROPERTY_OWNER === true: {
        scope = "CLUB_MANAGER";
        break;
      }
      case CLUB_MANAGER === true: {
        scope = "CLUB_MANAGER";
        break;
      }
      case PROPERTY_OWNER === true: {
        scope = "PROPERTY_OWNER";
        break;
      }
      case CLUB_OWNER === true: {
        scope = "CLUB_OWNER";
        break;
      }
      case PROMOTER === true: {
        scope = "PROMOTER";
        break;
      }
      case DJ === true: {
        scope = "DJ";
        break;
      }
      case USER === true: {
        scope = "USER";
        break;
      }
      default: {
        return scope;
      }
    }
    return scope;
  }
};
