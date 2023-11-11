import { 
	Catch,
	HttpStatus,
	ArgumentsHost,
	HttpException,
	ExceptionFilter
} from '@nestjs/common';
import {
	Request,
	Response
} from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch (exception: HttpException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const request = context.getRequest<Request>();
		const response = context.getResponse<Response>();

		let data: string | any = exception.getResponse();
		const statusCode: HttpStatus | number = exception.getStatus();

		if (statusCode === HttpStatus.ACCEPTED || statusCode === HttpStatus.CREATED || statusCode === HttpStatus.NON_AUTHORITATIVE_INFORMATION || statusCode === HttpStatus.NO_CONTENT || statusCode === HttpStatus.OK || statusCode === HttpStatus.PARTIAL_CONTENT || statusCode === HttpStatus.RESET_CONTENT) {
			response.send({
				statusCode,
				data,
			});
		} else if (statusCode === HttpStatus.UNAUTHORIZED) {
			if (typeof(data) === 'object') {
				data = 'Anda tidak memiliki akses';
			}
		}
		
		response.send({
			statusCode,
			message: data
		});
	}
}