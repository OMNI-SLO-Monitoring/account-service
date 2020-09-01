import { Controller, Post, Body } from '@nestjs/common';

@Controller('service-registration')
export class ServiceRegistrationController {
  @Post()
  async receiveServiceId(@Body() serviceInfo) {}
}
