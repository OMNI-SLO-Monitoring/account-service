import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LogMessageFormat, LogType, reportError } from 'logging-format';
// import { reportError } from "error-reporter";
import { isNullOrUndefined } from 'util';

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
  result: any;

  constructor(private http: HttpClient) { }

  /**
    Sends a request to either the database service or the price service corresponding to the selected selectedDestination, selected in the ui
  */
  async sendRequest() {
    if (this.selectedDestination == this.dbDestination) {
      if (this.requestName == this.getBalance) {
        this.getBalanceFromDbService();
      } else if (this.requestName == this.getResponse) {
        this.getResponseFromDbService();
      } else if (this.requestName == this.getCustomerName) {
        this.getCustomerNameFromDbService();
      } else if (this.requestName == this.getAccountWorth) {
        this.getAccountWorthFromDbService();
      }
    } else {
      if (this.requestName == this.getBalance) {
        this.getBalanceFromPriceService();
      } else if (this.requestName == this.getResponse) {
        this.getResponseFromPriceService();
      } else if (this.requestName == this.getCustomerName) {
        this.getCustomerNameFromPriceService();
      } else if (this.requestName == this.getAccountWorth) {
        this.getAccountWorthFromPriceService();
      }
    }
  }

  /**
    Sends "get balance" request to price service
  */
  async getBalanceFromPriceService() {
    try {
      this.result = await this.http.get(`${this.priceDestination}request/balance`).toPromise();
      console.log(this.result);
    } catch (error) {
      console.log(error);
      this.result = error;
      this.handleError("Price Service", error);
    }
  }

  /**
    Sends "get balance" request to database service
  */
  async getBalanceFromDbService() {
    try {
      this.result = await this.http.get(`${this.dbDestination}request-handler/balance`).toPromise();
      console.log(this.result);
    } catch (error) {
      console.log(error);
      this.result = error;
      this.handleError("Database Service", error);
    }
  }

  /**
    Sends "get response" request to price service
  */
  async getResponseFromPriceService() {
    try {
      this.result = await this.http.get(`${this.priceDestination}request`).toPromise();
      console.log(this.result);
    } catch (error) {
      console.log(error);
      this.result = error;
      this.handleError("Price Service", error);
    }
  }

  /**
    Sends "get response" request to database service
  */
  async getResponseFromDbService() {
    try {
      this.result = await this.http.get(`${this.dbDestination}`, {responseType: 'text'}).toPromise();
      console.log(this.result);
    } catch (error) {
      console.log(error);
      this.result = error;
      this.handleError("Database Service", error);
    }
  }

  /**
    Sends "get customer name" request to price service
  */
  async getCustomerNameFromPriceService() {
    try {
      this.result = await this.http.get(`${this.priceDestination}request/customer-name`).toPromise();
      console.log(this.result);
    } catch (error) {
      console.log(error);
      this.result = error;
      this.handleError("Price Service", error);
    }
  }

  /**
    Sends "get customer name" request to database service
  */
  async getCustomerNameFromDbService() {
    try {
      this.result = await this.http.get(`${this.dbDestination}request-handler/customer-name`, {responseType: 'text'}).toPromise();
      console.log(this.result);
    } catch (error) {
      console.log(error);
      this.result = error;
      this.handleError("Database Service", error);
    }
  }

  /**
    Sends "get account worth" request to database service
  */
  async getAccountWorthFromDbService() {
    try {
      this.result = await this.http.get(`${this.dbDestination}account-worth`).toPromise();
      console.log(this.result);
    } catch (error) {
      console.log(error);
      this.result = error;
      this.handleError("Database Service", error);
    }
  }

  /**
    Sends "get account worth" request to price service
  */
  async getAccountWorthFromPriceService() {
    try {
      this.result = await this.http.get(`${this.priceDestination}request/account-worth`, {observe: 'response'}).toPromise();
      // const recievedCorrelationId = this.result.headers.get("ErrorCorrelationId");
      // console.log('Corr', recievedCorrelationId);
      console.log(this.result);
    } catch (error) {
      console.log(error);
      this.result = error;
      this.handleError("Price Service", error);
    }
  }

  /**
    reports an error to the error monitor
    
    @param source the source of the error
    @param error the error that occoured, if the error already has a correlationId, it will be used when reporting this error
  */
  handleError(source, error) {

    const corrId = error.error.correlationId
    console.log('Corr', corrId);
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
      reportError(error.error);
    }
  }
}
