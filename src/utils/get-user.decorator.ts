import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
	(data: any, ctx: ExecutionContext): any => {
		const request = ctx.switchToHttp().getRequest();
		return request.user;
	},
);