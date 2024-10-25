import { SetMetadata } from "@nestjs/common";
import { RoleType } from "./role.enum";

export const ROLE_TYPES_KEY = 'role-types';
export const RoleTypes = (...adminTypes: RoleType[]) => SetMetadata(ROLE_TYPES_KEY, adminTypes);