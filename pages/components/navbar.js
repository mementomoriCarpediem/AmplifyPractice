import Link from 'next/link';
import React from 'react';
import '../../configureAmplify';
import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';

const NavBar = () => {
  const [signedUser, setSignedUser] = useState(false);

  useEffect(() => {
    authListener();
  }, []);

  const authListener = async () => {
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn':
          return setSignedUser(true);
        case 'signOut':
          return setSignedUser(false);
      }
    });

    try {
      await Auth.currentAuthenticatedUser();
      setSignedUser(true);
    } catch (error) {}
  };
  return (
    <nav className="flex justify-center pt-3 pb-3 space-x-4 border-b bg-cyan-500 border-gray-300">
      {[
        ['Home', '/'],
        ['Create Post', '/create-post'],
        ['Profile', '/profile'],
      ].map(([title, url]) => {
        return (
          <Link href={url} key={url}>
            <a className="rounded-lg px-3 py-2 text-slate-700 hover:text-slate-900">
              {title}
            </a>
          </Link>
        );
      })}
      {signedUser && (
        <Link href={'/my-posts'}>
          <a className="rounded-lg px-3 py-2 text-slate-700 hover:text-slate-900">
            My Posts
          </a>
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
