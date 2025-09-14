import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    email?: string | null;
    psw?: string | null;
    refreshToken?: string | null;
    createdAt?: string | null;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    email?: string | null;
    psw?: string | null;
    refreshToken?: string | null;
    createdAt?: string | null;
}, {}, mongoose.DefaultSchemaOptions> & {
    email?: string | null;
    psw?: string | null;
    refreshToken?: string | null;
    createdAt?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email?: string | null;
    psw?: string | null;
    refreshToken?: string | null;
    createdAt?: string | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email?: string | null;
    psw?: string | null;
    refreshToken?: string | null;
    createdAt?: string | null;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    email?: string | null;
    psw?: string | null;
    refreshToken?: string | null;
    createdAt?: string | null;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=User.model.d.ts.map