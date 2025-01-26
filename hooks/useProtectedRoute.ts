import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkPrivilege } from '../utils/privileges';
import { UserPrivilege } from '../types';

export const useProtectedRoute = (
  screenId: string,
  requiredLevel: number = 3
): void => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const privileges: UserPrivilege[] = JSON.parse(
        localStorage.getItem('privileges') || '[]'
      );

      const userLevel = checkPrivilege(privileges, userId, screenId);

      if (userLevel < requiredLevel) {
        navigate('/unauthorized');
      }
    };

    checkAccess();
  }, [screenId, requiredLevel, navigate]);
};

export default useProtectedRoute;