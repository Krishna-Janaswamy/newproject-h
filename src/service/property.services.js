import * as HttpService from "./http.service";

const PropertyUrl = process.env.NEXT_PUBLIC_PROPERTY_API_URL;

export const getAddProperty = () => {
  fetch("/api/property")
    .then((response) => response.json())
    .then((data) => {
      return data?.results;
    });
};

export const getAddParty = (userID) => {
  return HttpService.getMasterAuth(`${PropertyUrl}/add_party/?user_id=${userID}`);
};

export const getFlashDeal = (userID) => {
  return HttpService.getMasterAuth(`${PropertyUrl}/add_flash_deal/?user_id=${userID}`);
};

export const getUpdateParty = (partyID) => {
  return HttpService.getMasterAuth(`${PropertyUrl}/update_party/${partyID}`);
};

export const getUpdatFlashDeal = (flashDealID) => {
  return HttpService.getMasterAuth(`${PropertyUrl}/update_flash_deal/${flashDealID}`);
};

export const patchUpdateParty = (partyID, updateParty) => {
  return HttpService.patchWithAuth(`${PropertyUrl}/update_party/${partyID}/`, updateParty);
};

export const getAddDeal = (userID) => {
  return HttpService.getMasterAuth(`${PropertyUrl}/add_deal/?user_id=${userID}`);
};

//Deals
export const postAddDeal = (postDeal) => {
  return HttpService.postWithAuthorization(`${PropertyUrl}/add_deal/`, postDeal);
};

export const getUpdateDeal = (dealID) => {
  return HttpService.getMasterAuth(`${PropertyUrl}/update_deal/${dealID}`);
};

export const patchUpdateDeal = (dealID, updateDeal) => {
  return HttpService.patchWithAuth(`${PropertyUrl}/update_deal/${dealID}/`, updateDeal);
};

export const patchUpdateFlashDeal = (partyID, updateFlashDeal) => {
  return HttpService.patchWithAuth(`${PropertyUrl}/update_flash_deal/${partyID}/`, updateFlashDeal);
};

export const deleteDealId = (id) => {
  return HttpService.deleteWithAuthorization(`${PropertyUrl}/update_deal/${id}/`);
};

export const postAddProperty = (newProperty) => {
  return HttpService.postWithAuthorization(`${PropertyUrl}/add_property_web/`, newProperty);
};

export const postPropertyVerify = (status) => {
  return HttpService.postWithAuthorization(`${PropertyUrl}/property_verify/`, status);
};

export const getUpdatedProperty = (id) => {
  return HttpService.getMasterAuth(`${PropertyUrl}/update_property_web/${id}/`);
};

export const patchUpdatedProperty = (id, patchData) => {
  return HttpService.patchWithAuth(`${PropertyUrl}/update_property_web/${id}/`, patchData);
};

export const deletePropertyId = (id) => {
  return HttpService.deleteWithAuthorization(`${PropertyUrl}/update_property_web/${id}/`);
};

export const deletePartyId = (id) => {
  return HttpService.deleteWithAuthorization(`${PropertyUrl}/update_party/${id}/`);
};

export const deleteFlashDealId = (id) => {
  return HttpService.deleteWithAuthorization(`${PropertyUrl}/update_flash_deal/${id}/`);
};

export const postSocialToAddProperty = (postImages) => {
  return HttpService.postWithAuthorization(`${PropertyUrl}/add_property_social/`, postImages);
};

export const postAddParty = (postParty) => {
  return HttpService.postWithAuthorization(`${PropertyUrl}/add_party/`, postParty);
};

export const postAddFlashDeal = (postFlashDeal) => {
  return HttpService.postWithAuthorization(`${PropertyUrl}/add_flash_deal/`, postFlashDeal);
};

export const postPropertyEmailVerification = (email) => {
  return HttpService.postEaimVerifySevice(`${PropertyUrl}/send_otp_mail_verified_property/`, email);
};

export const patchSocialToUpdateProperty = (patchData, id) => {
  return HttpService.patchWithAuth(`${PropertyUrl}/update_property_social/${id}/`, patchData);
};

export const updateFacilitiesProperty = (id, updateData) => {
  return HttpService.patchWithAuth(`${PropertyUrl}/update_property_web/${id}/`, updateData);
};

export const postAddPropertyDetails = (updateData) => {
  return HttpService.postWithAuthorization(`${PropertyUrl}/add_property_web/`, updateData);
};

//Enquiry
export const getEnquiry = () => {
  return HttpService.getMasterAuth(`${PropertyUrl}/club_owner_take_action_on_user_enquiry/`);
};

export const enquiryData = (patchData) => {
  return HttpService.patchWithAuth(
    `${PropertyUrl}/club_owner_take_action_on_user_enquiry/`,
    patchData
  );
};
