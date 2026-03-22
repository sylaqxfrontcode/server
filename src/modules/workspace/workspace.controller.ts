import { Public } from './../../common/decorators/public.decorator';
import { User } from './../../entity/user.entity';
import { WorkSpaceService } from './workspace.service';
import { Controller, Post, Body, Get, Req, Query, Put } from '@nestjs/common';
import { CreateWorkSpaceDto } from './dto/CreateWorkSpace.dto';
import { UpdateWorkSpaceDto } from './dto/UpdateWorkSpace.dto';
@Controller('workspace')
export class WorkSpaceController {
  constructor(private readonly workspaceService: WorkSpaceService) {}

  @Post('create')
  createWorkspace(@Body() payload: CreateWorkSpaceDto) {
    return this.workspaceService.createNewWorkspace(payload);
  }
  @Public()
  @Get('test')
  test() {
    return { message: 'Test endpoint is working!' };
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
  @Put('updatestatus')
  updateWorkspaceStatus(@Body() body: UpdateWorkSpaceDto) {
    return this.workspaceService.updateWorkspaceStatus(
      body.workspace_id,
      body.status,
    );
  }
}
