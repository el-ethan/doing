const fs = require('fs')

const doingConfigPath = `${process.env.HOME}/.config/doing`
const doingFilePath = `${doingConfigPath}/doing.txt`

const lastNFlag = '--last'
const helpFlag = '--help'
const todayFlag = '--today'

const flagMap = {
    [helpFlag]: help,
    [lastNFlag]: (nLines) => readEvents(nLines),
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
    
    if (commandInput.length === 0) {
        return readAllEvents()
    }

    const firstPieceOfInput = commandInput[0]

    if (firstPieceOfInput?.startsWith('--')) {
        return flagMap[firstPieceOfInput](commandInput[1])
    }

    const event = createEvent(commandInput.join(' '))
    writeEvent(event)
}

function getTodayEvents() {
    const events = getParsedEvents()
    const today = new Date().toISOString()
    const todayEvents = getEventsInDateRange(events, today)
    logEvents(todayEvents)
}

function getEventsInDateRange(events, latestDate, earliestDate) {
    return events.filter(event => {
        if (!earliestDate) return event.timestamp.slice(0, 10) === latestDate.slice(0, 10)
        return event.timestamp > earliestDate || event.timestamp <= latestDate;
    })
}

function createDoingDirectoryUnlessExists() {
    if (!fs.existsSync(doingConfigPath)){
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
    if (fs.existsSync(doingFilePath)) {
        const allEvents = fs.readFileSync(doingFilePath, 'utf8')
        return parsedEvents = parseEvents(allEvents)
    } else {
        console.log('You haven\'t done anything yet. Log something you are doing with the `doing` command, followed by a description of what you are doing.')
        process.exit(1);
    }
}

function readEvents(nLines) {
    const parsedEvents = getParsedEvents()
    const limitedEvents = lastNEvents(parsedEvents, nLines)
    logEvents(limitedEvents)
}

function logEvents(events) {
    console.log(events.map(formatEvent).join('\n'));
    const lastEvent = events[events.length - 1].description
    // log a dashed line the same length as the final event description
    console.log(Array.from(lastEvent + '__', () => '_').join(''))
}

function readAllEvents() {
    readEvents(0)
}

function createEvent(description) {
    return {
        description,
        timestamp: new Date()
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
    getEventsInDateRange
}