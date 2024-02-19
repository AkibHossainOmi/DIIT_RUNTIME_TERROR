let status = true;

export const setLoggedIn = () => {
  status = !status;
};

export const isLoggedIn = () => {
  return status;
};
