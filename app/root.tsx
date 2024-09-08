import {
  Form,
  json,
  Link,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  NavLink,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import appStylesHref from './app.css?url';
import { createEmptyContact, getContact, getContacts } from './data';
import { useEffect } from 'react';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: appStylesHref },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log('Hello Root Loader');
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q');

  useEffect(() => {
    const searchField = document.getElementById('q');
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || '';
    }
  }, [q]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form
              id="search-form"
              role="search"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
            >
              <input
                id="q"
                aria-label="Search contacts"
                className={searching ? 'loading' : ''}
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q || ''}
              />
              <div hidden={!searching} id="search-spinner" aria-hidden />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            <ul>
              {contacts.map((contact) => {
                const name =
                  contact.first && contact.last
                    ? `${contact.first} ${contact.last}`
                    : 'No Name';
                return (
                  <li key={contact.id}>
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive ? 'active' : isPending ? 'pending' : ''
                      }
                      to={`/contacts/${contact.id}`}
                    >
                      {name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <div
          className={
            navigation.state === 'loading' && !searching ? 'loading' : ''
          }
          id="detail"
        >
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
