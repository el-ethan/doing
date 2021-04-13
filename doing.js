const fs = require('fs')

const doingConfigPath = `${process.env.HOME}/.config/doing`
const doingFilePath = `${doingConfigPath}/doing.txt`

function doing() {
    const [_a, _b, ...commandInput] = process.argv

    if (!fs.existsSync(doingConfigPath)){
        fs.mkdirSync(doingConfigPath);
    }

    const readMode = commandInput[0] === '-C' || commandInput.length === 0

    if (readMode) {
        const nLines = commandInput[1] || 0
        readEvents(nLines)
    } else {
        const event = createEvent(commandInput.join(' '))
        writeEvent(event)
    }
}

function writeEvent(event) {
    const eventString = `${JSON.stringify(event)}\n`
    fs.writeFileSync(doingFilePath, eventString, { flag: 'a' })
}

function limitEvents(events, limit) {
    const eventCount = events.length

    if (limit === 0 || limit >= eventCount) {
        return events
    }
    return events.splice(eventCount - limit)
}

function readEvents(nLines) {
    if (fs.existsSync(doingFilePath)) {
        const allEvents = fs.readFileSync(doingFilePath, 'utf8')
        const parsedEvents = parseEvents(allEvents)
        const limitedEvents = limitEvents(parsedEvents, nLines)
        console.log(limitedEvents.map(formatEvent).join('\n'));
    } else {
        console.log('You haven\'t done anything yet. Log something you are doing with `doing-now the thing you are doing`')
    }
}

function createEvent(description) {
    return {
        description,
        timestamp: new Date()
    }
}

function formatEvent(event) {
    return `\n\n# ${event.timestamp}\n\n${event.description}`
}

function parseEvents(eventsString) {
    const events = eventsString.split('\n').filter(Boolean).join(',')
    return JSON.parse(`[${events}]`)
}

module.exports = {
    parseEvents,
    limitEvents,
    doing
}