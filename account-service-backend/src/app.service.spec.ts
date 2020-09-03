import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HttpModule, HttpService } from '@nestjs/common/http';
import { of } from 'rxjs';

describe('AppService', () => {
  let appService: AppService;
  let httpService: HttpService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
    httpService = app.get<HttpService>(HttpService);
  });

  it('should be defined', async () => {
    expect(appService).toBeDefined();
  });

  it('should return the correct data', async () => {
    const expectedResult = {
      data: 31,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    let mockUrl = 'http://localhost:3000/request-handler/';
    let endpoint = 'balance';
    jest.spyOn(httpService, 'get').mockImplementation(() => of(expectedResult));
    expect(await appService.sendRequest(mockUrl, endpoint)).toEqual({
      result: expectedResult.data,
    });
  });
});
