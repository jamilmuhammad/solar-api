import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_TYPES_KEY } from "./role.decorator";
import { RoleType } from "./role.enum";
import { UserRoleEnum } from "src/modules/users/enums/user.role.enum.ts";

export abstract class BaseRoleGuard implements CanActivate {

    abstract isEmptyAuthorized: boolean;

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredUserTypes = this.reflector.get<RoleType[]>(ROLE_TYPES_KEY, context.getHandler());

        if (!requiredUserTypes) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        // If user is not logged in, then he is authorized
        if (!user && this.isEmptyAuthorized) {
            return true;
        }
        return false;

        // return requiredUserTypes.some((role) => {
        //     switch (role) {
        //         case RoleType.ADMIN:
        //             return user.role_member === UserRoleEnum.ADMIN;
        //         case RoleType.DRIVER:
        //             return user.role === UserRoleEnum.DRIVER;
        //         case RoleType.CUSTOMER:
        //             return user.role === UserRoleEnum.CUSTOMER;
        //         case RoleType.OWNER:
        //             return user.role === UserRoleEnum.OWNER;
        //         default:
        //             return false;
        //     }
        // });
    }
}

@Injectable()
export class RoleGuard extends BaseRoleGuard {
    isEmptyAuthorized: boolean = false;

    constructor(reflector: Reflector) {
        super(reflector);
    }
}

@Injectable()
export class OptionalRoleGuard extends BaseRoleGuard {
    isEmptyAuthorized: boolean = true;

    constructor(reflector: Reflector) {
        super(reflector);
    }
}