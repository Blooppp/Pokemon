import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TypesService } from './types.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  // Get all types (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.typesService.getAll();
  }

  // Get single type by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.typesService.findById(+id);
  }

  // Create type (open - for demo)
 @Post()
async create(@Body() body: { type_id: string; type_name: string }) {
  return this.typesService.createType(
    +body.type_id,
    body.type_name,
  );
}

  // Update type (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.typesService.updateType(+id, body);
  }

  // Delete type (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.typesService.deleteType(+id);
  }
}