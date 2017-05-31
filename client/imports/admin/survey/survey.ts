import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { MeteorObservable } from 'meteor-rxjs';
import { Surveys } from "../../../../both/collections/surveys";
import { Survey } from "../../../../both/models/survey";
import template from "./survey.html";
import style from "./survey.scss";
import { ActivatedRoute, Params } from "@angular/router";
import { SurveyEditorComponent } from './survey.editor.component';
import { updateSurvey } from "../../../../both/methods/survey";

@Component({
  selector: "survey",
  template,
  styles: [style]
})

export class SurveyComponent implements OnInit {
  data: Survey;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      MeteorObservable.subscribe('surveys', params['id']).subscribe(() => {
        this.data = Surveys.findOne();
      });
    });

  }

  onSurveySaved(survey) {
    this.data.surveyJSON = survey;
    updateSurvey.call(this.data);
  }
}