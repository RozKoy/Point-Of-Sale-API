import * as bcrypt from 'bcryptjs';

export function encodePassword (
	rawPassword: string
): { password: string, salt: string } 
{
	const salt: string = bcrypt.genSaltSync();
	const password: string = bcrypt.hashSync(rawPassword, salt);
	return { password, salt };
}

export async function comparePassword (
	rawPassword: string, 
	password: string, 
	salt: string
): Promise<boolean> 
{
	const hash: string = await bcrypt.hash(rawPassword, salt);
	return hash === password;
}