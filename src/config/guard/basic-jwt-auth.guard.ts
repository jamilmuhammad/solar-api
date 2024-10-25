import { AuthGuard } from "@nestjs/passport";

export class BasicOrJwtAuthGuard extends AuthGuard(['basic', 'jwt']) { }