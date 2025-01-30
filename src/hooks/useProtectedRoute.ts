import { useRouter } from 'next/navigation';
import { checkPrivilege } from '@/utils/privileges';
import type { UserPrivilege } from '@/types/UserPrivilege';

interface UseProtectedRouteProps {
  privilegios: UserPrivilege[];
}

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Definindo tipos localmente para evitar problemas de importação
type PrivilegeLevel = 1 | 2 | 3 | 4;

interface UserPrivilege {
  userId: string;
  screenId: string;
  level: PrivilegeLevel;
}

interface UseProtectedRouteProps {
  privileges: UserPrivilege[];
  userId: string;
  screenId: string;
  requiredLevel: PrivilegeLevel;
}

const DEFAULT_ACCESS_LEVEL: PrivilegeLevel = 4; // Nível mais restritivo

const checkPrivilege = (
  privileges: UserPrivilege[],
  userId: string,
  screenId: string
): PrivilegeLevel => {
  try {
    const privilege = privileges.find(
      p => p.userId === userId && p.screenId === screenId
    );
    return privilege?.level || DEFAULT_ACCESS_LEVEL;
  } catch (error) {
    console.error('Erro ao verificar privilégios:', error);
    return DEFAULT_ACCESS_LEVEL;
  }
};

export const useProtectedRoute = ({
  privileges,
  userId,
  screenId,
  requiredLevel
}: UseProtectedRouteProps): void => {
  const router = useRouter();

  useEffect(() => {
    try {
      const userLevel = checkPrivilege(privileges, userId, screenId);
      
      if (userLevel > requiredLevel) {
        router.push('/acesso-negado');
      }
    } catch (error) {
      console.error('Erro no useProtectedRoute:', error);
      router.push('/erro');
    }
  }, [privileges, userId, screenId, requiredLevel, router]);
};

export default useProtectedRoute;