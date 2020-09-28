import { Injectable, HttpService, HttpException } from '@nestjs/common';
/**
 * This service is responsible for sending the get requests to the respective services
 */
@Injectable()
export class AppService {
  constructor(private http: HttpService) {}

  /**
   * Sends a get request to the respective services which depends on the serviceURL parameter.
   *
   * @param serviceUrl the service URL to send the get request to
   * @param endpoint the endpoint for the get request
   * @return the result of the get request or the error 
   */
  async sendRequest(serviceUrl: string, endpoint: string) {
    try {
      console.log(`${serviceUrl}` + `${endpoint}`);
      const res = await this.http
        .get(`${serviceUrl}` + `${endpoint}`)
        .toPromise();
      console.log(res.data);
      return { result: res.data };
    } catch(error) {
      console.log(error.response.data);
      throw new HttpException(error.response.data, 503);
    }
  }
}
