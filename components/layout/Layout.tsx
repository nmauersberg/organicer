import React, { ReactElement } from 'react';
import { MainMenu } from '../menu/MainMenu';
import { Header } from './Header';

type LayoutProps = {
  children: ReactElement | ReactElement[] | string;
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      {children}
      <MainMenu />
    </div>
  );
};

export default Layout;
