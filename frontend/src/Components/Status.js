let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
let userEmail = localStorage.getItem('userEmail') || '';

export const setLoggedIn = () => {
  isLoggedIn = !isLoggedIn;
  localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
};

export const setUserEmail = (email) => {
  userEmail = email;
  localStorage.setItem('userEmail', email);
};

export const clearUserStatus = () => {
  isLoggedIn = false;
  userEmail = '';
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
};

export const getLoggedInStatus = () => {
  return isLoggedIn;
};

export const getCurrentUserEmail = () => {
  return userEmail;
};