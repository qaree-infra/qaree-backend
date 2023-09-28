export const validateEmail = (email: string): boolean => {
  const re: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  return re.test(email);
}

export const validatePhone = (phone: string): boolean => {
  const re: RegExp = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  return re.test(phone);
}

export const generateOTPCode = () => {
  const min = 100000; // Minimum value for a 6-digit number (inclusive)
  const max = 999999; // Maximum value for a 6-digit number (inclusive)

  // Generate a random number between min and max
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}
