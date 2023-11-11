import * as otpGenerator from 'otp-generator';

export function cashierCode (): string {
	return otpGenerator.generate(
		6, 
		{ 
			specialChars: false,
			lowerCaseAlphabets: false, 
			upperCaseAlphabets: false 
		}
	);
}

export function getOTP (): string {
	return otpGenerator.generate(
		6, 
		{ 
			specialChars: false, 
			upperCaseAlphabets: false, 
		}
	);
}