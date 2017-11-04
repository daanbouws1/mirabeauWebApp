import {baseApi} from "../base-api/base-api";

export class PeopleApi extends baseApi {

  servicePath = "persongroups/mirabeaugroup_mobile/persons";
 
   getPeople() {
    console.warn("GETPEOPLE")
    return this._get(this.servicePath + "?");
   }
 
   deletePerson(id: string) {
     console.warn("DELETEPERSON")
     return this._delete(this.servicePath + "/" + id);
   }
 
   updatePerson(id: string, formData: FormData) {
     console.warn("UPDATEPERSON")
     return this._postParams(this.servicePath + "/" + id + "?");
   }


   getPerson(id: string) {
     console.warn("GETPERSON")
     return this._get(this.servicePath + "/" + id);
   }
 
   addPerson(formData: FormData) {
     console.warn("ADDPERSON")
     return this._postParams(this.servicePath + "?", formData);
   }


}
