import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkPrivilege } from '../../utils/privileges';
import type { UserPrivilege } from '../../types';

interface UseProtectedRouteProps {
  privileges: UserPrivilege[];
  userId: string;
  screenId: string;
  requiredLevel: number;
}

export const useProtectedRoute = ({
  privileges,
  userId,
  screenId,
  requiredLevel
}: UseProtectedRouteProps) => {
  const router = useRouter();

  useEffect(() => {
    const userLevel = checkPrivilege(privileges, userId, screenId);
    
    if (userLevel > requiredLevel) {
      router.push('/acesso-negado'); // Redireciona para página de acesso negado
    }
  }, [privileges, userId, screenId, requiredLevel, router]);
};

export default useProtectedRoute;