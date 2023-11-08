export const Configuration = () => ({
	database: {
		port: process.env.DB_PORT || 3306,
		type: process.env.DB_TYPE || 'mysql',
		host: process.env.DB_HOST || 'localhost',

		password: process.env.DB_PASSWORD || '',
		username: process.env.DB_USERNAME || 'root',
		database: process.env.DB_DATABASE || 'database',
		
		synchronize: process.env.DB_SYNC || false,
		entities: [__dirname + '/../**/*.entity.{ts,js}'],
	},
	jwt_at: {
		global: process.env.JWT_GLOBAL || false,
		secret: process.env.JWT_SECRET || 'jwtsecret',
		signOptions: {
			expiresIn: process.env.JWT_AT_EXPIRES_IN || '30s',
		},
	},
	jwt_rt: {
		global: process.env.JWT_GLOBAL || false,
		secret: process.env.JWT_SECRET || 'jwtsecret',
		signOptions: {
			expiresIn: process.env.JWT_RT_EXPIRES_IN || '30s',
		},
	}
})