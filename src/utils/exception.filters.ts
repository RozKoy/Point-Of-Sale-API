import { 
	Catch,
	HttpStatus,
	ArgumentsHost,
	HttpException,
	ExceptionFilter
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch (
		exception: HttpException, 
		host: ArgumentsHost
	) 
	{
		const context = host.switchToHttp();
		const request = context.getRequest<Request>();
		const response = context.getResponse<Response>();

		let data: string | any = exception.getResponse();
		const statusCode: HttpStatus | number = exception.getStatus();

		if (typeof(data) === 'string' && HttpStatus.BAD_REQUEST) {
			data = { message: data };
		}

		if (typeof(data) === 'object') {
			if (statusCode === HttpStatus.UNAUTHORIZED) {
				data = 'Anda tidak memiliki akses';
			} else if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
				data = 'Oops... Terjadi kesalahan internal pada server';
			} else if (statusCode === HttpStatus.FORBIDDEN) {
				data = 'Mohon maaf token sudah tidak dapat digunakan';
			} else if (statusCode === HttpStatus.BAD_REQUEST) {
				if (data.message) {
					data = data.message;
					data = [{ message: data }];
				}
			}
			if (data.message) {
				data = data.message;
			}
		}

		response.status(statusCode).json({
			statusCode,
			message: data
		});
	}
}