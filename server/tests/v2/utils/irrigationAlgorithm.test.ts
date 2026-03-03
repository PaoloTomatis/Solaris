// Importazione moduli
import {
    calcTot,
    calcWeight,
    filterHumData,
    filterIntervalData,
    algorithmUpdateKInterval,
    algorithmHumX,
    algorithmInterval,
} from '../../../src/v2/utils/irrigationAlgorithm.js';
import { describe, test, expect } from 'vitest';
import { Types } from 'mongoose';
import type { IrrigationsType } from '../../../src/v2/models/Irrigations.model.js';

// Test calcTot
describe('calcTot', () => {
    test('computes the total of an array of values', () => {
        expect(calcTot([1, 2, 3, 4, 0])).toBe(10);
        expect(calcTot([0.1, 2.1, 3.6, 1.1, 1.2])).toBeCloseTo(8.1);
    });

    test('returns 0 if nothing is passed', () => {
        expect(calcTot([])).toBe(0);
    });

    test('returns negative numbers if the result is negative', () => {
        expect(calcTot([-1, -2, -3])).toBe(-6);
    });
});

// Test calcWeight
describe('calcWeight', () => {
    test('computes the weight of a value based on its position from the center', () => {
        expect(calcWeight(5, 5)).toBe(6);
        expect(calcWeight(6, 12)).toBe(1);
        expect(calcWeight(6, 100)).toBe(0);
    });

    test('raises and error if negative numbers are passed', () => {
        expect(() => calcWeight(5, -5)).toThrow();
        expect(() => calcWeight(-7, 4)).toThrow();
        expect(() => calcWeight(0, 0)).toThrow();
    });
});

