import axios from "axios";

import { getAuth } from "./identity.service";

export const postWithOutAuth = (url, entity) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, entity)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

export const getWithAuth = (url, params = {}, headers) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    if (headers) params["headers"] = headers;
    else
      params["headers"] = {
        authorization: `${auth}`,
      };
    axios
      .get(url, params)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

export const deleteWithAuth = (url, data, params = {}, headers) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    if (headers) params["headers"] = headers;
    else
      params["headers"] = {
        Authorization: `Bearer ${auth}`,
      };
    axios
      .delete(url, data, params)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

export const putWithAuth = (url, entity, headers) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    if (!headers) {
      headers = {
        headers: {
          authorization: `${auth}`,
        },
      };
    }
    axios
      .put(url, entity, headers)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

export const putWithOutAuth = (url, entity) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, entity)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

export const getMasterAuth = (url, params = {}, headers) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    if (headers) params["headers"] = headers;
    else
      params["headers"] = {
        Authorization: `Bearer ${auth}`,
      };
    axios
      .get(url, params)
      .then((response) => {
        if (response && response?.data) {
          resolve(response?.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};


export const getInitialAuth = (url, token, params = {}, headers) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    if (headers) params["headers"] = headers;
    else
      params["headers"] = {
        Authorization: `Bearer ${token}`,
      };
    axios
      .get(url, params)
      .then((response) => {
        if (response && response?.data) {
          resolve(response?.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

export const patchWithAuth = (url, data, params = {}, headers) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    if (headers) params["headers"] = headers;
    else
      params["headers"] = {
        Authorization: `Bearer ${auth}`,
      };
    axios
      .patch(url, data, params)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

export const postWithAuth = (url, data, params = {}, headers) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    if (headers) params["headers"] = headers;
    else
      params["headers"] = {
        Authorization: `Bearer ${auth}`,
        "content-type": "multipart/form-data",
      };
    axios
      .post(url, data, params)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

export const postWithAuthorization = (url, data, params = {}, headers) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    if (headers) params["headers"] = headers;
    else
      params["headers"] = {
        Authorization: `Bearer ${auth}`,
      };
    axios
      .post(url, data, params)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

export const postEaimVerifySevice = (url, data, params = {}, headers) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    if (headers) params["headers"] = headers;
    else
      params["headers"] = {
        Authorization: `Bearer ${auth}`,
        "content-type": "application/json",
      };
    axios
      .post(url, data, params)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

export const deleteWithAuthorization = (url, entity, headers) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    let params = {};
    if (headers) params["headers"] = headers;
    else
      params["headers"] = {
        Authorization: `Bearer ${auth}`,
      };
    params["data"] = entity;
    axios
      .delete(url, params)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};
