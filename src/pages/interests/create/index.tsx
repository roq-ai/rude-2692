import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createInterest } from 'apiSdk/interests';
import { Error } from 'components/error';
import { interestValidationSchema } from 'validationSchema/interests';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { SellerInterface } from 'interfaces/seller';
import { BookInterface } from 'interfaces/book';
import { getSellers } from 'apiSdk/sellers';
import { getBooks } from 'apiSdk/books';
import { InterestInterface } from 'interfaces/interest';

function InterestCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: InterestInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createInterest(values);
      resetForm();
      router.push('/interests');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<InterestInterface>({
    initialValues: {
      seller_id: (router.query.seller_id as string) ?? null,
      book_id: (router.query.book_id as string) ?? null,
    },
    validationSchema: interestValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Interest
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<SellerInterface>
            formik={formik}
            name={'seller_id'}
            label={'Select Seller'}
            placeholder={'Select Seller'}
            fetcher={getSellers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<BookInterface>
            formik={formik}
            name={'book_id'}
            label={'Select Book'}
            placeholder={'Select Book'}
            fetcher={getBooks}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.title}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'interest',
    operation: AccessOperationEnum.CREATE,
  }),
)(InterestCreatePage);
