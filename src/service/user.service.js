import * as HttpService from './http.service';
// eslint-disable-next-line no-undef
const ApiUrl = process.env.NEXT_PUBLIC_API_URL;
const MasterUrl = process.env.NEXT_PUBLIC_MASTER_API_URL;


export const loginUser = (user) => {
  return HttpService.postWithAuth(`${ApiUrl}/users`, user);
};

export const getAllUsers = () => {
  return HttpService.getWithAuth(`${ApiUrl}/users`);
};

export const getUsersPaginated = (params) => {
  return HttpService.getWithAuth(
    `${ApiUrl}/users-paginated?page=${params.page}&name=${params.name}&email=${params.email}&status=${params.status}&role=${params.role}`
  );
};

export const updateUser = (user) => {
  return HttpService.putWithAuth(`${ApiUrl}/users`, user);
};

export const getUsers = () => {
  return HttpService.getWithAuth(`${ApiUrl}/users`);
};

export const getUser = (userId) => {
  return HttpService.getWithAuth(`${ApiUrl}/users/${userId}`);
};

export const changePassword = (user) => {
  return HttpService.putWithOutAuth(`${ApiUrl}/user/password`, user);
};

export const postAddProperty = (user) => {
  return HttpService.putWithAuth(`${ApiUrl}/property/add_property/`, user);
}