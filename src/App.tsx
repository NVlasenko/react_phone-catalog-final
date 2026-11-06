import React from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

import { useFooter } from '@/context/FooterContext';
import { useLoader } from '@/context/LoaderContext';

import './App.scss';

export const App: React.FC = () => {
  const { isLoading } = useLoader();
  const { isShow } = useFooter();

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Outlet />
        {isLoading || (isShow && <Footer />)}
      </div>
    </div>
  );
};
