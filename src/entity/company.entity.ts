import { Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  company_email: string;

  @Column({ type: 'varchar', length: 26, nullable: false })
  company_contact_no: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  contact_country_code: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  company_type: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  registration_number: string;

  @Column({ type: 'tinyint' })
  status: number;
}
