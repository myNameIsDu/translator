import { holderFinder } from '../utils';

describe('holderFiner', () => {
    test('替换占位符', () => {
        expect(holderFinder('#$%variable#$%hello')).toEqual({
            extra: {
                holder1: 'variable',
            },
            holder: '#$%holder1#$%hello',
        });
    });
    test('替换多个占位符', () => {
        expect(holderFinder('#$%variable1#$%hello#$%variable2#$hi')).toEqual({
            extra: {
                holder1: 'variable1',
                holder2: 'variable2',
            },
            holder: '#$%holder1#$%hello#$%holder2#$hi',
        });
    });
});
