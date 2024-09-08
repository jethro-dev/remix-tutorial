import {
  Form,
  json,
  redirect,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';
import type { FunctionComponent } from 'react';

import type { ContactRecord } from '../data';

import { getContact, updateContact } from '../data';
import { LoaderFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  console.log('Hello Edit Loader');
  invariant(params.contactId, 'Missing contactId param');
  const contact = await getContact(params.contactId);

  if (!contact) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ contact });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  console.log('Hello Edit Action');
  invariant(params.contactId, 'Missing contactId param');
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={contact.first}
          aria-label="First name"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
