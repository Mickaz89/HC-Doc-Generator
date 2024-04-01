import { PDFCheckBox, PDFDropdown, PDFField, PDFTextField } from 'pdf-lib';
import { FormBody } from './types';

export const languageMapping = {
  'Language 1 Check Box': 'deutch',
  'Language 2 Check Box': 'english',
  'Language 3 Check Box': 'français',
  'Language 4 Check Box': 'esperanto',
  'Language 5 Check Box': 'latin',
};

export const fieldNameMapping = {
  'Given Name Text Box': 'given_name',
  'Family Name Text Box': 'family_name',
  'House nr Text Box': 'house_number',
  'Address 1 Text Box': 'address1',
  'Address 2 Text Box': 'address2',
  'Postcode Text Box': 'postcode',
  'Country Combo Box': 'country',
  'Gender List Box': 'gender',
  'Height Formatted Field': 'height',
  'City Text Box': 'city',
  'Driving License Check Box': 'driving_license',
  'Favourite Colour List Box': 'favorite_color',
};

export function processField(field: PDFField, formBody: FormBody): void {
  const pdfFieldName = field.getName();
  const formBodyFieldName = fieldNameMapping[pdfFieldName];

  if (
    (formBodyFieldName && formBody[formBodyFieldName] !== undefined) ||
    languageMapping[pdfFieldName]
  ) {
    if (field instanceof PDFTextField) {
      field.setText(formBody[formBodyFieldName]);
    } else if (field instanceof PDFDropdown) {
      processDropdownField(field, pdfFieldName, formBody);
    } else if (field instanceof PDFCheckBox) {
      processCheckBoxField(field, pdfFieldName, formBody);
    }
  }
}

export function processCheckBoxField(
  field: PDFCheckBox,
  pdfFieldName: string,
  formBody: FormBody,
): void {
  if (languageMapping[pdfFieldName] === formBody['language']) {
    field.check();
  } else if (formBody[fieldNameMapping[pdfFieldName]]) {
    field.check();
  } else {
    field.uncheck();
  }
}

export function processDropdownField(
  field: PDFDropdown,
  pdfFieldName: string,
  formBody: FormBody,
): void {
  if (formBody[fieldNameMapping[pdfFieldName]]) {
    field.addOptions(formBody[fieldNameMapping[pdfFieldName]]);
    field.select(formBody[fieldNameMapping[pdfFieldName]]);
  }
}
