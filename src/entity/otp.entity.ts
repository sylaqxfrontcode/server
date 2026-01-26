import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('otp')
export class otpEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'bigint', nullable: false })
  user_id: number;
  @Column({ type: 'varchar', length: 10, nullable: false })
  otp_code: string;
  @Column({ type: 'bigint', nullable: false })
  otp_expires: number;
  @Column({ type: 'bigint', nullable: false })
  created_at: number;
}
