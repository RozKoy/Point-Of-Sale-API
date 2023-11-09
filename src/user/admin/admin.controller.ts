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
import { ApiTags, ApiParam } from '@nestjs/swagger';

import { SerializedAdmin } from './type';
import { AdminService } from './admin.service';
import { AdminRole } from './entity/admin.entity';
import { CreateAdminDto, UpdateAdminDto } from './dto';

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
		const superAdminExists: SerializedAdmin[] = await this.adminService.getAdminByRole(role);

		if (superAdminExists.length === 0) {
			const { email } = createAdminDto;
			const adminExists: SerializedAdmin | null = await this.adminService.getAdminByEmail(email);

			if (!adminExists) {
				return await this.adminService.createAdmin(createAdminDto, role);
			}
		} 

		throw new HttpException('Tidak dapat membuat akun super admin', HttpStatus.CONFLICT);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Post('/create')
	async createAdmin (@Body() createAdminDto: CreateAdminDto): Promise<SerializedAdmin> {
		const { email } = createAdminDto;
		const adminExists: SerializedAdmin | null = await this.adminService.getAdminByEmail(email);

		if (!adminExists) {
			const role: AdminRole = AdminRole.ADMIN;
			return await this.adminService.createAdmin(createAdminDto, role);
		}

		throw new HttpException('Tidak dapat membuat akun admin', HttpStatus.CONFLICT);
	}

	// READ
	@UseInterceptors(ClassSerializerInterceptor)
	@Get()
	async getAllAdmin (): Promise<SerializedAdmin[]> {
		const role: AdminRole = AdminRole.ADMIN;
		return await this.adminService.getAdminByRole(role);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get('/:id')
	async getAdminById (@Param('id') id: string): Promise<SerializedAdmin> {
		const role: AdminRole = AdminRole.ADMIN;
		const admins: SerializedAdmin[] = await this.adminService.getAdminByRole(role);
		
		if (admins.length !== 0) {
			const admin: SerializedAdmin | null = admins.find((admin) => admin.id === id);
			if (admin) {
				return admin;
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
			const admin: SerializedAdmin | null = await this.adminService.getAdminById(id);
			if (admin) {
				const updatedAdmin: SerializedAdmin | null = await this.adminService.updateAdmin(id, updateAdminDto);
				if (updatedAdmin) {
					return updatedAdmin;
				}
			}

			throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
		}

		throw new HttpException('Tidak ada data perubahan', HttpStatus.BAD_REQUEST);
	}

	// DELETE
	@Delete('/delete/:id')
	async deleteAdmin (@Param('id') id: string): Promise<any> {
		const admin: SerializedAdmin = await this.adminService.getAdminById(id);

		if (admin) {
			return await this.adminService.deleteAdminById(id);
		}

		throw new HttpException('Tidak dapat mengahapus akun admin', HttpStatus.NOT_FOUND);
	}

	// RESTORE
	@Patch('/restore/:id')
	async restoreAdmin (@Param('id') id: string): Promise<any> {
		const admin: SerializedAdmin = await this.adminService.getTrashedAdminById(id);
		if (admin) {
			if (admin.delete_at !== null) {
				return await this.adminService.restoreAdminById(id);
			}

			throw new HttpException('Tidak dapat mengembalikan akun', HttpStatus.NOT_ACCEPTABLE);
		}

		throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
	}
}
