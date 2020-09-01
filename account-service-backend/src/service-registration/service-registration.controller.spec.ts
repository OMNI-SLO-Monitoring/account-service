import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRegistrationController } from './service-registration.controller';

describe('ServiceRegistrationController', () => {
  let controller: ServiceRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceRegistrationController],
    }).compile();

    controller = module.get<ServiceRegistrationController>(ServiceRegistrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
