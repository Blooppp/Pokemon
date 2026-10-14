import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [BattlesController],
  providers: [BattlesService],
  exports: [BattlesService],
})
export class BattlesModule {}