// Test filterHumData
describe('filterHumData', () => {
    test('filters raw data', () => {
        // Dichiarazione lista irrigazioni 1
        const irrigations1: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 24.5,
                lum: 560,
                humE: 41,
                humIBefore: 32,
                humIAfter: 48,
                interval: 120,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T06:30:00Z'),
                updatedAt: new Date('2026-03-01T06:32:00Z'),
                createdAt: new Date('2026-03-01T06:30:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 27.1,
                lum: 890,
                humE: 35,
                humIBefore: 28,
                humIAfter: 44,
                interval: 180,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T12:15:00Z'),
                updatedAt: new Date('2026-03-01T12:18:00Z'),
                createdAt: new Date('2026-03-01T12:15:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 21.8,
                lum: 300,
                humE: 52,
                humIBefore: 40,
                humIAfter: 55,
                interval: 90,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T07:00:00Z'),
                updatedAt: new Date('2026-03-02T07:01:30Z'),
                createdAt: new Date('2026-03-02T07:00:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 29.3,
                lum: 1020,
                humE: 33,
                humIBefore: 25,
                humIAfter: 42,
                interval: 240,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T14:40:00Z'),
                updatedAt: new Date('2026-03-02T14:44:00Z'),
                createdAt: new Date('2026-03-02T14:40:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 23.4,
                lum: 610,
                humE: 45,
                humIBefore: 36,
                humIAfter: 50,
                interval: 150,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T08:10:00Z'),
                updatedAt: new Date('2026-03-03T08:12:30Z'),
                createdAt: new Date('2026-03-03T08:10:00Z'),
            },
        ];

        // Dichiarazione lista irrigazioni 2
        const irrigations2: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 26.7,
                lum: 750,
                humE: 38,
                humIBefore: 30,
                humIAfter: 46,
                interval: 200,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T13:25:00Z'),
                updatedAt: new Date('2026-03-03T13:28:20Z'),
                createdAt: new Date('2026-03-03T13:25:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 22.0,
                lum: 410,
                humE: 50,
                humIBefore: 42,
                humIAfter: 58,
                interval: 100,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-04T06:50:00Z'),
                updatedAt: new Date('2026-03-04T06:51:40Z'),
                createdAt: new Date('2026-03-04T06:50:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 30.2,
                lum: 1100,
                humE: 29,
                humIBefore: 22,
                humIAfter: 40,
                interval: 300,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-04T15:05:00Z'),
                updatedAt: new Date('2026-03-04T15:10:00Z'),
                createdAt: new Date('2026-03-04T15:05:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 25.6,
                lum: 680,
                humE: 39,
                humIBefore: 31,
                humIAfter: 47,
                interval: 160,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-05T09:30:00Z'),
                updatedAt: new Date('2026-03-05T09:33:00Z'),
                createdAt: new Date('2026-03-05T09:30:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 20.9,
                lum: 290,
                humE: 55,
                humIBefore: 44,
                humIAfter: 60,
                interval: 80,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-05T07:10:00Z'),
                updatedAt: new Date('2026-03-05T07:11:10Z'),
                createdAt: new Date('2026-03-05T07:10:00Z'),
            },
        ];

        expect(filterHumData(irrigations1)).toMatchObject([
            { humI: [32, 48] },
            { humI: [28, 44] },
            { humI: [40, 55] },
            { humI: [25, 42] },
            { humI: [36, 50] },
        ]);
        expect(filterHumData(irrigations2)).toMatchObject([
            { humI: [30, 46] },
            { humI: [42, 58] },
            { humI: [22, 40] },
            { humI: [31, 47] },
            { humI: [44, 60] },
        ]);
    });

    test("doesn't count wrong irrigations", () => {
        // Dichiarazione lista irrigazioni 1
        const irrigations1: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 24.5,
                lum: 560,
                humE: 41,
                humIBefore: 48,
                humIAfter: 32,
                interval: 120,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T06:30:00Z'),
                updatedAt: new Date('2026-03-01T06:32:00Z'),
                createdAt: new Date('2026-03-01T06:30:00Z'),
            },
        ];

        // Dichiarazione lista irrigazioni 2
        const irrigations2: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 26.7,
                lum: 750,
                humE: 38,
                humIBefore: 30,
                humIAfter: 30,
                interval: 200,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T13:25:00Z'),
                updatedAt: new Date('2026-03-03T13:28:20Z'),
                createdAt: new Date('2026-03-03T13:25:00Z'),
            },
        ];

        expect(filterHumData(irrigations1)).toEqual([]);
        expect(filterHumData(irrigations2)).toEqual([]);
    });

    test('filters nothing if nothing is passed', () => {
        // Dichiarazione lista irrigazioni
        const irrigations: IrrigationsType[] = [];

        expect(filterHumData(irrigations)).toEqual([]);
    });
});

