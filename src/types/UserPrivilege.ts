// src/types/UserPrivilege.ts

export interface UserPrivilege {
  userId: string;
  accountId: string;
  privileges: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
