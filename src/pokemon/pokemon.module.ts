import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PokemonService } from './pokemon.service';
import { DatabaseModule } from '../database/database.module';
import { PokemonController } from './pokemon.controller';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [PokemonService],
})
export class PokemonModule {}