// Test filterIntervalData
describe('filterIntervalData', () => {
    test('filters raw data', () => {
        // Dichiarazione lista irrigazioni 1
        const irrigations1: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 24.5,
                lum: 560,
                humE: 41,
                humIBefore: 32,
                humIAfter: 48,
                interval: 120,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T06:30:00Z'),
                updatedAt: new Date('2026-03-01T06:32:00Z'),
                createdAt: new Date('2026-03-01T06:30:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 27.1,
                lum: 890,
                humE: 35,
                humIBefore: 28,
                humIAfter: 44,
                interval: 180,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T12:15:00Z'),
                updatedAt: new Date('2026-03-01T12:18:00Z'),
                createdAt: new Date('2026-03-01T12:15:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 21.8,
                lum: 300,
                humE: 52,
                humIBefore: 40,
                humIAfter: 55,
                interval: 90,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T07:00:00Z'),
                updatedAt: new Date('2026-03-02T07:01:30Z'),
                createdAt: new Date('2026-03-02T07:00:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 29.3,
                lum: 1020,
                humE: 33,
                humIBefore: 25,
                humIAfter: 42,
                interval: 240,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T14:40:00Z'),
                updatedAt: new Date('2026-03-02T14:44:00Z'),
                createdAt: new Date('2026-03-02T14:40:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 23.4,
                lum: 610,
                humE: 45,
                humIBefore: 36,
                humIAfter: 50,
                interval: 150,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T08:10:00Z'),
                updatedAt: new Date('2026-03-03T08:12:30Z'),
                createdAt: new Date('2026-03-03T08:10:00Z'),
            },
        ];

        // Dichiarazione lista irrigazioni 2
        const irrigations2: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 26.7,
                lum: 750,
                humE: 38,
                humIBefore: 30,
                humIAfter: 46,
                interval: 200,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T13:25:00Z'),
                updatedAt: new Date('2026-03-03T13:28:20Z'),
                createdAt: new Date('2026-03-03T13:25:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 22.0,
                lum: 410,
                humE: 50,
                humIBefore: 42,
                humIAfter: 58,
                interval: 100,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-04T06:50:00Z'),
                updatedAt: new Date('2026-03-04T06:51:40Z'),
                createdAt: new Date('2026-03-04T06:50:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 30.2,
                lum: 1100,
                humE: 29,
                humIBefore: 22,
                humIAfter: 40,
                interval: 300,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-04T15:05:00Z'),
                updatedAt: new Date('2026-03-04T15:10:00Z'),
                createdAt: new Date('2026-03-04T15:05:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 25.6,
                lum: 680,
                humE: 39,
                humIBefore: 31,
                humIAfter: 47,
                interval: 160,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-05T09:30:00Z'),
                updatedAt: new Date('2026-03-05T09:33:00Z'),
                createdAt: new Date('2026-03-05T09:30:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 20.9,
                lum: 290,
                humE: 55,
                humIBefore: 44,
                humIAfter: 60,
                interval: 80,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-05T07:10:00Z'),
                updatedAt: new Date('2026-03-05T07:11:10Z'),
                createdAt: new Date('2026-03-05T07:10:00Z'),
            },
        ];

        expect(filterIntervalData(irrigations1)).toMatchObject([
            { humI: [32, 48], interval: 120 },
            { humI: [28, 44], interval: 180 },
            { humI: [40, 55], interval: 90 },
            { humI: [25, 42], interval: 240 },
            { humI: [36, 50], interval: 150 },
        ]);
        expect(filterIntervalData(irrigations2)).toMatchObject([
            { humI: [30, 46], interval: 200 },
            { humI: [42, 58], interval: 100 },
            { humI: [22, 40], interval: 300 },
            { humI: [31, 47], interval: 160 },
            { humI: [44, 60], interval: 80 },
        ]);
    });

    test("doesn't count wrong irrigations", () => {
        // Dichiarazione lista irrigazioni 1
        const irrigations1: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 24.5,
                lum: 560,
                humE: 41,
                humIBefore: 48,
                humIAfter: 32,
                interval: NaN,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T06:30:00Z'),
                updatedAt: new Date('2026-03-01T06:32:00Z'),
                createdAt: new Date('2026-03-01T06:30:00Z'),
            },
        ];

        // Dichiarazione lista irrigazioni 2
        const irrigations2: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 26.7,
                lum: 750,
                humE: 38,
                humIBefore: 30,
                humIAfter: 30,
                interval: 0,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T13:25:00Z'),
                updatedAt: new Date('2026-03-03T13:28:20Z'),
                createdAt: new Date('2026-03-03T13:25:00Z'),
            },
        ];

        expect(filterIntervalData(irrigations1)).toEqual([]);
        expect(filterIntervalData(irrigations2)).toEqual([]);
    });

    test('filters nothing if nothing is passed', () => {
        // Dichiarazione lista irrigazioni
        const irrigations: IrrigationsType[] = [];

        expect(filterIntervalData(irrigations)).toEqual([]);
    });
});

// Test algorithmUpdateKInterval
describe('algorithmUpdateKInterval', () => {
    test('computes the update of the kInterval', () => {
        expect(algorithmUpdateKInterval(32, 48, 52, 2.3)).toBeCloseTo(2.32);
        expect(algorithmUpdateKInterval(35, 67, 54, 1.7)).toBeCloseTo(1.64);
    });

    test('computes the update of the kInterval in the correct range (90%-110%)', () => {
        expect(algorithmUpdateKInterval(32, 48, 90, 2.3)).toBeCloseTo(2.38);
        expect(algorithmUpdateKInterval(35, 67, 36, 0)).toBeCloseTo(0);
    });

    test('returns an error if invalid values are passed', () => {
        expect(() => algorithmUpdateKInterval(-32, 48, 90, 1.7)).toThrow();
        expect(() => algorithmUpdateKInterval(32, 48, -90, 1.7)).toThrow();
    });
});

