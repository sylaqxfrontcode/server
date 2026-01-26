import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invite_user')
export class inviteNewUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  invite_id: number;

  @Column({ type: 'int', nullable: false })
  new_user_id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  new_user_email: string;

  @Column({ type: 'int', nullable: false })
  company_id: number;

  @Column({ type: 'varchar', length: 15, nullable: false })
  status: string;
}
