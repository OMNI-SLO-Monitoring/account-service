import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogType, reportError } from 'logging-format';
import { isNullOrUndefined } from 'util';
import { environment } from './../environments/environment';

interface LogOutput {
  message: string;
  type: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dbDestination = environment.BACKEND_DB_SERVICE_URL;
  priceDestination = environment.BACKEND_PRICE_SERVICE_URL;
  backendDestination = environment.BACKEND_ACCOUNT_SERVICE_URL;
  // selected destination of request in ui
  selectedDestination: string;

  getBalance = '/balance';
  getCustomerName = '/customer-name';
  getResponse = '/';
  getAccountWorth = '/account-worth';
  // selected request in ui
  requestName: string = '/';

  // received result from request
  consoleOutput: LogOutput[] = [];

  constructor(private http: HttpClient) {}

  /**
    Sends a request to either the database service or the price service corresponding to the selected selectedDestination, selected in the ui
  */
  async sendRequest() {
    if (this.selectedDestination == this.dbDestination) {
      this.getRequestDatabaseService(`${this.dbDestination}request-handler/`);
    } else {
      this.getRequestPricesService(`${this.priceDestination}request/`);
    }
  }

  /**
   * Creates a "log" that will be displayed in the ui
   *
   * @param message that should be displayed
   */
  printRequestType(message) {
    this.consoleOutput.push({
      message: message,
      type: 'info',
    });
  }

  /**
   * Sends a get request to the database service
   *
   * @param url of the get request
   */
  async getRequestDatabaseService(requestServiceUrl: string) {
    try {
      const result = await this.http
        .post(this.backendDestination, {
          requestService: requestServiceUrl,
          endpoint: this.requestName,
        })
        .toPromise();
      this.consoleOutput.push({
        message: `Successful, Result: ${result}`,
        type: 'success',
      });
      console.log(result);
    } catch (error) {
      console.log(error);
      this.consoleOutput.push({
        message: 'Request failed',
        type: 'error',
      });
      this.handleError('Database Service', error);
    }
  }

  /**
   * Sends a get request to the price service
   *
   * @param url of the get request
   */
  async getRequestPricesService(requestServiceUrl: string) {
    try {
      const result = await this.http
        .post(this.backendDestination, {
          requestService: requestServiceUrl,
          endpoint: this.requestName,
        })
        .toPromise();
      this.consoleOutput.push({
        message: `Successful, Result: ${result}`,
        type: 'success',
      });
      console.log(result);
    } catch (error) {
      console.log(error);
      this.consoleOutput.push({
        message: 'Request failed',
        type: 'error',
      });
      this.handleError('Price Service', error);
    }
  }

  // /**
  //   Sends "get balance" request to price service
  // */
  // async getBalanceFromPriceService() {
  //   await this.getRequestPricesService(
  //     `${this.priceDestination}request/balance`
  //   );
  // }

  // /**
  //   Sends "get balance" request to database service
  // */
  // async getBalanceFromDbService() {
  //   await this.getRequestDatabaseService(
  //     `${this.dbDestination}request-handler/balance`
  //   );
  // }

  // /**
  //   Sends "get response" request to price service
  // */
  // async getResponseFromPriceService() {
  //   await this.getRequestPricesService(`${this.priceDestination}request`);
  // }

  // /**
  //   Sends "get response" request to database service
  // */
  // async getResponseFromDbService() {
  //   await this.getRequestDatabaseService(`${this.dbDestination}`);
  // }

  // /**
  //   Sends "get customer name" request to price service
  // */
  // async getCustomerNameFromPriceService() {
  //   await this.getRequestPricesService(
  //     `${this.priceDestination}request/customer-name`
  //   );
  // }

  // /**
  //   Sends "get customer name" request to database service
  // */
  // async getCustomerNameFromDbService() {
  //   await this.getRequestDatabaseService(
  //     `${this.dbDestination}request-handler/customer-name`
  //   );
  // }

  // /**
  //   Sends "get account worth" request to database service
  // */
  // async getAccountWorthFromDbService() {
  //   await this.getRequestDatabaseService(`${this.dbDestination}account-worth`);
  // }

  // /**
  //   Sends "get account worth" request to price service
  // */
  // async getAccountWorthFromPriceService() {
  //   await this.getRequestPricesService(
  //     `${this.priceDestination}request/account-worth`
  //   );
  // }

  /**
    reports an error to the error monitor
    
    @param source the source of the error
    @param error the error that occurred, if the error already has a correlationId, it will be used when reporting this error
  */
  handleError(source, error) {
    const corrId = error.error.correlationId;
    if (isNullOrUndefined(corrId)) {
      reportError({
        correlationId: null,
        log: {
          detector: 'Account Service',
          source: source,
          time: Date.now(),
          type: LogType.ERROR,
          data: {
            expected: 'not defined', // what exactly should be expected value is not defined
            result: error,
          },
        },
      });
    } else {
      error.error.detector = 'Account Service';
      reportError(error.error);
    }
  }
}
