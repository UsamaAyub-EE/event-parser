function parseEvents(objects) {
    const resultsArray = []

    objects.sort((a, b) => a.start - b.start)

    for (let i = 0; i < objects.length; i++) {
        let currentEvent = objects[i]
        let nextEvent = i + 1 < objects.length ? objects[i + 1] : null

        if (!nextEvent) {
            resultsArray.push(currentEvent)
            break
        }

        const resultEvent = { ...currentEvent }
        const breakEvent = { ...currentEvent }

        if (currentEvent.end > nextEvent.start && nextEvent.end < currentEvent.end) {
            breakEvent.start = nextEvent.end > currentEvent.end ? nextEvent.start : nextEvent.end + 1
            breakEvent.end = nextEvent.end > currentEvent.end ? nextEvent.end : currentEvent.end
            breakEvent['resume'] = true
            breakEvent['fakeStart'] = true

            objects.push(breakEvent)
            objects.sort((a, b) => a.start - b.start)
        }

        if (currentEvent.end > nextEvent.start) {
            if (nextEvent.resume) {
                nextEvent.start = resultEvent.end + 1
                objects.sort((a, b) => a.start - b.start)
            } else {
                resultEvent.end = nextEvent.start - 1
            }
        }

        if (nextEvent.end < currentEvent.end) {
            if (nextEvent.resume) {
                nextEvent.start = resultEvent.end + 1
                objects.sort((a, b) => a.start - b.start)
            } else {
                resultEvent.end = nextEvent.start - 1
            }
        }

        if (breakEvent.fakeStart) {
            resultEvent['fakeEnd'] = true
        }

        resultsArray.push(resultEvent)
    }

    return resultsArray
}

const originalArray = [
    { start: 1, end: 20, title: 'obj1' },
    { start: 5, end: 10, title: 'obj2' },
    { start: 7, end: 12, title: 'obj3' },
    { start: 9, end: 16, title: 'obj4' }
]

const resultsArray = parseEvents(originalArray)
console.log('resultsArray: ', resultsArray)