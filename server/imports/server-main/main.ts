import {Surveys} from "../../../both/collections/surveys";
import {Survey} from "../../../both/models/survey";

export class Main {
  start(): void {
    // this.initFakeData();
  }

  initFakeData(): void {
    if (Surveys.find({}).cursor.count() === 0) {
      const data: Survey[] = [{
        name: "Teste 1",
        description: "Teste"
      }, {
        name: "Teste 2",
        description: "Teste"
      }, {
        name: "Teste 3",
        description: "Teste"
      }];
      data.forEach((obj: Survey) => {
        Surveys.insert(obj);
      });
    }
  }
}
