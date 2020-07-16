const isValidEmail = (email) => {
  // eslint-disable-next-line no-useless-escape
  const regExEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  if (regExEmail.test(email)) {
    return true;
  }
  return false;
};

module.exports = isValidEmail;
