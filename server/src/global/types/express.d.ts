import type { UserType, DeviceType } from '../../global/utils/type.utils';

declare global {
    namespace Express {
        interface Request {
            user?: UserType;
            device?: DeviceType;
        }
    }
}
