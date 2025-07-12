import { isPasswordMismatch } from 'caminho/para/passwordValidation';

function PasswordFeedback({ password, confirmPassword }) {
  const mismatch = isPasswordMismatch(password, password, confirmPassword);

  if (mismatch) return <div>Senhas não conferem</div>;
  
  else return <div>Senhas conferem!</div>;

}