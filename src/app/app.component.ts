import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LogMessageFormat, LogType, reportError } from 'logging-format';
// import { reportError } from "error-reporter";
import { isNullOrUndefined } from 'util';

interface LogOutput {
  message: string;
  type: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  dbDestination = "http://localhost:3000/";
  priceDestination = "http://localhost:3300/";
  // selected destination of request in ui
  selectedDestination: string;


  getBalance = "balance";
  getCustomerName = "customer-name";
  getResponse = "response";
  getAccountWorth ="account-worth";
  // selected request in ui
  requestName: string;

  // recieved result from request
  consoleOutput: LogOutput[] = [];

  constructor(private http: HttpClient) { }

  /**
    Sends a request to either the database service or the price service corresponding to the selected selectedDestination, selected in the ui
  */
  async sendRequest() {
    if (this.selectedDestination == this.dbDestination) {
      if (this.requestName == this.getBalance) {
        this.printRequestType("Requesting Balance")
        await this.getBalanceFromDbService();
      } else if (this.requestName == this.getResponse) {
        this.printRequestType("Requesting Default Request")
        await this.getResponseFromDbService();
      } else if (this.requestName == this.getCustomerName) {
        this.printRequestType("Requesting Customer Name")
        await this.getCustomerNameFromDbService();
      } else if (this.requestName == this.getAccountWorth) {
        this.printRequestType("Requesting Account Worth")
        await this.getAccountWorthFromDbService();
      }
    } else {
      if (this.requestName == this.getBalance) {
        this.printRequestType("Requesting Balance")
        await this.getBalanceFromPriceService();
      } else if (this.requestName == this.getResponse) {
        this.printRequestType("Requesting Default Request")
        await this.getResponseFromPriceService();
      } else if (this.requestName == this.getCustomerName) {
        this.printRequestType("Requesting Customer Name")
        await this.getCustomerNameFromPriceService();
      } else if (this.requestName == this.getAccountWorth) {
        this.printRequestType("Requesting Account Worth")
        await this.getAccountWorthFromPriceService();
      }
    }
  }

  printRequestType(message) {
    this.consoleOutput.push({
      message: message,
      type: "info"
    })
  }

  async getRequestDatabaseService(url: string) {
    try {
      const result: any = await this.http.get(url).toPromise();
      this.consoleOutput.push({
        message: `Successful, Result: ${result}`,
        type: "success"
      })
      console.log(result);
    } catch (error) {
      console.log(error);
      this.consoleOutput.push({
        message: "Request failed",
        type: "error"
      })
      this.handleError("Database Service", error);
    }
  }

  async getRequestPricesService(url: string) {
    try {
      const result: any = await this.http.get(url).toPromise();
      this.consoleOutput.push({
        message: `Successful, Result: ${result.result}`,
        type: "success"
      })
      console.log(result);
    } catch (error) {
      console.log(error);
      this.consoleOutput.push({
        message: "Request failed",
        type: "error"
      })
      this.handleError("Price Service", error);
    }
  }

  /**
    Sends "get balance" request to price service
  */
  async getBalanceFromPriceService() {
    await this.getRequestPricesService(`${this.priceDestination}request/balance`);
  }

  /**
    Sends "get balance" request to database service
  */
  async getBalanceFromDbService() {
    await this.getRequestDatabaseService(`${this.dbDestination}request-handler/balance`);
  }

  /**
    Sends "get response" request to price service
  */
  async getResponseFromPriceService() {
    await this.getRequestPricesService(`${this.priceDestination}request`);
  }

  /**
    Sends "get response" request to database service
  */
  async getResponseFromDbService() {
    await this.getRequestDatabaseService(`${this.dbDestination}`);
  }

  /**
    Sends "get customer name" request to price service
  */
  async getCustomerNameFromPriceService() {
    await this.getRequestPricesService(`${this.priceDestination}request/customer-name`);
  }

  /**
    Sends "get customer name" request to database service
  */
  async getCustomerNameFromDbService() {
    await this.getRequestDatabaseService(`${this.dbDestination}request-handler/customer-name`);
  }

  /**
    Sends "get account worth" request to database service
  */
  async getAccountWorthFromDbService() {
    await this.getRequestDatabaseService(`${this.dbDestination}account-worth`);
  }

  /**
    Sends "get account worth" request to price service
  */
  async getAccountWorthFromPriceService() {
    await this.getRequestPricesService(`${this.priceDestination}request/account-worth`);
  }

  /**
    reports an error to the error monitor
    
    @param source the source of the error
    @param error the error that occoured, if the error already has a correlationId, it will be used when reporting this error
  */
  handleError(source, error) {

    const corrId = error.error.correlationId
    if (isNullOrUndefined(corrId)) {
      reportError({
        correlationId: null,
        log: {
          detector: "Acount Service",
          source: source,
          time: Date.now(),
          type: LogType.ERROR,
          data: {
            expected: "not defined",  // what exactly should be expected value is not defined
            result: error
          }
        }
      });
    } else {
      error.error.detector = "Account Service"
      reportError(error.error);
    }
  }
}
