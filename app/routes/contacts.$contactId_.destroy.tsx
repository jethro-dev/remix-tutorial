import { Form, json, redirect, useLoaderData } from '@remix-run/react';
import type { FunctionComponent } from 'react';

import type { ContactRecord } from '../data';

import { getContact, deleteContact } from '../data';
import { LoaderFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';

export const action = async ({ params }: LoaderFunctionArgs) => {
  console.log('Hello Destroy Action');
  invariant(params.contactId, 'Missing contactId param');
  await deleteContact(params.contactId);
  return redirect(`/`);
};
