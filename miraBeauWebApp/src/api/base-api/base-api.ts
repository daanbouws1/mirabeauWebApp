import {HttpClient} from "aurelia-fetch-client";
import {autoinject} from "aurelia-framework";
import {HTTP_STATUS_CODE} from "./http-status-code";
import {ObjectUtil} from "../../resources/object-util";
import {HttpError} from "./http-error";

@autoinject
export class baseApi {

  basePath: string = "https://westeurope.api.cognitive.microsoft.com/face/v1.0/";

  constructor(private http: HttpClient) {
    http.configure(config => config.rejectErrorResponses());
  }

  protected _get(path): Promise<any> {
    return this.fetchWithMethod("GET", path, null);
  }

  protected _delete(path): Promise<any> {
    return this.fetchWithMethod("DELETE", path, null);
  }

  // Only use for Azure, they are oldschool af.
  protected _post(path: string, params: any) : Promise<any> {
    return this.fetchWithMethod("POST", path, {
      body: params
    });
  }

  protected _patch(path: string, params: any) : Promise<any> {
    return this.fetchWithMethod("PATCH", path, {
      body: params
    })
  }

  // Don't use for Azure, they are oldschool af.
  protected _postParams(path: string, formData: FormData): Promise<any> {
    return this.fetchWithMethod("POST", path, {
      body: formData
    });
  }

  private fetchWithMethod(method, path, options): Promise<any> {
    return this.fetch(path, Object.assign({
      method: method
    }, options));
  }

  private fetch(path: string, options: object): Promise<any> {
    const endpoint = `${this.basePath}${path}`;

    return this.http.fetch(
      `${endpoint}`,
      ObjectUtil.deepAssign({
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": "9efbc9f5bd714d9a99ef2df0e6b36ead"
        },
        mode: "cors"
      }, options)
    ).then(response => this.defaultResponseHandling(response), error => this.defaultErrorHandling(error));
  }

  private defaultResponseHandling(response) {
    if(response) {
      return response.json().then(jsonResponse => {
        if (jsonResponse.errorcode) {
          return this.responseErrorHandling(jsonResponse);
        }
        return jsonResponse;
      }).catch(() => {
        let promise: Promise = Promise.resolve();
        return promise;
      });
    }
  }

  private defaultErrorHandling(error) {
    if (error.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
      // this.ecoSystem.redirectToClientLoginPage();
    } else {
      return error.json().then(errorResponse => {
        return Promise.reject(errorResponse);
      });
    }
  }

  private responseErrorHandling(error) {
    if (error.errorcode === HTTP_STATUS_CODE.UNAUTHORIZED) {
      // this.ecoSystem.redirectToClientLoginPage();
    } else {
      throw new HttpError(error.message, error.errorcode);
    }
  }

}
