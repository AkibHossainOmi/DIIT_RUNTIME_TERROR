// let status = false;

// export const setLoggedIn = () => {
//   status = !status;
// };

// export const isLoggedIn = () => {
//   return status;
// };
let status = JSON.parse(localStorage.getItem('isLoggedIn')) || false;

export const setLoggedIn = () => {
  status = !status;
  localStorage.setItem('isLoggedIn', JSON.stringify(status));
};

export const isLoggedIn = () => {
  return status;
};