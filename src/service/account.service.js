import * as HttpService from "./http.service";

const AccountUrl = process.env.NEXT_PUBLIC_API_URL;

const MapKey = "AIzaSyAdIl0NYUPTd-NcOPtHcsxRv03goxDNPd8";

export const getProfileData = () => {
  fetch("/api/profile")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const getAddProperty = () => {
  fetch("/api/property")
    .then((response) => response.json())
    .then((data) => {
      return data?.results;
    });
};


export const getManagerWithNumber = (number) => {
  return HttpService.getMasterAuth(`${AccountUrl}/api/account/user_search/?mobile=${number}`);
};

export const patchProfileData = (data) => {
  return HttpService.patchWithAuth(`${AccountUrl}/api/account/profile/`, data);
};

export const patchUserRole = (id, data) => {
  return HttpService.patchWithAuth(`${AccountUrl}/api/account/user_role_change/${id}/`, data);
};

export const patchGenderData = (data) => {
  return HttpService.patchWithAuth(`${AccountUrl}/api/account/update_profile_detail/`, data);
};

export const patchProfileImage = (data) => {
  return HttpService.patchWithAuth(`${AccountUrl}/api/account/update_profile_image/`, data);
};

export const getFileRepo = () => {
  return HttpService.getMasterAuth(`${AccountUrl}/api/account/file_repo/`);
};

export const postFileRepo = (data) => {
  return HttpService.postWithAuth(`${AccountUrl}/api/account/file_repo/`, data);
};

export const deleteFileRepoImage = (id) => {
  return HttpService.deleteWithAuthorization(`${AccountUrl}/api/account/file_repo/${id}/`);
};

export const postAccountEmailVerification = (email) => {
  return HttpService.postWithAuthorization(`${AccountUrl}/api/account/send_otp_mail/`, email);
};

export const getRoleData = () => {
  return HttpService.getWithAuth(`${AccountUrl}/api/account/role/`);
};
