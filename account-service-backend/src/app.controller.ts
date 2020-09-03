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
   * Passes the request information to the app service component that conducts the request based on the information
   * it receives. Simultaneously, the result that is fetched by the request of the app service is also returned.
   *
   * @param requestInfo the data from the frontend containing the selected service and the endpoint
   * @return the data of the request conducted by the app service
   */
  @Post()
  receiveRequestInfo(@Body() requestInfo) {
    this.requestService = requestInfo.requestService;
    this.endpoint = requestInfo.endpoint;
    console.log('received');
    return this.appService.sendRequest(this.requestService, this.endpoint);
  }
}
