import { User } from './../../entity/user.entity';
import { WorkSpaceService } from './workspace.service';
import { Controller, Post, Body, Get, Req, Query, Patch } from '@nestjs/common';
import { CreateWorkSpaceDto } from './dto/CreateWorkSpace.dto';

@Controller('workspace')
export class WorkSpaceController {
  constructor(private readonly workspaceService: WorkSpaceService) {}

  @Post('create')
  createWorkspace(@Body() payload: CreateWorkSpaceDto) {
    return this.workspaceService.createNewWorkspace(payload);
  }
  @Get('getAll')
  getAllWorkspaces(@Req() req: User) {
    return this.workspaceService.getAllWorkspaces(req.id);
  }

  @Get('id')
  getWorkSpaceByID(
    @Req() req: User,
    @Query('workspace_id') workspace_id: number,
  ) {
    return this.workspaceService.getWorkSpaceByID(workspace_id);
  }

  @Patch('updatestatus')
  updateWorkspaceStatus(
    @Query('workspace_id') workspace_id: number,
    @Query('status') status: number,
  ) {
    return this.workspaceService.updateWorkspaceStatus(workspace_id, status);
  }
}
