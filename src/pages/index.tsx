import { useRouter } from 'next/router';
import { useEffect } from 'react';
export default function Index() {
  const router = useRouter();
  useEffect(() => {
    router.push('/recipes');
  }, []);
  return (
    <p>
      Mealbase is an app that helps you save, search, and organize your favorite
      recipes from anywhere on the web.
    </p>
  );
}
