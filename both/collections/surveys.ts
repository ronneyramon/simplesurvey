import { MongoObservable } from "meteor-rxjs";
import {Survey} from "../models/survey";

export const Surveys = new MongoObservable.Collection<Survey>("surveys");