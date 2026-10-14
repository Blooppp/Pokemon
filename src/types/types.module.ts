import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TypesController],
  providers: [TypesService],
  exports: [TypesService],
})
export class TypesModule {}