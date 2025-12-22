import type { UserType, DeviceType } from '../utils/type.utils';

declare global {
    namespace Express {
        interface Request {
            user?: UserType;
            device?: DeviceType;
        }
    }
}
