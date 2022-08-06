import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Props = {
  data: any;
};

export const useRefreshServerSideProps = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // when props.data changes, loading is complete
  useEffect(() => {
    setIsLoading(false);
  }, [props.data]);

  const refreshSSP = () => {
    setIsLoading(true);
    router.replace(router.asPath);
  };

  return { refreshSSP, isLoading };
};
