import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  // Get all types (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.trainersService.getAll();
  }

  // Get single type by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.trainersService.findByTrainerId(+id);
  }

  // Create type (open - for demo)
 @Post()
async create(@Body() body: {
    region: any;
  badge_count: number;
    type_id(type_id: any, type_name: any): unknown; trainer_id: string; trainer_name: string 
}) {
  return this.trainersService.createTrainer(
    body.trainer_id,
    body.trainer_name,
    body.region,
    body.badge_count
  );
}

  // Update type (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.trainersService.updateTrainer(+id, body);
  }

  // Delete type (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.trainersService.deleteTrainer(+id);
  }
}