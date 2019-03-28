function isEmail(text: string): boolean {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return reg.test(text);
}

function isPhoneNumber(phone: string): boolean {
  const reg = /^[0]?[789]\d{9}$/;
  return reg.test(phone);
}

export default {
  isEmail,
  isPhoneNumber
};
