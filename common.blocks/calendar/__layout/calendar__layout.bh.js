module.exports = function(bh){
    bh.match('calendar__layout', function(ctx){
        var data = ctx.json();
        ctx.content([
            {
                elem:'weekdays',
                tag:'thead',
                content: data.weekdays.map(function(weekday,i){
                    return {
                        elem:'dayname',
                        tag:'th',
                        elemMods:{
                            type: data.isWeekend(i) ? 'weekend':''
                        },
                        content:weekday
                    }
                })
            },
            {
                elem:'weeks',
                val:data.val,
                month:data.month,
                isWeekend:data.isWeekend,
                earlierLimit:data.earlierLimit,
                laterLimit:data.laterLimit
            }
        ])
    });
};