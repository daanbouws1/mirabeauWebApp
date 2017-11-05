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
     return this._postParams(this.servicePath + "/" + id + "?");
   }

   getPerson(id: string) {
     return this._get(this.servicePath + "/" + id);
   }
 
   addPerson(formData: any) {
     console.log(formData);
     return this._post(this.servicePath + "?", formData);
   }

   addPersonFace(formData: FormData, personId: string) {
     return this._postParams(this.servicePath + "/" + personId + "/" + "persistedFaces" + "?" + formData);
   }
}
