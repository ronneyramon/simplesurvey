import { MongoObservable } from "meteor-rxjs";
import {Response} from "../models/response";

export const Responses = new MongoObservable.Collection<Response>("responses");
