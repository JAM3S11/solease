export const calculatePasswordStrength = (password) => {
  if (!password) return null;
  
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  if (strength <= 1) return 'weak';
  if (strength <= 3) return 'medium';
  return 'strong';
};

export const isPasswordStrong = (password) => {
  return calculatePasswordStrength(password) === 'strong';
};
