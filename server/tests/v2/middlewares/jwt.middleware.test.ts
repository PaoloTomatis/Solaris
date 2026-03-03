// Importazione moduli
import { describe, test, expect, vi } from 'vitest';
import { jwtVerify } from '../../../src/v2/middlewares/jwt.middleware.js';
import usersRepository from '../../../src/v2/repositories/users.repository.js';
import { Types, type HydratedDocument } from 'mongoose';
import { type UsersType } from '../../../src/v2/models/Users.model.js';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

// Test jwtVerify
describe('jwtVerify', () => {
    test('verify a token', async () => {
        vi.spyOn(usersRepository, 'findOneById').mockResolvedValue({
            _id: new Types.ObjectId('65e1a9f4c2b4d91f8a3b7c10'),
            email: 'prova@prova',
            psw: '123prova!',
            role: 'user',
            schemaVersion: 1,
            updatedAt: new Date('2026-03-01T06:30:00Z'),
            createdAt: new Date('2026-03-01T06:28:00Z'),
        } as unknown as HydratedDocument<UsersType>);

        (jwt.verify as any).mockReturnValue({ id: 'user123' });

        // Verifica token
        const result = await jwtVerify('provaAccessToken', 'user');

        expect(result).toBeDefined();
        expect(result.email).toBe('prova@prova');
    });
});
