import { Controller, Post, Body } from '@nestjs/common';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Post('register-company')
  registerCompany(@Body() dto: RegisterCompanyDto) {
    return this.companyService.registerCompany(dto);
  }
}
