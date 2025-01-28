import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkPrivilege } from '../utils/privileges';
import { UserPrivilege } from '../types';

export const useProtectedRoute = (
  screenId: string,
  requiredLevel: number = 3
): void => {
  const router = useRouter();

  useEffect(() => {
    const checkAccess = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }

      const privileges: UserPrivilege[] = JSON.parse(
        localStorage.getItem('privileges') || '[]'
      );

      const userLevel = checkPrivilege(privileges, userId, screenId);

      if (userLevel < requiredLevel) {
        router.push('/unauthorized');
      }
    };

    checkAccess();
  }, [screenId, requiredLevel, router]);
};

export default useProtectedRoute;
