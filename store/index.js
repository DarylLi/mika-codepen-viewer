import { makeAutoObservable } from "mobx";

class Main {
  code = {};
  curDB = null;
  setCode = (type, value) => {
    this.code[type] = value;
  };
  setDB = (DB) => {
    this.curDB = DB;
  };
  constructor() {
    makeAutoObservable(this);
  }
}

const mainStore = new Main();

export default mainStore;
