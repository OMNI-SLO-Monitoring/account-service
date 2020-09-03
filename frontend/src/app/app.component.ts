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
   * Depending on the endpoint selected in the ui which is stored in the variable requestName, the necessary information that is the url of the
   * selected service and the endpoint are passed onto the respective function that conducts the HTTP post request to the backend. The backend
   * then uses the information provided to execute a HTTP get request to the respective service.
   * The resulting data or error is thereupon added into the output log which is rendered into view in the ui.
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
            this.addErrorToOutputLog(`${this.dbDestination}`, error);
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
            this.addErrorToOutputLog(`${this.dbDestination}`, error);
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
          this.addErrorToOutputLog(`${this.priceDestination}`, error);
        }
      );
    }
  }

  /**
   * Sends a post request to the backend with the necessary request information which uses it
   * to send a HTTP get request to the database service.
   *
   * @param url of the get request
   * @return data of the request
   */
  getRequestDatabaseService(requestServiceUrl: string): any {
    return this.http.post(this.backendDestination, {
      requestService: requestServiceUrl,
      endpoint: this.requestName,
    });
  }

  /**
   * Appends a message containing the result of the request to the output log array.
   * The content in the output log array are visualized in the ui.
   *
   * @param result of the request
   */
  addResultToOutputLog(result) {
    this.consoleOutput.push({
      message: `Successful, Result: ${result}`,
      type: 'success',
    });
  }
  /**
   * Appends a message containing the error message of the failed request to the output log array.
   * The content in the output log array is visualized in the ui.
   *
   * @param error the error message of the request
   */
  addErrorToOutputLog(source, error) {
    this.consoleOutput.push({
      message: 'Request failed',
      type: 'error',
    });
    this.handleError(source, error);
  }

  /**
   * Sends a post request with the necessary request information to the backend which uses it
   * to send a HTTP get request to the price service.
   *
   * @param url of the get request
   * @return data of the request
   */
  getRequestPricesService(requestServiceUrl: string): any {
    return this.http.post(this.backendDestination, {
      requestService: requestServiceUrl,
      endpoint: this.requestName,
    });
  }

  /**
   * Reports an error to the error monitor with a correlationId field, and a log that is populated with the necessary
   * error information.
   *
   * @param source the source of the error
   * @param error the error that occurred, if the error already has a correlationId, it will be used when reporting this error
   */
  handleError(source, error) {
    const corrId = error.error.correlationId;
    if (isNullOrUndefined(corrId)) {
      reportError({
        correlationId: null,
        log: {
          detector: `${environment.BACKEND_ACCOUNT_SERVICE_URL}`,
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
      error.error.detector = `${environment.BACKEND_ACCOUNT_SERVICE_URL}`;
      reportError(error.error);
    }
  }
}
