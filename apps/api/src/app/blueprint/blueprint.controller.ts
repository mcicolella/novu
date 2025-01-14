import { ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';

import { IJwtPayload } from '@novu/shared';
import { NotificationTemplateEntity } from '@novu/dal';

import { UserSession } from '../shared/framework/user.decorator';
import { GroupedBlueprintResponse } from './dto/grouped-blueprint.response.dto';
import { GetBlueprint, GetBlueprintCommand } from './usecases/get-blueprint';
import { CreateBlueprintCommand, CreateBlueprint } from './usecases/create-blueprint';
import { GetGroupedBlueprints } from './usecases/get-blueprints';
import { GetBlueprintResponse } from './dto/get-blueprint.response.dto';

@Controller('/blueprints')
@UseInterceptors(ClassSerializerInterceptor)
export class BlueprintController {
  constructor(
    private getBlueprintUsecase: GetBlueprint,
    private getGroupedBlueprintsUsecase: GetGroupedBlueprints,
    private createBlueprintUsecase: CreateBlueprint
  ) {}

  @Get('/group-by-category')
  getGroupedBlueprints(): Promise<GroupedBlueprintResponse[]> {
    return this.getGroupedBlueprintsUsecase.execute();
  }

  @Get('/:templateId')
  getBlueprintById(@Param('templateId') templateId: string): Promise<GetBlueprintResponse> {
    return this.getBlueprintUsecase.execute(
      GetBlueprintCommand.create({
        templateId,
      })
    );
  }

  @Post('/:templateId')
  createNotificationTemplateFromBlueprintById(
    @UserSession() user: IJwtPayload,
    @Param('templateId') templateId: string
  ): Promise<NotificationTemplateEntity> {
    return this.createBlueprintUsecase.execute(
      CreateBlueprintCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        userId: user._id,
        templateId,
      })
    );
  }
}
