import { MongoObservable } from "meteor-rxjs";
import { Collector } from "../models/collector";

export const Collectors = new MongoObservable.Collection<Collector>("collectors");