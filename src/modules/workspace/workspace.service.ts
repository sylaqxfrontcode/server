import { WorkSpace } from './../../entity/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateWorkspaces } from './types/type';

@Injectable()
export class WorkSpaceService {
  constructor(
    @InjectRepository(WorkSpace)
    private readonly workSpaceRepo: Repository<WorkSpace>,
  ) {}
  async createNewWorkspace(data: CreateWorkspaces) {
    const newWorkspace = this.workSpaceRepo.create(data);
    const now = Math.floor(Date.now() / 1000); // current timestamp in seconds
    const res = await this.workSpaceRepo.save({
      ...newWorkspace,
      created_at: now,
      updated_at: now,
    });
    if (!res) {
      throw new Error('Failed to create workspace');
    }
    return {
      message: 'Workspace created successfully',
      data: res,
    };
  }
  async getAllWorkspaces(user_id: number) {
    const workSpaces = await this.workSpaceRepo.find({
      where: { user_id: user_id },
    });
    return workSpaces;
  }
  async getWorkSpaceByID(workspace_id: number, user_id: number) {
    const workspace = await this.workSpaceRepo.findOne({
      where: { workspace_id, user_id },
    });
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    return workspace;
  }
  async updateWorkspaceStatus(
    workspace_id: number,
    status: number,
    user_id: number,
  ) {
    const workspace = await this.workSpaceRepo.findOne({
      where: { workspace_id, user_id },
    });
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    workspace.status = status;
    workspace.updated_at = Math.floor(Date.now() / 1000); // update timestamp
    const res = await this.workSpaceRepo.save(workspace);
    if (!res) {
      throw new Error('Failed to update workspace status');
    }
    return {
      message: 'Workspace status updated successfully',
      data: res,
    };
  }
}
