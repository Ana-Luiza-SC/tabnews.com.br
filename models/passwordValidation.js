export function isPasswordMismatch(password, newpassword, confirmpassword) {
  
  if (newpassword == null || confirmpassword== null) return false;

  if (newpassword != confirmpassword) return false;

  if (password == newpassword) return false;

  if (newpassword.length <8) return false;

  return true;
}
