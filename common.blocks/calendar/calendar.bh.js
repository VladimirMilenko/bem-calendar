module.exports = function (bh) {
    bh.match('calendar', function (ctx) {
        var data = ctx.json(),
            val = null,
            month = null;

        if(data.val){
            val = new Date(data.val);
            month = new Date(data.val);
            month.setDate(1);
        }
        if(data.month){
            month = new Date(data.month);
            month.setDate(1);
        } else{
            month = new Date();
            month.setDate(1);
        }


        var prevMonth = !data.earlierLimit || compareMonths(month, data.earlierLimit) > 0,
            nextMonth = !data.laterLimit || compareMonths(data.laterLimit, month) > 0;

            
        ctx.js({
            month:month,
            val:val
        });
        ctx.content(
            {
                block: 'calendar',
                elem: 'container',
                content: [
                    {
                        elem: 'title',
                        date: data.js.months[month.getMonth()] + ' ' + month.getFullYear(),
                        prevMonth:prevMonth,
                        nextMonth:nextMonth
                    },
                    {
                        elem:'layout',
                        tag:'table',

                        isWeekend:data.js.isWeekend ? data.js.isWeekend : isWeekend,
                        weekdays:data.js.weekdays,
                        val:val,
                        month:month,
                        earlientLimit:data.js.earlierLimit,
                        laterLimit:data.js.laterLimit
                    }
                ]
            }
        );
    });

    function isWeekend(dayNumber){
        return dayNumber > 4;
    }

    function compareMonths(a, b) {
        return (a.getFullYear() - b.getFullYear()) * 100 + a.getMonth() - b.getMonth();
    }
}
