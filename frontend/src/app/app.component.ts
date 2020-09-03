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

  // selected request in ui
  requestName: string = '';

  fetchedResult;

  // received result from request
  consoleOutput: LogOutput[] = [];

  constructor(private http: HttpClient) {}

  /**
    * Sends a request to either the database service or the price service corresponding to the selected selectedDestination, selected in the ui.

  */
  async sendRequest() {
    if (this.selectedDestination == this.dbDestination) {
      if (this.requestName === '' || this.requestName === 'account-worth') {
        this.getRequestDatabaseService(`${this.dbDestination}`).subscribe(
          (data) => {
            this.fetchedResult = data.result;
            console.log(this.fetchedResult);
            this.addResultToOutputLog(this.fetchedResult);
          },
          (error) => {
            this.addErrorToOutputLog(error);
          }
        );
      } else {
        this.getRequestDatabaseService(
          `${this.dbDestination}request-handler/`
        ).subscribe(
          (data) => {
            this.fetchedResult = data.result;
            this.addResultToOutputLog(this.fetchedResult);
          },
          (error) => {
            this.addErrorToOutputLog(error);
          }
        );
      }
    } else {
      this.getRequestPricesService(
        `${this.priceDestination}request/`
      ).subscribe(
        (data) => {
          console.log(data);
          this.fetchedResult = data.result.result;
          this.addResultToOutputLog(this.fetchedResult);
        },
        (error) => {
          this.addErrorToOutputLog(error);
        }
      );
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
  getRequestDatabaseService(requestServiceUrl: string): any {
    console.log('hi');
    return this.http.post(this.backendDestination, {
      requestService: requestServiceUrl,
      endpoint: this.requestName,
    });
  }

  addResultToOutputLog(result) {
    this.consoleOutput.push({
      message: `Successful, Result: ${result}`,
      type: 'success',
    });
  }

  addErrorToOutputLog(error) {
    this.consoleOutput.push({
      message: 'Request failed',
      type: 'error',
    });
    this.handleError('Price Service', error);
  }

  /**
   * Sends a get request to the price service
   *
   * @param url of the get request
   */
  getRequestPricesService(requestServiceUrl: string): any {
    return this.http.post(this.backendDestination, {
      requestService: requestServiceUrl,
      endpoint: this.requestName,
    });
  }

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
