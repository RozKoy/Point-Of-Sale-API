import * as otpGenerator from 'otp-generator';

export function cashierCode (): string {
	return otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
}

export function getOTP (): string {
	return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
}