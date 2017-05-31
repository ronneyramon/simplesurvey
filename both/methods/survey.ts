import { Surveys } from '../../both/collections/surveys';
import { Survey } from '../../both/models/survey';
import { Observable } from "rxjs/Observable";

export const addSurvey = new ValidatedMethod({
    name: 'addSurvey',
    validate: new SimpleSchema({
        name: { type: String },
        description: { type: String },
        surveyJSON: { type: Object, optional: true, blackbox: true }
    }).validator(),
    run(data): Survey {
        var obj = <Survey>data;
        obj.adminUrl = "https://www.pagolivre.com.br";

        var id = Surveys.collection.insert(obj);
        return Surveys.collection.findOne(id);
    },
});

export const updateSurvey = new ValidatedMethod({
    name: 'updateSurvey',
    validate: new SimpleSchema({
        _id: { type: String },
        name: { type: String },
        description: { type: String },
        surveyJSON: { type: Object, blackbox: true }
    }).validator(),
    run(data:any): Survey {
        var survey = Surveys.collection.findOne(data._id);
        if(!survey)
            throw new Meteor.Error("survey-not-exists","The survey does not exists.");

        Surveys.collection.update({ _id: survey._id}, {name: data.name, description: data.description, surveyJSON: data.surveyJSON});
        
        return Surveys.collection.findOne(survey._id);
    },
});