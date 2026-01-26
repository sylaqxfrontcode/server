import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('user_permission')
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  permission_id: number;

  @Column({
    type: 'tinyint',
    width: 1,
    default: () => '1',
  })
  is_allowed: boolean;
}
