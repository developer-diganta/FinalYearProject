const crypto = require('crypto');

function generateOTP() {
  const digits = '0123456789';
  const OTPLength = 6;
  const buffer = crypto.randomBytes(OTPLength);
  let OTP = '';

  for (let i = 0; i < OTPLength; i++) {
    OTP += digits[buffer[i] % 10];
  }

  return OTP;
}

module.exports = generateOTP;