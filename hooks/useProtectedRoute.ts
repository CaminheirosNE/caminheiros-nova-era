'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkPrivilege } from '../utils/privileges';
import type { UserPrivilege } from '../types';

const useProtectedRoute = (
  screenId: string,
  requiredLevel: number = 3
): void => {
  const router = useRouter();

  useEffect(() => {
    const checkAccess = () => {
      try {
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
      } catch (error) {
        console.error('Error in protected route:', error);
        router.push('/login');
      }
    };

    checkAccess();
  }, [screenId, requiredLevel, router]);
};

export default useProtectedRoute;
