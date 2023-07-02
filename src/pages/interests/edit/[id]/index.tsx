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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getInterestById, updateInterestById } from 'apiSdk/interests';
import { Error } from 'components/error';
import { interestValidationSchema } from 'validationSchema/interests';
import { InterestInterface } from 'interfaces/interest';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { SellerInterface } from 'interfaces/seller';
import { BookInterface } from 'interfaces/book';
import { getSellers } from 'apiSdk/sellers';
import { getBooks } from 'apiSdk/books';

function InterestEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InterestInterface>(
    () => (id ? `/interests/${id}` : null),
    () => getInterestById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: InterestInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateInterestById(id, values);
      mutate(updated);
      resetForm();
      router.push('/interests');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<InterestInterface>({
    initialValues: data,
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
            Edit Interest
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(InterestEditPage);
