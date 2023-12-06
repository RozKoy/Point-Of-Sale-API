import { 
	Get,
	Put,
	Post,
	Body,
	Query,
	Param,
	Patch,
	Delete,
	Inject,
	UseGuards,
	Controller,
	HttpStatus,
	HttpException,
	UseInterceptors,
	ClassSerializerInterceptor
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { 
	GetUser,
	RESPONSE, 
	RESPONSE_I, 
	AdminGuard 
} from 'src/utils';
import { 
	IDDto,
	FilterDto, 
	CreateAdminDto, 
	UpdateAdminDto 
} from './dto';
import { SerializedAdmin } from './type';
import { AdminService } from './admin.service';
import { AdminEntity, AdminRole } from './entity/admin.entity';

@ApiBearerAuth()
@ApiTags('Admin')

@Controller('admin')
export class AdminController {
	constructor (
		@Inject('ADMIN_SERVICE') private readonly adminService: AdminService
	) {}

	isSuperAdmin (role: AdminRole) {
		if (role === AdminRole.SUPERADMIN) {
			return true;
		}

		throw new HttpException({}, HttpStatus.UNAUTHORIZED);
	}

	// CREATE - Add Admin
	@UseGuards(AdminGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	@Post('/add')
	async createAdmin (
		@Body() createAdminDto: CreateAdminDto, @GetUser() user: AdminEntity
	): Promise<RESPONSE_I> 
	{
		if (this.isSuperAdmin(user.role)) {
			const { email } = createAdminDto;
			const adminExists: AdminEntity | null = await this.adminService.getTrashedAdminByEmail(email);

			if (!adminExists) {
				const role: AdminRole = AdminRole.ADMIN;
				const admin: AdminEntity = await this.adminService.createAdmin(createAdminDto, role);

				return RESPONSE(new SerializedAdmin(admin), 'Berhasil membuat akun admin', HttpStatus.CREATED);
			}

			throw new HttpException('Tidak dapat membuat akun admin', HttpStatus.CONFLICT);
		}
	}

	// READ - Get Profile
	@UseGuards(AdminGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	@Get('/profile')
	getProfile (@GetUser() user: AdminEntity): RESPONSE_I {
		const adminProfile: SerializedAdmin = new SerializedAdmin(user);
		
		return RESPONSE(adminProfile, 'Berhasil mendapatkan data admin', HttpStatus.OK);
	}

	// READ - Get Admin with Search
	@UseGuards(AdminGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	@Get('/all')
	async getAllAdmin (
		@Query() filterDto: FilterDto, @GetUser() user: AdminEntity
	): Promise<RESPONSE_I> 
	{
		if (this.isSuperAdmin(user.role)) {
			const { search } = filterDto;
			const role: AdminRole = AdminRole.ADMIN;
			const allAdmin: Pagination<AdminEntity> = await this.adminService.getAdminByRole(role, filterDto);

			if (allAdmin.items.length !== 0) {
				const admins: any = allAdmin;
				admins.items = allAdmin.items.map((admin) => new SerializedAdmin(admin));

				return RESPONSE(admins, 'Berhasil mendapatkan daftar admin', HttpStatus.OK);
			}

			let msg: string = 'Daftar admin kosong';

			if (search) {
				msg = 'Admin tidak ditemukan';
			}

			return RESPONSE(allAdmin, msg, HttpStatus.NO_CONTENT);
		}
	}

	// UPDATE
	@UseGuards(AdminGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	@Put('/update')
	async updateAdmin (
		@Body() updateAdminDto: UpdateAdminDto, @GetUser() user: AdminEntity
	): Promise<RESPONSE_I> 
	{
		if (this.isSuperAdmin(user.role)) {
			const { id, email, username, password, image } = updateAdminDto;
			
			if (email || username || password || image) {
				const admin: AdminEntity | null = await this.adminService.getAdminById(id);
				if (admin) {
					const updatedAdmin: AdminEntity | null = await this.adminService.updateAdmin(updateAdminDto);

					if (updatedAdmin) {
						return RESPONSE(new SerializedAdmin(updatedAdmin), 'Berhasil mengubah akun admin', HttpStatus.OK);
					}
				}

				throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
			}

			throw new HttpException('Tidak ada data perubahan', HttpStatus.BAD_REQUEST);
		}
	}

	// DELETE
	@UseGuards(AdminGuard)
	@Delete('/delete')
	async deleteAdmin (@Body() idDto: IDDto, @GetUser() user: AdminEntity): Promise<RESPONSE_I> {
		if (this.isSuperAdmin(user.role)) {
			const { id } = idDto;
			const admin: AdminEntity | null = await this.adminService.getAdminById(id);

			if (admin) {
				const response: any = await this.adminService.deleteAdminById(id);
				return RESPONSE(response, 'Berhasil menghapus akun admin', HttpStatus.OK);
			}

			throw new HttpException('Tidak dapat mengahapus akun admin', HttpStatus.NOT_FOUND);
		}
	}

	// CREATE
	@UseInterceptors(ClassSerializerInterceptor)
	@Post('/create/super')
	async createSuperAdmin (@Body() createAdminDto: CreateAdminDto): Promise<RESPONSE_I> {
		const filter: FilterDto = {
			page: null,
			limit: null,
			search: null
		};
		const role: AdminRole = AdminRole.SUPERADMIN;
		const superAdminExists: Pagination<AdminEntity> = await this.adminService.getAdminByRole(role, filter);

		if (superAdminExists.items.length === 0) {
			const { email } = createAdminDto;
			const adminExists: AdminEntity | null = await this.adminService.getTrashedAdminByEmail(email);

			if (!adminExists) {
				const admin: AdminEntity = await this.adminService.createAdmin(createAdminDto, role);
				return RESPONSE(new SerializedAdmin(admin), 'Berhasil membuat akun super admin', HttpStatus.CREATED);
			}
		} 

		throw new HttpException('Tidak dapat membuat akun super admin', HttpStatus.CONFLICT);
	}
/*

	// READ
	@UseInterceptors(ClassSerializerInterceptor)
	@Get()
	async getAllAdmin (): Promise<RESPONSE_I> {
		const role: AdminRole = AdminRole.ADMIN;
		const admins: AdminEntity[] = await this.adminService.getAdminByRole(role);
		
		if (admins.length !== 0) {
			const serializedAdmin = admins.map((admin) => new SerializedAdmin(admin));

			return RESPONSE(serializedAdmin, '', HttpStatus.OK);
		}

		return RESPONSE(admins, 'Tidak ada daftar akun admin', HttpStatus.NO_CONTENT);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get('/:id')
	async getAdminById (@Param('id') id: string): Promise<RESPONSE_I> {
		const admin: AdminEntity | null = await this.adminService.getAdminById(id);

		if (admin) {
			if (admin.role === AdminRole.ADMIN) {
				return RESPONSE(admin, 'Akun admin berhasil ditemukan', HttpStatus.OK);
			}
		}

		throw new HttpException('Admin tidak dapat ditemukan', HttpStatus.NOT_FOUND);
	}

	// RESTORE
	@Patch('/restore/:id')
	async restoreAdmin (@Param('id') id: string): Promise<RESPONSE_I> {
		const admin: AdminEntity | null = await this.adminService.getTrashedAdminById(id);
		
		if (admin) {
			if (admin.delete_at !== null) {
				const response: any = await this.adminService.restoreAdminById(id);
				return RESPONSE(response, 'Berhasil mengembalikan akun admin', HttpStatus.OK);
			}

			throw new HttpException('Tidak dapat mengembalikan akun', HttpStatus.NOT_ACCEPTABLE);
		}

		throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
	}
*/
}
