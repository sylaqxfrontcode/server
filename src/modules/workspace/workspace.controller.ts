import { Public } from './../../common/decorators/public.decorator';
import { User } from './../../entity/user.entity';
import { WorkSpaceService } from './workspace.service';
import { Controller, Post, Body, Get, Req, Query, Put, UseGuards } from '@nestjs/common';
import { CreateWorkSpaceDto } from './dto/CreateWorkSpace.dto';
import { UpdateWorkSpaceDto } from './dto/UpdateWorkSpace.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('workspace')
@UseGuards(JwtAuthGuard)
export class WorkSpaceController {
  constructor(private readonly workspaceService: WorkSpaceService) {}

  @Post('create')
  createWorkspace(@Body() payload: CreateWorkSpaceDto, @Req() req: User) {
    return this.workspaceService.createNewWorkspace({
      ...payload,
      user_id: req.id,
    });
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
    return this.workspaceService.getWorkSpaceByID(workspace_id, req.id);
  }
  @Put('updatestatus')
  updateWorkspaceStatus(@Body() body: UpdateWorkSpaceDto, @Req() req: User) {
    return this.workspaceService.updateWorkspaceStatus(
      body.workspace_id,
      body.status,
      req.id,
    );
  }
}
