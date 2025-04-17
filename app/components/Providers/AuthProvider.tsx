// Example: In a component or context provider
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/app/lib/firebase'; // Adjust import path

function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, loading };
}

// Usage in a component:
// const { user, loading } = useAuth();
// if (loading) return <p>Loading...</p>;
// if (!user) return <LoginPage />;
// return <AuthenticatedApp user={user} />;