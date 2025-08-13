// packages/app/app/index.tsx
import { Link, useRouter } from 'expo-router'; // <-- Import Link and useRouter
import React from 'react';

export default function HomeScreen() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}