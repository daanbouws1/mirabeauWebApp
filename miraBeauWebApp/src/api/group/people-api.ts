import {baseApi} from "../base-api/base-api";

export class PeopleApi extends baseApi {

  servicePath = "persongroups/mirabeaugroup_mobile/persons";

  getPeople() {
    this.servicePath += "?";
    return this._get(this.servicePath);
  }

  deletePerson(id: string) {
    this.servicePath += "/" + id;
    return this._delete(this.servicePath);
  }

  updatePerson(id: string, formData: FormData) {
    this.servicePath += "/" + id + "?";
    return this._postParams(this.servicePath);
  }

  getPerson(id: string) {
    this.servicePath += "/" + id;
    return this._get(this.servicePath);
  }

  addPerson(formData: FormData) {
    this.servicePath += "?";
    return this._postParams(this.servicePath, formData);
  }

}
