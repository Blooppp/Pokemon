import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GymsService } from './gyms.service';
import { DatabaseModule } from '../database/database.module';
import { GymsController } from './gyms.comtroller';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [GymsController],
  providers: [GymsService],
  exports: [GymsService],
})
export class GymsModule {}