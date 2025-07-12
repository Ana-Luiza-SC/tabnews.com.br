import React from "react";
import "./styles.css"; 

export default function PasswordMatchBar({ password, confirmPassword }) {

  if (!password && !confirmPassword) return null;

  if (password === confirmPassword && password.length > 0) {
    return <div className="password-match success">✔️ Senhas conferem!</div>;
  }

  if (confirmPassword && password !== confirmPassword) {
    return <div className="password-match error">❌ Senhas não conferem</div>;
  }
  
  return null;
}
