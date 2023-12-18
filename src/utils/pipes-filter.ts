export interface ErrorI {
	message: string;
	property: string;
}

export function MapError (errors): ErrorI[] {
	let result: ErrorI[] = [];
		  
	function mapError (data): void {
		data.map((error): void => {
			if (error.constraints) {
				const length: number = Object.keys(error.constraints).length;
				const temp: ErrorI = {
					property: error.property,
					message: error.constraints[Object.keys(error.constraints)[length - 1]]
				}
				result.push(temp);
			} else if (error.children.length !== 0) {
				mapError(error.children);
			}
		});
	}

	mapError(errors);
	return result;
}