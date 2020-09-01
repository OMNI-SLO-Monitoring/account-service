import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceRegistrationController } from './service-registration/service-registration.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController, ServiceRegistrationController],
  providers: [AppService],
})
export class AppModule {}
