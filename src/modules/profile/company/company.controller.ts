import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/company.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('register-company')
  async registerCompany(@Body() dto: CreateCompanyDto) {
    return await this.companyService.registerCompany(dto);
  }
}
