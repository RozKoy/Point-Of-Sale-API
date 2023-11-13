import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('ADMIN') {}

@Injectable()
export class CashierGuard extends AuthGuard('CASHIER') {}