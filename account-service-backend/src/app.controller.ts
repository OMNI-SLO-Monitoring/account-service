import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * This controller receives and processes the data from the frontend
 */
@Controller()
export class AppController {
  requestService: string;
  endpoint: string;
  constructor(private readonly appService: AppService) {}

  /**
   * Sends a request to the respective services which were selected in the frontend
   *
   * @param requestInfo the data from the frontend containing the selected service and the endpoint
   * @return the sent request
   */
  @Post()
  receiveRequestInfo(@Body() requestInfo) {
    this.requestService = requestInfo.requestService;
    this.endpoint = requestInfo.endpoint;
    console.log('received');
    return this.appService.sendRequest(this.requestService, this.endpoint);
  }
}
