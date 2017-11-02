import {baseApi} from "../base-api/base-api";

export class PeopleApi extends baseApi {

  servicePath = "persongroups/mirabeaugroup_mobile/";

  getPeople() {
    this.servicePath += "persons?";
    return this._get(this.servicePath);
  }

  deletePerson(dude: Person) {
    this.servicePath += "persons/" + dude.id;
    return this._delete(this.servicePath);
  }

  updatePerson(dude: Person) {
    this.servicePath += "persons/" + dude.id;
    return this._put(this.servicePath);
  }

  getPerson(dude: Person) {
    this.servicePath += "persons/" + dude.id;
    return this._get(this.servicePath);
  }

}
