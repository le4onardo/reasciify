export default class Repeater {
  private processID;

  start = (callback: () => void, duration = 0) => {
    this.processID = setInterval(callback, 1);
    duration && setTimeout(this.stop, duration);
  };

  stop = () => {
    clearInterval(this.processID);
  };
}
