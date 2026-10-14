import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  // Get all pokemon (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.pokemonService.getAll();
  }

  // Get single pokemon by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.pokemonService.findByPokemon(+id);
  }

  // Create pokemon (open - for demo)
 @Post()
create(@Body() body: any) {
  return this.pokemonService.createPokemon(
    body.pokemon_id,
    body.pokemon_name,
    body.type_id,
    body.trainer_id,
  );
}

  // Update pokemon (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.pokemonService.updatePokemon(+id, body);
  }

  // Delete pokemon (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.pokemonService.deletePokemon(+id);
  }
}