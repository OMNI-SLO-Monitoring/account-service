import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private http: HttpService) {}

  async sendRequest(serviceUrl: string, endpoint: string) {
    return await this.http.get(`${serviceUrl}` + `${endpoint}`);
  }
}
