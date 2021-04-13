const {parseEvents} = require('./doing')

describe('parseEvents', () => {
    it('parses event data from string', () => {
        const testData =`{
                "description": "debug jenkins build failure",
                "timestamp": "2021-04-13T01:13:55.064Z"
            }
            {
                "description": "Troubleshoot dependency issues",
                "timestamp": "2021-04-13T03:13:55.064Z"
            }
        `
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
});