import {baseApi} from "../base-api/base-api";

export class PeopleApi extends baseApi {

  servicePath = "persongroups/mirabeaugroup_mobile/";
 
   getPeople() {
    return this._get(this.servicePath + "persons?");
   }
 
   deletePerson(id: string) {
     return this._delete(this.servicePath + "persons/" + id);
   }
 
   updatePerson(params: any, id: string) {
     return this._patch(this.servicePath + "persons/" + id + "?", params);
   }

   getPerson(id: string) {
     return this._get(this.servicePath + "persons/" + id);
   }
 
   addPerson(params: any) {
     return this._post(this.servicePath + "persons?", params)
   }

   updatePersonFace(params: any, personId: string, personFaceId: string) {
     return this._patch(this.servicePath + "persons/" + personId + "/persistedFaces/" + personFaceId + "?", params);
   }

   getPersonFace(personId: string, personFaceId: string) {
     return this._get(this.servicePath + "persons/" + personId + "/persistedFaces/" + personFaceId + "?");
   }

   addPersonFace(params: any, personId: string) {
     return this._post(this.servicePath + "persons/" + personId + "/persistedFaces", params);
   }

   trainGroup() {
     return this._post(this.servicePath + "train?", null);
   }
}
