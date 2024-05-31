import * as HttpService from "./http.service";

const MasterUrl = process.env.NEXT_PUBLIC_MASTER_API_URL;

export const getFacilityContent = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/facilities_available/`);
};

export const getCountryContent = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/country/`);
};

export const getStateContent = (id) => {
  return HttpService.getMasterAuth(`${MasterUrl}/state_by_country/${id}/`);
};
export const getCityContent = (id) => {
  return HttpService.getMasterAuth(`${MasterUrl}/city_by_state/${id}/`);
};

export const getBarTypes = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/bar_type/`);
};

export const getBrandTypes = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/brand_type/`);
};

export const getDrinksTypes = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/drink_type/`);
};

export const getMusicTypes = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/music_type/`);
};

export const getGenderContent = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/gender/`);
};

export const getPropertyTypes = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/property_type/`);
};

export const getDealTypes = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/deal_type/`);
};

export const getEntryTypes = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/entry_type/`);
};

export const getPaymentsContent = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/payment_method/`);
};

export const getTermsAndCon = () => {
  return HttpService.getMasterAuth(`${MasterUrl}/deal_terms_and_conditions/`);
};
