import {HttpClient} from "aurelia-fetch-client";
import {autoinject} from "aurelia-framework";
import {HTTP_STATUS_CODE} from "./http-status-code";
import {ObjectUtil} from "../../resources/object-util";
import {HttpError} from "./http-error";

@autoinject
export class baseApi {

  basePath:string = "https://westeurope.api.cognitive.microsoft.com/face/v1.0/";

  constructor(private http: HttpClient) {
    http.configure(config => config.rejectErrorResponses());
  }

  protected _get(path): Promise<any> {
    return this.fetchWithMethod("GET", path, null);
  }

  protected _post(path): Promise<any> {
    return this.fetchWithMethod("POST", path, null);
  }

  protected _put(path): Promise<any> {
    return this.fetchWithMethod("PUT", path, null);
  }

  protected _delete(path): Promise<any> {
    return this.fetchWithMethod("DELETE", path, null);
  }

  protected _postParams(path: string, formData?: FormData): Promise<any> {
    return this.fetchWithMethod("POST", path, {
      body: formData
    });
  }

  protected _postBody(path, jsonObject): Promise<any> {
    return this.fetchWithMethod("POST", path, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonObject)
    });
  }

  protected _putBody(path, jsonObject): Promise<any> {
    return this.fetchWithMethod("PUT", path, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonObject)
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
          "Ocp-Apim-Subscription-Key": "9efbc9f5bd714d9a99ef2df0e6b36ead"
        },
        mode: "cors"
      }, options)
    ).then(response => this.defaultResponseHandling(response), error => this.defaultErrorHandling(error));
  }

  private defaultResponseHandling(response) {
    if (response.status === HTTP_STATUS_CODE.NO_CONTENT) {
      return;
    }

    return response.json().then(jsonResponse => {
      if (jsonResponse.errorcode) {
        return this.responseErrorHandling(jsonResponse);
      }
      return jsonResponse;
    });
  }

  private defaultErrorHandling(error) {
    if (error.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
      this.ecoSystem.redirectToClientLoginPage();
    } else {
      return error.json().then(errorResponse => {
        return Promise.reject(errorResponse);
      });
    }
  }

  private responseErrorHandling(error) {
    if (error.errorcode === HTTP_STATUS_CODE.UNAUTHORIZED) {
      this.ecoSystem.redirectToClientLoginPage();
    } else {
      throw new HttpError(error.message, error.errorcode);
    }
  }

}
