import { Column, Entity } from 'typeorm';

@Entity('otp')
export class otpEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  user_id: string;
  @Column({ type: 'varchar', length: 10, nullable: false })
  otp_code: string;
  @Column({ type: 'bigint', nullable: false })
  otp_expires: number;
  @Column({ type: 'bigint', nullable: false })
  created_by: number;
}
