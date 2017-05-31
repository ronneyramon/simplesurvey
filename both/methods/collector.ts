import { Collectors } from '../../both/collections/collectors';
import { Collector } from '../../both/models/collector';
import { Surveys } from '../../both/collections/surveys';
import { Observable } from "rxjs/Observable";

export const addCollector = new ValidatedMethod({
    name: 'addCollector',
    validate: new SimpleSchema({
        surveyId: { type: String },
        responseCallbackUrl: { type: String }
    }).validator(),
    run(collector) : Collector {
        var col = <Collector>collector;
        col.responseUrl = 'http://www.google.com.br';
        var id = Collectors.collection.insert(col);
        return Collectors.collection.findOne(id);
    },
});