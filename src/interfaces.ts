export enum Languages {
  ENGLISH = 'english',
  DEUTSH = 'deutsh',
  FRANÇAIS = 'français',
  ESPERANTO = 'esperanto',
  LATIN = 'latin',
}

export interface FormBody {
  given_name: string;
  family_name: string;
  address1: string;
  address2?: string;
  house_number: string;
  postcode: string;
  city: string;
  country: string;
  gender: string;
  height: string;
  driving_license: boolean;
  language: Languages;
  favorite_color: string;
  jobId: string;
}
