import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  requestService: string;
  endpoint: string;
  constructor(private readonly appService: AppService) {}

  @Post()
  async receiveRequestInfo(@Body() requestInfo) {
    this.requestService = requestInfo.requestService;
    this.endpoint = requestInfo.endpoint;
    return await this.appService.sendRequest(
      this.requestService,
      this.endpoint,
    );
  }
}
