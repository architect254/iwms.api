import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config, Page } from './entities';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Config, Page])],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService, TypeOrmModule],
})
export class ConfigModule {}
