import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../../entity/company.entity';
import { CreateCompanyType } from './types/company.type';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async registerCompany(dto: CreateCompanyType) {
    try {
      const company = this.companyRepo.create({
        name: dto.name,
        company_email: dto.companyEmail,
        company_contact_no: dto.companyContactNo,
        contact_country_code: dto.contactCountryCode,
        company_type: dto.companyType,
        registration_number: dto.registrationNumber,
        status: dto.status,
      });

      const res = await this.companyRepo.save(company);
      return res;
    } catch (err) {
      console.error('Error registering company:', err);
      throw new InternalServerErrorException('Company registration failed');
    }
  }
}
