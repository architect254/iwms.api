import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get(':host')
  async getOne(@Param('host') host) {
    return await this.configService.read(host);
  }
}
