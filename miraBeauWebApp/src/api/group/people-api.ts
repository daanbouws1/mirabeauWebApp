import {baseApi} from "../base-api/base-api";

export class PeopleApi extends baseApi {

  // TODO dynamically check which group based on logged in user to use instead of hardcoded.
  servicePath = "persongroups/";
 
   getPeople(group: any) {
    return this._get(this.servicePath + group + "/persons?");
   }
 
   deletePerson(id: string, group: any) {
     return this._delete(this.servicePath + group + "/persons/" + id);
   }
 
   updatePerson(params: any, id: string, group: any) {
     return this._patch(this.servicePath + group + "/persons/" + id + "?", params);
   }

   getPerson(id: string, group: any) {
     return this._get(this.servicePath + group + "/persons/" + id);
   }
 
   addPerson(params: any, group: any) {
     return this._post(this.servicePath + group + "/persons?", params)
   }

   updatePersonFace(params: any, personId: string, personFaceId: string, group: any) {
     return this._patch(this.servicePath + group + "/persons/" + personId + "/persistedFaces/" + personFaceId + "?", params);
   }

   getPersonFace(personId: string, personFaceId: string, group: any) {
     return this._get(this.servicePath + group + "/persons/" + personId + "/persistedFaces/" + personFaceId + "?");
   }

   addPersonFace(params: any, personId: string, group: any) {
     return this._post(this.servicePath + group + "/persons/" + personId + "/persistedFaces", params);
   }

   deletePersonFace(personId: string, personFaceId: string, group: any) {
     return this._delete(this.servicePath + group + "/persons/" + personId + "/persistedFaces/" + personFaceId + "?");
   }

   trainGroup(group: any) {
     return this._post(this.servicePath + group + "/train?", null);
   }

   createGroup(group: any) {
     let groupdata = {"name": group};
     return this._put(this.servicePath + group + "?", JSON.stringify(groupdata));
   }

   deleteGroup(group: any) {
     return this._delete(this.servicePath + group + "?");
   }
}
