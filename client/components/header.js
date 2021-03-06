import React from 'react';
import Link from 'next/link';

const Header = ({ currentuser }) => {
  const links = [
    !currentuser && {
      label: 'Sign up',
      href: '/auth/signup',
    },
    !currentuser && {
      label: 'Sign in',
      href: '/auth/signin',
    },
    currentuser && {
      label: 'Sign out',
      href: '/auth/signout',
    },
    currentuser && {
      label: 'Sell Tickets',
      href: '/tickets/new',
    },
    {
      label: 'My Orders',
      href: '/orders',
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
