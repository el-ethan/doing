const fs = require('fs')

function doing() {
    const [_a, _b, ...commandInput] = process.argv

    const doingConfigPath = `${process.env.HOME}/.config/doing`
    const doingFilePath = `${doingConfigPath}/doing.md`

    if (!fs.existsSync(doingConfigPath)){
        fs.mkdirSync(doingConfigPath);
    }

    let nLines = 3
    let whatImDoing = ''

    if (commandInput[0] === '-C') {
        nLines = commandInput[1]
    } else {
        whatImDoing = commandInput.join(' ')
    }

    const timestamp = `\n\n***** ${new Date()} *****\n\n`

    if (whatImDoing.length) {
        fs.writeFileSync(doingFilePath, `${timestamp}${whatImDoing}`, { flag: 'a' })
    } else if (fs.existsSync(doingFilePath)) {
        const whatIDid = fs.readFileSync(doingFilePath, 'utf8').split('\n')
        console.log(whatIDid.splice(whatIDid.length - nLines).join('\n'));
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
    return JSON.parse(`[${eventsString.replace('}\n', '},\n')}]`)
}

module.exports = {
    parseEvents,
    doing
}