export class FilterValueConverter {

  toView(array, searchTerm, filterFunc) {
    if (!array || !searchTerm || !filterFunc) {
      return array;
    }
    return array.filter(item => {
      const matches = searchTerm && searchTerm.length > 0 ? filterFunc(searchTerm, item) : true;
      return matches;
    });
  }
}
