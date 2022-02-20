const fs = require('fs')

const doingConfigPath = `${process.env.HOME}/.config/doing`
const doingFilePath = `${doingConfigPath}/doing.txt`

const lastNFlag = '--last'
const helpFlag = '--help'
const todayFlag = '--today'

/* 
    Filter functions take the events as the first argument,
    and the flag arguments as the second
*/
const flagMap = {
    [helpFlag]: help,
    [lastNFlag]: lastNEvents,
    [todayFlag]: getTodayEvents
}


function help() {
    console.log(`
Available options:

--help: log this help message.
--last n: log the last n events. If n is 0, log all events.
--today: log events captured today.
    `)
}

function doing() {
    createDoingDirectoryUnlessExists();
    


    const [_a, _b, ...commandInput] = process.argv
    
    const firstPieceOfInput = commandInput[0]

    if (firstPieceOfInput === helpFlag) {
        help()
        process.exit(0)
    }
    
    const parsedEvents = getParsedEvents()
    
    if (!firstPieceOfInput) {
        return logEvents(lastNEvents(parsedEvents, 0))
    }

    const hasCommandFlag = firstPieceOfInput?.startsWith('--')

    if (hasCommandFlag) {
        const filterFunction = flagMap[firstPieceOfInput]
        const filteredEvents = filterFunction(parsedEvents, commandInput[1])
        logEvents(filteredEvents || [])
    } else {
        const timestamp = new Date().toISOString()
        const event = createEvent(commandInput.join(' '), timestamp)
        writeEvent(event)
    }
}

function getTodayEvents(events) {
    const today = new Date().toISOString()
    return getEventsInDateRange(events, today)
}

function getEventsInDateRange(events, latestDate, earliestDate) {
    return events.filter(event => {
        if (!earliestDate) return event.timestamp.slice(0, 10) === latestDate.slice(0, 10)
        return event.timestamp >= earliestDate && event.timestamp <= latestDate;
    })
}

function createDoingDirectoryUnlessExists() {
    if (!fs.existsSync(doingConfigPath)) {
        fs.mkdirSync(doingConfigPath);
    }
}

function writeEvent(event) {
    const eventString = `${JSON.stringify(event)}\n`
    fs.writeFileSync(doingFilePath, eventString, { flag: 'a' })
}

function lastNEvents(events, lastN) {
    const eventCount = events.length
    if (lastN === undefined) return []
    if (lastN >= eventCount || lastN === 0) return events

    return events.splice(eventCount - lastN)
}

function getParsedEvents() {
    if (!fs.existsSync(doingFilePath)) {
        return []
    }
    const allEvents = fs.readFileSync(doingFilePath, 'utf8')
    return parseEvents(allEvents)
}

function logEvents(events) {
    if (!events.length) {
        console.log('You haven\'t done anything yet. Capture something you are doing with the `doing` command, followed by a description of what you are doing.')
        process.exit(0);
    }
    console.log(events.map(formatEvent).join('\n'));
    const lastEvent = events[events.length - 1].description
    // log a dashed line the same length as the final event description
    console.log(Array.from(lastEvent + '__', () => '_').join(''))
}

function createEvent(description, timestamp) {
    return {
        description,
        timestamp
    }
}

function formatEvent(event) {
    return `\n\n# ${event.timestamp}\n\n• ${event.description}`
}

function parseEvents(eventsString) {
    const events = eventsString.split('\n').filter(Boolean).join(',')
    return JSON.parse(`[${events}]`)
}

module.exports = {
    parseEvents,
    lastNEvents,
    formatEvent,
    doing,
    getEventsInDateRange,
    help,
    flagMap,
    getTodayEvents,
    createEvent
}