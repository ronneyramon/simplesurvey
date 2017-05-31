import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Surveys } from '../../both/collections/surveys';
import { Survey } from '../../both/models/survey';
 
Meteor.publish('surveys', function(id:string): Mongo.Cursor<Survey> {
  if (!id) {
    return;
  }
 
  return Surveys.collection.find({ _id : id });
});