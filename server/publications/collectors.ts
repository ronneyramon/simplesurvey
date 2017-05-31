import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Collectors } from '../../both/collections/collectors';
import { Collector } from '../../both/models/collector';
import { Survey } from "../../both/models/survey";
import { Surveys } from "../../both/collections/surveys";

Meteor.publishComposite('collectors', function(id:string): PublishCompositeConfig<Collector> {
 
  return {
    find: () => {
      return Collectors.collection.find(id);
    },
 
    children: [
      <PublishCompositeConfig1<Collector, Survey>> {
        find: (collector) => {
          return Surveys.collection.find({ _id: collector.surveyId });
        }
      }
    ]
  };
});