// Test algorithmHumX
describe('algorithmHumX', () => {
    test('computes humIMax and humIMin', () => {
        // Dichiarazione lista irrigazioni 1
        const irrigations: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 24.5,
                lum: 560,
                humE: 41,
                humIBefore: 32,
                humIAfter: 48,
                interval: 120,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T06:30:00Z'),
                updatedAt: new Date('2026-03-01T06:32:00Z'),
                createdAt: new Date('2026-03-01T06:30:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 27.1,
                lum: 890,
                humE: 35,
                humIBefore: 28,
                humIAfter: 44,
                interval: 180,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T12:15:00Z'),
                updatedAt: new Date('2026-03-01T12:18:00Z'),
                createdAt: new Date('2026-03-01T12:15:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 21.8,
                lum: 300,
                humE: 52,
                humIBefore: 40,
                humIAfter: 55,
                interval: 90,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T07:00:00Z'),
                updatedAt: new Date('2026-03-02T07:01:30Z'),
                createdAt: new Date('2026-03-02T07:00:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 29.3,
                lum: 1020,
                humE: 33,
                humIBefore: 25,
                humIAfter: 42,
                interval: 240,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T14:40:00Z'),
                updatedAt: new Date('2026-03-02T14:44:00Z'),
                createdAt: new Date('2026-03-02T14:40:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 23.4,
                lum: 610,
                humE: 45,
                humIBefore: 36,
                humIAfter: 50,
                interval: 150,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T08:10:00Z'),
                updatedAt: new Date('2026-03-03T08:12:30Z'),
                createdAt: new Date('2026-03-03T08:10:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 24.5,
                lum: 560,
                humE: 41,
                humIBefore: 32,
                humIAfter: 48,
                interval: 120,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T06:30:00Z'),
                updatedAt: new Date('2026-03-01T06:32:00Z'),
                createdAt: new Date('2026-03-01T06:30:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 27.1,
                lum: 890,
                humE: 35,
                humIBefore: 28,
                humIAfter: 44,
                interval: 180,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T12:15:00Z'),
                updatedAt: new Date('2026-03-01T12:18:00Z'),
                createdAt: new Date('2026-03-01T12:15:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 21.8,
                lum: 300,
                humE: 52,
                humIBefore: 40,
                humIAfter: 55,
                interval: 90,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T07:00:00Z'),
                updatedAt: new Date('2026-03-02T07:01:30Z'),
                createdAt: new Date('2026-03-02T07:00:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 29.3,
                lum: 1020,
                humE: 33,
                humIBefore: 25,
                humIAfter: 42,
                interval: 240,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T14:40:00Z'),
                updatedAt: new Date('2026-03-02T14:44:00Z'),
                createdAt: new Date('2026-03-02T14:40:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 23.4,
                lum: 610,
                humE: 45,
                humIBefore: 36,
                humIAfter: 50,
                interval: 150,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T08:10:00Z'),
                updatedAt: new Date('2026-03-03T08:12:30Z'),
                createdAt: new Date('2026-03-03T08:10:00Z'),
            },
        ];

        expect(algorithmHumX(irrigations, 0)).toBeCloseTo(32.1);
        expect(algorithmHumX(irrigations, 1)).toBeCloseTo(47.63);
    });

    test('raises an error if irrigations are less than 10', () => {
        // Dichiarazione lista irrigazioni 1
        const irrigations: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 23.4,
                lum: 610,
                humE: 45,
                humIBefore: 36,
                humIAfter: 50,
                interval: 150,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T08:10:00Z'),
                updatedAt: new Date('2026-03-03T08:12:30Z'),
                createdAt: new Date('2026-03-03T08:10:00Z'),
            },
        ];

        expect(() => algorithmHumX(irrigations, 0)).toThrow();
    });
});

// Test algorithmInterval
describe('algorithmInterval', () => {
    test('computes kInterval', () => {
        // Dichiarazione lista irrigazioni 1
        const irrigations: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 24.5,
                lum: 560,
                humE: 41,
                humIBefore: 32,
                humIAfter: 48,
                interval: 120,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T06:30:00Z'),
                updatedAt: new Date('2026-03-01T06:32:00Z'),
                createdAt: new Date('2026-03-01T06:30:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 27.1,
                lum: 890,
                humE: 35,
                humIBefore: 28,
                humIAfter: 44,
                interval: 180,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T12:15:00Z'),
                updatedAt: new Date('2026-03-01T12:18:00Z'),
                createdAt: new Date('2026-03-01T12:15:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 21.8,
                lum: 300,
                humE: 52,
                humIBefore: 40,
                humIAfter: 55,
                interval: 90,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T07:00:00Z'),
                updatedAt: new Date('2026-03-02T07:01:30Z'),
                createdAt: new Date('2026-03-02T07:00:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 29.3,
                lum: 1020,
                humE: 33,
                humIBefore: 25,
                humIAfter: 42,
                interval: 240,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T14:40:00Z'),
                updatedAt: new Date('2026-03-02T14:44:00Z'),
                createdAt: new Date('2026-03-02T14:40:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 23.4,
                lum: 610,
                humE: 45,
                humIBefore: 36,
                humIAfter: 50,
                interval: 150,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T08:10:00Z'),
                updatedAt: new Date('2026-03-03T08:12:30Z'),
                createdAt: new Date('2026-03-03T08:10:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 24.5,
                lum: 560,
                humE: 41,
                humIBefore: 32,
                humIAfter: 48,
                interval: 120,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T06:30:00Z'),
                updatedAt: new Date('2026-03-01T06:32:00Z'),
                createdAt: new Date('2026-03-01T06:30:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 27.1,
                lum: 890,
                humE: 35,
                humIBefore: 28,
                humIAfter: 44,
                interval: 180,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-01T12:15:00Z'),
                updatedAt: new Date('2026-03-01T12:18:00Z'),
                createdAt: new Date('2026-03-01T12:15:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 21.8,
                lum: 300,
                humE: 52,
                humIBefore: 40,
                humIAfter: 55,
                interval: 90,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T07:00:00Z'),
                updatedAt: new Date('2026-03-02T07:01:30Z'),
                createdAt: new Date('2026-03-02T07:00:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 29.3,
                lum: 1020,
                humE: 33,
                humIBefore: 25,
                humIAfter: 42,
                interval: 240,
                type: 'auto',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-02T14:40:00Z'),
                updatedAt: new Date('2026-03-02T14:44:00Z'),
                createdAt: new Date('2026-03-02T14:40:00Z'),
            },
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 23.4,
                lum: 610,
                humE: 45,
                humIBefore: 36,
                humIAfter: 50,
                interval: 150,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T08:10:00Z'),
                updatedAt: new Date('2026-03-03T08:12:30Z'),
                createdAt: new Date('2026-03-03T08:10:00Z'),
            },
        ];

        expect(algorithmInterval(irrigations)).toBeCloseTo(10);
    });

    test('raises an error if irrigations are less than 10', () => {
        // Dichiarazione lista irrigazioni 1
        const irrigations: IrrigationsType[] = [
            {
                _id: new Types.ObjectId(),
                deviceId: new Types.ObjectId(),
                temp: 23.4,
                lum: 610,
                humE: 45,
                humIBefore: 36,
                humIAfter: 50,
                interval: 150,
                type: 'config',
                schemaVersion: 1,
                irrigatedAt: new Date('2026-03-03T08:10:00Z'),
                updatedAt: new Date('2026-03-03T08:12:30Z'),
                createdAt: new Date('2026-03-03T08:10:00Z'),
            },
        ];

        expect(() => algorithmInterval(irrigations)).toThrow();
    });
});
