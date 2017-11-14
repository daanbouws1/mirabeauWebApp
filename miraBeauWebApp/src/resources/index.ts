import {FrameworkConfiguration} from 'aurelia-framework';


export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    "./value-converters/filter",
    "./value-converters/filter-params",
  ]);

}
