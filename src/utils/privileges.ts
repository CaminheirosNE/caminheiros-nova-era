import { UserPrivilege, PrivilegeLevel } from '../types';

export const checkPrivilege = (
  privileges: UserPrivilege[],
  userId: string,
  screenId: string
): number => {
  const privilege = privileges.find(
    p => p.userId === userId && p.screenId === screenId
  );
  return privilege?.level || PrivilegeLevel.NO_ACCESS;
};

export const hasAccess = (
  privileges: UserPrivilege[],
  userId: string,
  screenId: string,
  requiredLevel: number
): boolean => {
  const userLevel = checkPrivilege(privileges, userId, screenId);
  return userLevel <= requiredLevel; // Menor número = maior privilégio
};

export const isAdmin = (
  privileges: UserPrivilege[],
  userId: string
): boolean => {
  return privileges.some(p => p.userId === userId && p.level === PrivilegeLevel.ADMIN);
};

export const canEdit = (
  privileges: UserPrivilege[],
  userId: string,
  screenId: string
): boolean => {
  return hasAccess(privileges, userId, screenId, PrivilegeLevel.EDITOR);
};

export const canView = (
  privileges: UserPrivilege[],
  userId: string,
  screenId: string
): boolean => {
  return hasAccess(privileges, userId, screenId, PrivilegeLevel.VIEWER);
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

export default {
  checkPrivilege,
  hasAccess,
  isAdmin,
  canEdit,
  canView,
  getScreenPrivileges,
  getUserPrivileges
};
