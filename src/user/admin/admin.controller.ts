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
import { RESPONSE, RESPONSE_I } from 'src/utils';
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
	async createSuperAdmin (@Body() createAdminDto: CreateAdminDto): Promise<RESPONSE_I> {
		const role: AdminRole = AdminRole.SUPERADMIN;
		const superAdminExists: AdminEntity[] = await this.adminService.getAdminByRole(role);

		if (superAdminExists.length === 0) {
			const { email } = createAdminDto;
			const adminExists: AdminEntity | null = await this.adminService.getTrashedAdminByEmail(email);

			if (!adminExists) {
				const admin: AdminEntity = await this.adminService.createAdmin(createAdminDto, role);
				return RESPONSE(new SerializedAdmin(admin), 'Berhasil membuat akun super admin', HttpStatus.CREATED);
			}
		} 

		throw new HttpException('Tidak dapat membuat akun super admin', HttpStatus.CONFLICT);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Post('/create')
	async createAdmin (@Body() createAdminDto: CreateAdminDto): Promise<RESPONSE_I> {
		const { email } = createAdminDto;
		const adminExists: AdminEntity | null = await this.adminService.getTrashedAdminByEmail(email);

		if (!adminExists) {
			const role: AdminRole = AdminRole.ADMIN;
			const admin: AdminEntity = await this.adminService.createAdmin(createAdminDto, role);
			return RESPONSE(new SerializedAdmin(admin), 'Berhasil membuat akun admin', HttpStatus.CREATED);
		}

		throw new HttpException('Tidak dapat membuat akun admin', HttpStatus.CONFLICT);
	}

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

	// UPDATE
	@UseInterceptors(ClassSerializerInterceptor)
	@Put('/update/:id')
	async updateAdmin (
		@Body() updateAdminDto: UpdateAdminDto, @Param('id') id: string
	): Promise<RESPONSE_I> 
	{
		const { email, username, password, image } = updateAdminDto;
		
		if (email || username || password || image) {
			const admin: AdminEntity | null = await this.adminService.getAdminById(id);
			if (admin) {
				const updatedAdmin: AdminEntity | null = await this.adminService.updateAdmin(id, updateAdminDto);

				if (updatedAdmin) {
					return RESPONSE(new SerializedAdmin(updatedAdmin), 'Berhasil mengubah akun admin', HttpStatus.OK);
				}
			}

			throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
		}

		throw new HttpException('Tidak ada data perubahan', HttpStatus.BAD_REQUEST);
	}

	// DELETE
	@Delete('/delete/:id')
	async deleteAdmin (@Param('id') id: string): Promise<RESPONSE_I> {
		const admin: AdminEntity | null = await this.adminService.getAdminById(id);

		if (admin) {
			const response: any = await this.adminService.deleteAdminById(id);
			return RESPONSE(response, 'Berhasil menghapus akun admin', HttpStatus.OK);
		}

		throw new HttpException('Tidak dapat mengahapus akun admin', HttpStatus.NOT_FOUND);
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
}
