import * as yup from 'yup';

export const bookValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  image: yup.string(),
  book_owner_id: yup.string().nullable(),
});
