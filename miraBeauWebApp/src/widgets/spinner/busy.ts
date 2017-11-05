export class Busy {
  active:number = 0;
  on() { this.active++; }
  off() { this.active--; }
}
