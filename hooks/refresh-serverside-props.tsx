import React from 'react';
import { useRouter } from 'next/router';

export const useRefreshServerSideProps = () => {
  const router = useRouter();

  const refreshSSP = () => {
    router.replace(router.asPath);
  };

  return { refreshSSP };
};
