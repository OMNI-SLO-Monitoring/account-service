import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private http: HttpService) {}

  async sendRequest(serviceUrl: string, endpoint: string) {
    console.log(`${serviceUrl}` + `${endpoint}`);
    const res = await this.http
      .get(`${serviceUrl}` + `${endpoint}`)
      .toPromise();
    console.log(res.data);
    return { result: res.data };
  }
}
