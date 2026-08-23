import { WorkspaceModule } from './modules/workspace/workspace.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentModule } from './modules/documents/document.module';
import { CompanyModule } from './modules/profile/company/company.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    WorkspaceModule,
    DocumentModule,
    CompanyModule,
    OnboardingModule,
  ],
})
export class AppModule {}
