import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  // Get all types (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.gymsService.getAll();
  }

  // Get single type by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.gymsService.findByGym(+id);
  }

  // Create type (open - for demo)
 @Post()
async create(@Body() body: {
  gym_id: string;
  gym_name: string;
  city: string;
  gym_type: string;
  leader_name: string;
}) {
  return this.gymsService.createGym(
    body.gym_id,
    body.gym_name,
    body.city,
    body.gym_type,
    body.leader_name
  );
}

  // Update type (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.gymsService.updateGyms(+id, body);
  }

  // Delete type (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.gymsService.deleteGyms(+id);
  }
}