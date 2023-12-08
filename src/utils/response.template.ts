export interface LoginResponseI {
	nickname?: string;
	access_token: string;
	refresh_token: string;
}

export interface RESPONSE_I {
	data: any;
	message: string;
	statusCode: number;
};

export const RESPONSE = (
	data: any, 
	message: string, 
	statusCode: number
): RESPONSE_I => {
	return {
		data,
		message,
		statusCode
	} as RESPONSE_I;
}