import {baseApi} from "../base-api/base-api";

export class PeopleApi extends baseApi {

  servicePath = "persongroups/";

  getPeople() {
    this.servicePath += "mirabeaugroup_mobile/persons?";
    return this._get(this.servicePath);
  }

}
