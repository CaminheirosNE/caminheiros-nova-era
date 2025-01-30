export interface UserPrivilege {
  userId: string;
  screenId: string;
  level: number;
}

export interface UserPrivilegeProps {
  privileges: UserPrivilege[];
  userId: string;
  screenId: string;
  requiredLevel: number;
}

export interface PrivilegeContextData {
  privileges: UserPrivilege[];
  addPrivilege: (privilege: UserPrivilege) => void;
  removePrivilege: (userId: string, screenId: string) => void;
  updatePrivilege: (privilege: UserPrivilege) => void;
}
