import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from '../../entity/company.entity';
import { User } from '../../entity/user.entity';
import { WorkSpaceService } from './workspace.service';
import { WorkSpaceController } from './workspace.controller';
import { AuthModule } from '../auth/auth.module'; // ✅ IMPORT THIS
import { WorkSpace } from '../../entity/workspace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkSpace, Company, User]),
    AuthModule, // 🔥 REQUIRED for AuthService injection
  ],
  providers: [WorkSpaceService],
  controllers: [WorkSpaceController],
  exports: [WorkSpaceService],
})
export class WorkspaceModule {}
