import { Collectors } from '../../both/collections/collectors';
import { Collector } from '../../both/models/collector';
import { Responses } from "../../both/collections/responses";
import { Response } from "../../both/models/response";

export const addResponse = new ValidatedMethod({
    name: 'addResponse',
    validate: new SimpleSchema({
        collectorId: { type: String },
        responseData: { type: Object, blackbox: true }
    }).validator(),
    run(data: any): Response {
        let collector = Collectors.findOne(data.collectorId);
        if (!collector)
            throw new Meteor.Error('collector-not-exists', 'The collector does not exists');

        var response = <Response>data;

        var id = Responses.collection.insert(response);

        return Responses.collection.findOne(id);
    },
});