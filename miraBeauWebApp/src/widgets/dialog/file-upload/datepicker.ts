import {bindable, autoinject} from "aurelia-framework";

@autoinject
export class DatePicker {
  @bindable day;
  @bindable month;
  @bindable year;

  private _selectedDay: any;
  private _selectedMonth: any;
  private _selectedYear: any;

  constructor(private element: Element) {
  }

  get selectedDay() {
    return this._selectedDay;
  }

  get selectedMonth(){
  	return this._selectedMonth;
  }

  get selectedYear(){
  	return this._selectedYear;
  }

  set selectedDay(value) {
    this._selectedDay = value;
  }

  set selectedMonth(value){
  	this._selectedMonth = value;
  }

  set selectedYear(value){
  	this._selectedYear = value;
  }

  reset() {
    this.selectedDay = null;
    this.selectedMonth = null;
    this.selectedYear = null;
  }
}