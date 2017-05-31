import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { MeteorObservable } from 'meteor-rxjs';
import { Collectors } from "../../../both/collections/collectors";
import { Collector } from "../../../both/models/collector";
import template from "./response.html";
import style from "./response.scss";
import { ActivatedRoute, Params } from "@angular/router";
import * as SurveyJS from 'survey-angular';
import { Surveys } from "../../../both/collections/surveys";
import { Survey } from "../../../both/models/survey";
import { addResponse } from "../../../both/methods/response";

@Component({
  selector: "response",
  template,
  styles: [style]
})
export class ResponseComponent implements OnInit {
  survey: Survey;
  collector: Collector;  

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    SurveyJS.defaultBootstrapCss.navigationButton = "btn btn-primary";
    SurveyJS.Survey.cssType = "bootstrap";
    
    this.route.params.subscribe(
      (params: Params) => {
        MeteorObservable.subscribe('collectors', params['id']).subscribe(() => {
          this.collector = Collectors.findOne();
          this.survey = Surveys.findOne(this.collector.surveyId);
          
          var surveyJS = new SurveyJS.ReactSurveyModel(this.survey.surveyJSON);
          surveyJS.onComplete.add(this.storeResponse.bind(this));
          SurveyJS.SurveyNG.render("surveyElement", { model: surveyJS });
          
        });
      }
    );
  }

  storeResponse(surveyJS){
    addResponse.call({collectorId : this.collector._id, responseData : surveyJS.data });
  }
}