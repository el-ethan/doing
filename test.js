const { parseEvents, limitEvents} = require('./doing')

describe('limitEvents', () => {
    it('returns all events if limit is 0', () => {
        const events = ['a', 'b']
        expect(limitEvents(events, 0)).toEqual(events)
    });

    it('returns all events if limit is greater than total events', () => {
        const events = ['a', 'b']
        expect(limitEvents(events, 5)).toEqual(events)
    });

    it('returns the last n events if limit of n is provided', () => {
        const events = ['a', 'b', 'c']
        expect(limitEvents(events, 2)).toEqual(['b', 'c'])
    });
});

describe('parseEvents', () => {
    it('parses event data from string', () => {
        const testData =`{"description": "debug jenkins build failure","timestamp": "2021-04-13T01:13:55.064Z"}
            {"description": "Troubleshoot dependency issues","timestamp": "2021-04-13T03:13:55.064Z"}`
        const expectedParsedEvents = [
            {
                description: 'debug jenkins build failure',
                timestamp: '2021-04-13T01:13:55.064Z'
            },
            {
                description: 'Troubleshoot dependency issues',
                timestamp: '2021-04-13T03:13:55.064Z'
            }
        ]
        expect(parseEvents(testData)).toEqual(expectedParsedEvents)
    });

    it('parses a single event correctly', () => {
        const testData =`{"description": "debug jenkins build failure","timestamp": "2021-04-13T01:13:55.064Z"}\n`
        const expectedParsedEvents = [
            {
                description: 'debug jenkins build failure',
                timestamp: '2021-04-13T01:13:55.064Z'
            }
        ]
        expect(parseEvents(testData)).toEqual(expectedParsedEvents)
    });
});