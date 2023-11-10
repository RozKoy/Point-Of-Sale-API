import { 
	Get,
	Put,
	Post,
	Body,
	Param,
	Patch,
	Delete,
	Inject,
	Controller,
	HttpStatus,
	HttpException,
	UseInterceptors,
	ClassSerializerInterceptor
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SerializedAdmin } from './type';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { AdminEntity, AdminRole } from './entity/admin.entity';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
	constructor (
		@Inject('ADMIN_SERVICE') private readonly adminService: AdminService
	) {}

	// CREATE
	@UseInterceptors(ClassSerializerInterceptor)
	@Post('/create/super')
	async createSuperAdmin (@Body() createAdminDto: CreateAdminDto): Promise<SerializedAdmin> {
		const role: AdminRole = AdminRole.SUPERADMIN;
		const superAdminExists: AdminEntity[] = await this.adminService.getAdminByRole(role);

		if (superAdminExists.length === 0) {
			const { email } = createAdminDto;
			const adminExists: AdminEntity | null = await this.adminService.getAdminByEmail(email);

			if (!adminExists) {
				const admin: AdminEntity = await this.adminService.createAdmin(createAdminDto, role);
				return new SerializedAdmin(admin);
			}
		} 

		throw new HttpException('Tidak dapat membuat akun super admin', HttpStatus.CONFLICT);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Post('/create')
	async createAdmin (@Body() createAdminDto: CreateAdminDto): Promise<SerializedAdmin> {
		const { email } = createAdminDto;
		const adminExists: AdminEntity | null = await this.adminService.getAdminByEmail(email);

		if (!adminExists) {
			const role: AdminRole = AdminRole.ADMIN;
			const admin: AdminEntity = await this.adminService.createAdmin(createAdminDto, role);
			return new SerializedAdmin(admin);
		}

		throw new HttpException('Tidak dapat membuat akun admin', HttpStatus.CONFLICT);
	}

	// READ
	@UseInterceptors(ClassSerializerInterceptor)
	@Get()
	async getAllAdmin (): Promise<SerializedAdmin[]> {
		const role: AdminRole = AdminRole.ADMIN;
		const admins: AdminEntity[] = await this.adminService.getAdminByRole(role);
		return admins.map((admin) => new SerializedAdmin(admin));
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get('/:id')
	async getAdminById (@Param('id') id: string): Promise<SerializedAdmin> {
		const role: AdminRole = AdminRole.ADMIN;
		const admins: AdminEntity[] = await this.adminService.getAdminByRole(role);
		
		if (admins.length !== 0) {
			const admin: AdminEntity | null = admins.find((admin) => admin.id === id);
			if (admin) {
				return new SerializedAdmin(admin);
			}
		}

		throw new HttpException('Admin tidak dapat ditemukan', HttpStatus.NOT_FOUND);
	}

	// UPDATE
	@UseInterceptors(ClassSerializerInterceptor)
	@Put('/update/:id')
	async updateAdmin (@Body() updateAdminDto: UpdateAdminDto, @Param('id') id: string): Promise<SerializedAdmin> {
		const { email, username, password, image } = updateAdminDto;
		
		if (email || username || password || image) {
			const admin: AdminEntity | null = await this.adminService.getAdminById(id);
			if (admin) {
				const updatedAdmin: AdminEntity | null = await this.adminService.updateAdmin(id, updateAdminDto);
				if (updatedAdmin) {
					return new SerializedAdmin(updatedAdmin);
				}
			}

			throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
		}

		throw new HttpException('Tidak ada data perubahan', HttpStatus.BAD_REQUEST);
	}

	// DELETE
	@Delete('/delete/:id')
	async deleteAdmin (@Param('id') id: string): Promise<any> {
		const admin: AdminEntity = await this.adminService.getAdminById(id);

		if (admin) {
			return await this.adminService.deleteAdminById(id);
		}

		throw new HttpException('Tidak dapat mengahapus akun admin', HttpStatus.NOT_FOUND);
	}

	// RESTORE
	@Patch('/restore/:id')
	async restoreAdmin (@Param('id') id: string): Promise<any> {
		const admin: AdminEntity = await this.adminService.getTrashedAdminById(id);
		if (admin) {
			if (admin.delete_at !== null) {
				return await this.adminService.restoreAdminById(id);
			}

			throw new HttpException('Tidak dapat mengembalikan akun', HttpStatus.NOT_ACCEPTABLE);
		}

		throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
	}
}
