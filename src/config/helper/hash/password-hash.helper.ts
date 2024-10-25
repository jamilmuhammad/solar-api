import * as bcrypt from 'bcryptjs';

export class PasswordHashHelper {

    static async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    static comparePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }
}
