const DATE_FORMAT_ISO = 'YYYY-MM-DD'

const addDaysToDate = (date, days = 1) => (date ? moment(date).add(days, 'days').format(DATE_FORMAT_ISO) : null)

const subtractDaysFromDate = (date, days = 1) =>
    date ? moment(date).subtract(days, 'days').format(DATE_FORMAT_ISO) : null

const getCorrectedEvents = (events) => {
    const leaveEvents = []
    const shiftEvents = []

    events.forEach((obj) => {
        if (!obj.eventable_type) {
            shiftEvents.push(obj)
        } else {
            leaveEvents.push(obj)
        }
    })

    const groupedShifts = {}

    events.forEach((event) => {
        if (!groupedShifts[event.start]) {
            groupedShifts[event.start] = []
        }
        groupedShifts[event.start].push(event)
    })

    const groupedShiftObjects = []
    let shiftIndex = 0

    for (const startDate in groupedShifts) {
        const group = groupedShifts[startDate]
        let selectedEvent

        const activeShift = group.find((shift) => shift.active)
        if (activeShift) {
            selectedEvent = activeShift
        } else {
            selectedEvent = group.find((shift) => !!shift.end)
            if (!selectedEvent) {
                selectedEvent = group.at(-1)
            }
        }

        // const color = calendarShiftColors[shiftIndex++ % calendarShiftColors.length]
        // setShiftColors((prevState) => ({
        //     ...prevState,
        //     [selectedEvent.title]: color
        // }))

        groupedShiftObjects.push(selectedEvent)
    }

    const correctedShiftEvents = []

    for (let i = 0; i < groupedShiftObjects.length; i++) {
        let currentEvent = groupedShiftObjects[i]
        let nextEvent = i + 1 < groupedShiftObjects.length ? groupedShiftObjects[i + 1] : null

        if (!nextEvent) {
            correctedShiftEvents.push(currentEvent)
            break
        }

        const resultEvent = { ...currentEvent }
        const breakEvent = { ...currentEvent }
        const currentEventEnd = moment(currentEvent.end)
        const nextEventStart = moment(nextEvent.start)
        const nextEventEnd = moment(nextEvent.end)

        if (
            (!currentEvent.end || currentEventEnd.isAfter(nextEventStart)) &&
            (!currentEvent.end || nextEventEnd.isBefore(currentEventEnd))
        ) {
            breakEvent.start =
                !nextEvent.end || nextEventEnd.isAfter(currentEventEnd) ? nextEvent.start : addDaysToDate(nextEvent.end)
            breakEvent.end = !nextEvent.end || nextEventEnd.isAfter(currentEventEnd) ? nextEvent.end : currentEvent.end
            breakEvent['resume'] = true
            breakEvent['fakeStart'] = true

            if (nextEvent.end) {
                groupedShiftObjects.push(breakEvent)
                groupedShiftObjects.sort((a, b) => moment(a.start).diff(moment(b.start)))
            }
        }

        if (
            !currentEvent.end ||
            currentEventEnd.isAfter(nextEventStart) ||
            !nextEvent.end ||
            nextEventEnd.isBefore(currentEventEnd)
        ) {
            if (nextEvent.resume) {
                nextEvent.start = addDaysToDate(resultEvent.end)
                groupedShiftObjects.sort((a, b) => moment(a.start).diff(moment(b.start)))
            } else {
                resultEvent.end = subtractDaysFromDate(nextEvent.start)
            }
        }

        if (breakEvent.fakeStart) {
            resultEvent['fakeEnd'] = true
        }

        correctedShiftEvents.push(resultEvent)
    }

    return correctedShiftEvents.concat(leaveEvents)
}


let events = [
    {
        title: 'Shift 1',
        start: '2024-02-01',
        end: '2024-02-23',
        shift_start_time: '9:00 AM',
        shift_end_time: '6:00 PM'
    },
    {
        title: 'Shift 2',
        start: '2024-02-05',
        end: '2024-02-08',
        shift_start_time: '12:00 AM',
        shift_end_time: '9:00 PM'
    },
    {
        title: 'Shift 3',
        start: '2024-02-15',
        end: '2024-02-21',
        shift_start_time: '7:00 AM',
        shift_end_time: '2:00 PM'
    },
    {
        title: null,
        start: '2024-02-20',
        end: '2024-02-24',
        eventable_type: 'Holiday'
    },
    {
        title: null,
        start: '2024-02-10',
        end: '2024-02-13',
        eventable_type: 'Leave'
    }
]

const parsedEvents = getCorrectedEvents(events)

console.log(parsedEvents)