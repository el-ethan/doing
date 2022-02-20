const { parseEvents, lastNEvents, formatEvent, getEventsInDateRange } = require('./doing')

describe('lastNEvents', () => {
    it('returns no events if limit undefined', () => {
        const events = ['a', 'b']
        expect(lastNEvents(events)).toEqual([])
    });

    it('returns all events if limit is greater than total events', () => {
        const events = ['a', 'b']
        expect(lastNEvents(events, 5)).toEqual(events)
    });

    it('returns the last n events if limit of n is provided', () => {
        const events = ['a', 'b', 'c']
        expect(lastNEvents(events, 2)).toEqual(['b', 'c'])
    });

    it('returns all events if n is equal to total events', () => {
        const events = ['a', 'b', 'c']
        expect(lastNEvents(events, 3)).toEqual(['a', 'b', 'c'])
    });

    it('returns all events if n is 0', () => {
        const events = ['a', 'b', 'c']
        expect(lastNEvents(events, 0)).toEqual(['a', 'b', 'c'])
    });
});


describe('getEventsInDateRange', () => {
    it('returns events for start date if only start date passed', () => {
        const events = [
            {
                description: 'stop the DaVinci virus',
                timestamp: '2021-04-12T01:13:55.064Z'
            },
            {
                description: 'hack the planet',
                timestamp: '2021-04-13T01:13:55.064Z'
            }
        ]

        const expectedFilteredEvents = [
            {
                description: 'hack the planet',
                timestamp: '2021-04-13T01:13:55.064Z'
            }
        ]

        expect(getEventsInDateRange(events, '2021-04-13T01:13:55.064Z')).toEqual(expectedFilteredEvents)
    });

    it('returns events for range if start and end date passed', () => {
        const events = [
            {
                description: 'stop the DaVinci virus',
                timestamp: '2021-04-12T01:13:55.064Z'
            },
            {
                description: 'hack the planet',
                timestamp: '2021-04-13T01:13:55.064Z'
            }
        ]

        expect(getEventsInDateRange(events, '2021-04-13T01:13:55.064Z', '2021-04-12T01:13:55.064Z')).toEqual(events)
    });

    it('returns events for range if start and end date passed', () => {
        const events = [
            {
                description: 'stop the DaVinci virus',
                timestamp: '2021-04-12T01:13:55.064Z'
            },
            {
                description: 'hack the planet',
                timestamp: '2021-04-13T01:13:55.064Z'
            }
        ]

        expect(getEventsInDateRange(events, '2021-04-13T01:13:55.064Z', '2021-04-12T01:13:55.064Z')).toEqual(events)
    });

    it('does not include events earlier than earliest date', () => {
        const events = [
            {
                description: 'contact Razor and Blade at the weird club',
                timestamp: '2021-04-12T01:13:55.063Z'
            },
            {
                description: 'stop the DaVinci virus',
                timestamp: '2021-04-12T01:13:55.064Z'
            },
            {
                description: 'hack the planet',
                timestamp: '2021-04-13T01:13:55.064Z'
            }
        ]

        const expectedEvents = [
            {
                description: 'stop the DaVinci virus',
                timestamp: '2021-04-12T01:13:55.064Z'
            },
            {
                description: 'hack the planet',
                timestamp: '2021-04-13T01:13:55.064Z'
            }
        ]
        expect(getEventsInDateRange(events, '2021-04-13T01:13:55.064Z', '2021-04-12T01:13:55.064Z')).toEqual(expectedEvents)
    });

    it('does not include events later than latest date', () => {
        const events = [
            {
                description: 'stop the DaVinci virus',
                timestamp: '2021-04-12T01:13:55.064Z'
            },
            {
                description: 'hack the planet',
                timestamp: '2021-04-13T01:13:55.064Z'
            },
            {
                description: 'contact Razor and Blade at the weird club',
                timestamp: '2021-04-13T01:13:55.065Z'
            },
        ]

        const expectedEvents = [
            {
                description: 'stop the DaVinci virus',
                timestamp: '2021-04-12T01:13:55.064Z'
            },
            {
                description: 'hack the planet',
                timestamp: '2021-04-13T01:13:55.064Z'
            }
        ]
        expect(getEventsInDateRange(events, '2021-04-13T01:13:55.064Z', '2021-04-12T01:13:55.064Z')).toEqual(expectedEvents)
    })
});

describe('parseEvents', () => {
    it('parses event data from string', () => {
        const testData = `{"description": "debug jenkins build failure","timestamp": "2021-04-13T01:13:55.064Z"}
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
        const testData = `{"description": "debug jenkins build failure","timestamp": "2021-04-13T01:13:55.064Z"}\n`
        const expectedParsedEvents = [
            {
                description: 'debug jenkins build failure',
                timestamp: '2021-04-13T01:13:55.064Z'
            }
        ]
        expect(parseEvents(testData)).toEqual(expectedParsedEvents)
    });
});

describe('formatEvent', () => {
    it('returns event with the expected format', () => {
        expect(
            formatEvent({
                description: 'debug jenkins build failure',
                timestamp: '2021-04-13T01:13:55.064Z'
            })
        ).toEqual('\n\n# 2021-04-13T01:13:55.064Z\n\n• debug jenkins build failure')
    });
});

