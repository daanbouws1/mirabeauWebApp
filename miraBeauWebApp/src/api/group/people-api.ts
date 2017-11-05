import {baseApi} from "../base-api/base-api";

export class PeopleApi extends baseApi {

  servicePath = "persongroups/mirabeaugroup_mobile/persons";
 
   getPeople() {
    return this._get(this.servicePath + "?");
   }
 
   deletePerson(id: string) {
     return this._delete(this.servicePath + "/" + id);
   }
 
   updatePerson(id: string, formData: JSON) {
     //TODO make normal post like addPerson();
     return this._postParams(this.servicePath + "/" + id + "?", formData);
   }

   getPerson(id: string) {
     return this._get(this.servicePath + "/" + id);
   }
 
   addPerson(params: any) {
     return this._post(this.servicePath, params)
   }

   addPersonFace(params: any, personId: string) {
     return this._post(this.servicePath + "/" + personId + "/" + "persistedFaces", params);
   }
}
