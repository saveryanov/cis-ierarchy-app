import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentResolver } from './department.resolver';
import { DepartmentService } from './department.service';
import { UserModule } from '../user/user.module';
import { Department } from './department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department]), forwardRef(() => UserModule)],
  controllers: [],
  providers: [DepartmentResolver, DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}
