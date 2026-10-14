import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  // Get all types (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.battlesService.getAll();
  }

  // Get single type by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.battlesService.findByBattles(+id);
  }

  // Create type (open - for demo)
 @Post()
create(@Body() body: any) {
  console.log('BODY:', body);
  return this.battlesService.createBattle(
    body.battle_id,
    body.battle_date,
    body.result,
    body.trainer_id,
    body.gym_id,
  );
}

  // Update type (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.battlesService.updateBattle(+id, body);
  }

  // Delete type (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.battlesService.deleteBattle(+id);
  }
}