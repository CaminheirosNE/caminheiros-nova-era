import { UserPrivilege } from '../types';

export const checkPrivilege = (
  privileges: UserPrivilege[],
  userId: string,
  screenId: string
): number => {
  const privilege = privileges.find(
    p => p.userId === userId && p.screenId === screenId
  );
  return privilege?.level || 3; // Default to view access (level 3)
};

export const hasAccess = (
  privileges: UserPrivilege[],
  userId: string,
  screenId: string,
  requiredLevel: number
): boolean => {
  const userLevel = checkPrivilege(privileges, userId, screenId);
  return userLevel >= requiredLevel;
};

export const isAdmin = (
  privileges: UserPrivilege[],
  userId: string
): boolean => {
  return privileges.some(p => p.userId === userId && p.level === 1);
};

export const canEdit = (
  privileges: UserPrivilege[],
  userId: string,
  screenId: string
): boolean => {
  return hasAccess(privileges, userId, screenId, 4);
};

export const canView = (
  privileges: UserPrivilege[],
  userId: string,
  screenId: string
): boolean => {
  return hasAccess(privileges, userId, screenId, 3);
};

export const getScreenPrivileges = (
  privileges: UserPrivilege[],
  screenId: string
): UserPrivilege[] => {
  return privileges.filter(p => p.screenId === screenId);
};

export const getUserPrivileges = (
  privileges: UserPrivilege[],
  userId: string
): UserPrivilege[] => {
  return privileges.filter(p => p.userId === userId);
};

export const updatePrivilege = (
  privileges: UserPrivilege[],
  userId: string,
  screenId: string,
  newLevel: 1 | 2 | 3 | 4
): UserPrivilege[] => {
  const index = privileges.findIndex(
    p => p.userId === userId && p.screenId === screenId
  );

  if (index === -1) {
    return [...privileges, { userId, screenId, level: newLevel }];
  }

  return [
    ...privileges.slice(0, index),
    { ...privileges[index], level: newLevel },
    ...privileges.slice(index + 1)
  ];
};
