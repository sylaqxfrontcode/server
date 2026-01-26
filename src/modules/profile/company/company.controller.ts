import { Controller, Post, Body } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('register-company')
  async registerCompany(@Body() dto: CreateCompanyDto) {
    return await this.companyService.registerCompany(dto);
  }
}
