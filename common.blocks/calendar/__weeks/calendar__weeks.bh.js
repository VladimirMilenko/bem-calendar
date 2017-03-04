module.exports = function (bh) {
    bh.match('calendar__weeks', function (ctx) {
        var data = ctx.json();
        var earlierLimit = new Date(data.earlierLimit),
            laterLimit = new Date(data.laterLimit),
            val = new Date(data.val),
            month = new Date(data.month);

        var weeks = calcWeeks(month);

        ctx.content([
            weeks.map(function (week) {
                return {
                    elem: 'week',
                    tag: 'tr',
                    content: week.map(function (day, i) {
                        var off = !isValidDate(day, earlierLimit, laterLimit),
                            val = data.val,
                            weekend = data.isWeekend(i),
                            dayElem = {
                                elem: 'day',
                                tag: 'td',
                                content: {
                                    elem: 'inner',
                                    content: day ? day.getDate() : ''
                                },
                                attrs: {},
                                elemMods: {}
                            };
                        if (day && !off) {
                            dayElem.attrs['data-day'] = formatDate(day);
                        }

                        if (weekend) {
                            dayElem.elemMods.type = off ? 'weekend-off' : 'weekend';
                        } else if (off) {
                            dayElem.elemMods.type = 'off';
                        }

                        if (day && val && day.getTime() === val.getTime()) {
                            dayElem.elemMods.state = 'current';
                        }

                        return dayElem;
                    })
                }
            })
        ])
    });


    function formatDate(date) {
        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();

        return [leadZero(day), leadZero(month), year].join('.');
    }


    function isValidDate(date, earlierLimit, laterLimit) {
        return !(earlierLimit && date < earlierLimit ||
            laterLimit && date > laterLimit);
    }

    function leadZero(num) {
        return num < 10 ? '0' + num : num;
    }
    function calcWeeks(month) {
        var weekDay,
            weeks = [],
            countDays = 7,
            lastDay = 6,
            week = new Array(countDays),
            dateIterator = new Date(month.getTime());

        for (
            dateIterator.setDate(1);
            dateIterator.getMonth() === month.getMonth();
            dateIterator.setDate(dateIterator.getDate() + 1)
        ) {
            var iterationResult = processWeek(dateIterator, week, weeks, lastDay, countDays);
            week = iterationResult.week;
            weekDay = iterationResult.weekDay;
        }

        if (weekDay !== lastDay) {
            weeks.push(week);
        }

        return weeks;
    }

    function processWeek(dateIterator, week, weeks, lastDay, countDays) {
        var weekDay = (dateIterator.getDay() + lastDay) % countDays; // Получаем 0 - пн, 1 - вт, и т.д.

        week[weekDay] = new Date(dateIterator.getTime());

        if (weekDay === lastDay) {
            for (var i = 0; i < week.length; i++) {
                if (!week[i])
                    week[i] = null;
            }
            weeks.push(week);
            week = new Array(countDays);
        }
        return { week: week, weekDay: weekDay };
    }
}