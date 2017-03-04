module.exports = function (bh) {
    bh.match('calendar__title', function (ctx) {
        var data = ctx.json();
        ctx.content(
            [
                {
                    elem: 'arrow',
                    elemMods: {
                        direction: 'left',
                        disabled: !data.prevMonth
                    }
                },
                {
                    elem: 'arrow',
                    elemMods: {
                        direction: 'right',
                        disabled: !data.nextMonth
                    }
                },
                {
                    elem: 'name',
                    content:data.date
                }
            ]
        );
    });
}