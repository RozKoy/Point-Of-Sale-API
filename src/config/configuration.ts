import { ExtractJwt } from 'passport-jwt';

export const Configuration = () => ({
	database: {
		port: process.env.DB_PORT,
		type: process.env.DB_TYPE,
		host: process.env.DB_HOST,

		password: process.env.DB_PASSWORD,
		username: process.env.DB_USERNAME,
		database: process.env.DB_DATABASE,
		
		synchronize: process.env.DB_SYNC,
		entities: [__dirname + '/../**/*.entity.{ts,js}'],
	},
	jwt: {
		global: process.env.JWT_GLOBAL,
		secret: process.env.JWT_SECRET,
		signOptions: {
			expiresIn: process.env.JWT_EXPIRES_IN,
		},
	},
	jwtStrategy: {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		ignoreExpiration: process.env.JWT_STRATEGY_IGNORE_EXPIRATION,
		secretOrKey: process.env.JWT_SECRET,
	}
})