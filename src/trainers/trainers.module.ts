import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TrainersService } from './trainers.service';
import { TrainersController } from './trainers.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TrainersController],
  providers: [TrainersService],
  exports: [TrainersService],
})
export class TrainersModule {}