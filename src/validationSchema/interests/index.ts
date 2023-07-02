import * as yup from 'yup';

export const interestValidationSchema = yup.object().shape({
  seller_id: yup.string().nullable(),
  book_id: yup.string().nullable(),
});
