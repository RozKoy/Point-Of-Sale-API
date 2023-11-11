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
	catch (exception: HttpException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const request = context.getRequest<Request>();
		const response = context.getResponse<Response>();

		let data: string | any = exception.getResponse();
		const statusCode: HttpStatus | number = exception.getStatus();

		if (statusCode === HttpStatus.UNAUTHORIZED && typeof(data) === 'object') {
			data = 'Anda tidak memiliki akses';
		}
		
		response.status(statusCode).json({
			statusCode,
			message: data
		});
	}
}