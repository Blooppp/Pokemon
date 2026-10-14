import { Module } from '@nestjs/common';
import {UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TypesModule } from './types/types.module';
import { CategoriesModule } from './category/catergory.module';
import { BattlesModule } from './battles/battles.module';
import { TrainersModule } from './trainers/trainers.module';
import { GymsModule } from './gyms/gyms.module';
import { PokemonModule } from './pokemon/pokemon.module';



@Module({
  imports: [
    DatabaseModule, 
    UsersModule, 
    AuthModule,
    CategoriesModule,
    TypesModule,
    BattlesModule,
    TrainersModule,
    GymsModule,
    PokemonModule,
  ],
})

export class AppModule {}