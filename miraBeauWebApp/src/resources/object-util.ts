import * as jQuery from "jquery";

export class ObjectUtil {

  static deepAssign(target, ...object) {
    return jQuery.extend(true, target, ...object);
  }

  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  static deepEquals(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

}
