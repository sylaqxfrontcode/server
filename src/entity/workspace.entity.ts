import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('workspaces')
export class WorkSpace {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  workspace_id: number;

  @Index()
  @Column({ type: 'bigint', nullable: false })
  company_id: number;

  @Column({ type: 'bigint', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
