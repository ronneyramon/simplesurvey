export interface Survey {
  _id?: string;
  name: string;
  description: string;
  adminUrl?: string;
  surveyJSON? : Object;
}