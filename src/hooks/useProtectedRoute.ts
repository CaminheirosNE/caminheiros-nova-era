import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserPrivilege {
  userId: string;
  screenId: string;
  level: number;
}

interface UseProtectedRouteProps {
  privileges: UserPrivilege[];
  userId: string;
  screenId: string;
  requiredLevel: number;
}

const checkPrivilege = (
  privileges: UserPrivilege[],
  userId: string,
  screenId: string
): number => {
  const privilege = privileges.find(
    p => p.userId === userId && p.screenId === screenId
  );
  return privilege?.level || 3;
};

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
      router.push('/acesso-negado');
    }
  }, [privileges, userId, screenId, requiredLevel, router]);
};

export default useProtectedRoute;