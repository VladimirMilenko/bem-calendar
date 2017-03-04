/**
 * @module calendar
 */
modules.define('calendar', ['i-bem-dom', 'BEMHTML', 'jquery'], function(provide, bemDom, BEMHTML, $) {

function compareMonths(a, b) {
    return (a.getFullYear() - b.getFullYear()) * 100 + a.getMonth() - b.getMonth();
}

function leadZero(num) {
    return num < 10 ? '0' + num : num;
}

/**
 * @exports
 * @class Calendar
 * @bem
 */
provide(bemDom.declBlock(this.name, /** @lends calendar.prototype */{
    onSetMod: {
        js: {
            inited: function() {
                this._val = this.params.val ? new Date(this.params.val) : null;
                this._selectedDayElem = null;
                this._firstDayIndex = 0;
                var today = this._getToday();

                if(this.params.month){
                    this._month = new Date(this.params.month);
                } else {
                    if(this.params.val){
                        this._month = new Date(this.params.val);
                        this._month.setDate(1);
                    }

                }


                var dayElems = this.findChildElems('day');
                for(var i=0;i<dayElems.size();i++){
                    if(dayElems.get(i).domElem.data('day')) {
                        this._firstDayIndex = i;
                        break;
                    }
                }
            }
        }
    },

    /**
     * Get value
     *
     * @returns {?Date}
     */
    getVal: function() {
        return this.params.val;
    },

    /**
     * Set value
     *
     * @param {Date|String} val - Date or date as string
     * @returns {Calendar} this
     */
    setVal: function(val) {
        var date = this.parseDate(val);
        this._val = this._isValidDate(date) ? date : null;

         if(this._val) {
            var shouldRebuild = this._month.getMonth() !== date.getMonth() ||
                                this._month.getFullYear() !== date.getFullYear();

            this._month = new Date(this._val.getTime());
            this._month.setDate(1);

            if(shouldRebuild) {
                var calendar = $(BEMHTML.apply({
                    block:'calendar',
                    mods:{
                        theme:'islands'
                    },
                    js:{
                        months:this.params.months,
                        weekdays:this.params.weekdays
                    },
                    val:this._val
                }));

                bemDom.replace(this.domElem, calendar);

            } else {
                this._selectDayElem(
                    this._elems('day')
                        .get(this._firstDayIndex + this._val.getDate() - 1)
                );
            }
        }
        return this;
    },

    /**
     * Switch month
     *
     * @param {Number} step - Months count
     * @returns {calendar} this
     */
    switchMonth: function(step) {
        this._month.setMonth(this._month.getMonth()+step);
        var calendar = $(BEMHTML.apply({
                    block:'calendar',
                    mods:{
                        theme:'islands'
                    },
                    js:{
                        months:this.params.months,
                        weekdays:this.params.weekdays
                    },
                    month:this._month
            }));
        console.log(calendar);
        console.log(this._month);
        bemDom.replace(this.domElem,calendar);
        return this;
    },
    /**
     * Parse date
     *
     * @param {Date|String} val - Date or date as string
     * @returns {?Date}
     */
    parseDate: function(val) {
        if(val instanceof Date) return val;

        var parsed = this._parseDateParts(val);
        if(parsed) {
            var day = parsed.day,
                month = parsed.month,
                year = parsed.year,
                date = this._getToday();

            date.setMonth(month, day);

            if(year) {
                date.setFullYear(year);
            }

            return date;
        }

        return null;
    },

    /**
     * Sets limits
     *
     * @param {Date|String} [earlier] - left limit
     * @param {Date|String} [later] - right limit
     * @returns {calendar} this
     */
    setLimits: function(earlier, later) {
        this._earlierLimit = this.parseDate(earlier);
        this._laterLimit = this.parseDate(later);

        if(earlier && compareMonths(this._month, this._earlierLimit) < 0) {
            this._month = new Date(this._earlierLimit.getTime());
        }

        if(later && compareMonths(this._laterLimit, this._month) < 0) {
            this._month = new Date(this._laterLimit.getTime());
        }

        this._month.setDate(1);

        return this;
    },
    /**
     * @typedef {object} DateHash
     *
     * @param {Number|String} day
     * @param {Number|String} month
     * @param {Number|String} year
     */

    /**
     * Parses string date
     *
     * @param {Date|String} [str] - input date
     * @returns {?DateHash} output date
     */
    _parseDateParts: function(str) {
        var match = /^\s*(\d{1,2})[./-](\d{1,2})(?:[./-](\d{4}|\d\d))?\s*$/.exec(str);

        if(match) {
            return {
                day: match[1],
                month: match[2] - 1,
                year: match[3]
            };
        }

        match = /^\s*(\d{4})[./-](\d\d)(?:[./-](\d\d))?\s*$/.exec(str);

        if(match) {
            return {
                day: match[3],
                month: match[2] - 1,
                year: match[1]
            };
        }

        return null;
    },
    _getToday: function() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        return today;
    },

    _formatDate: function(date) {
        var dateObject = new Date(date);
        var year = dateObject.getFullYear(),
            month = dateObject.getMonth() + 1,
            day = dateObject.getDate();

        return [leadZero(day), leadZero(month), year].join('.');
    },

    _isValidDate: function(date) {
        return !(this._earlierLimit && date < this._earlierLimit ||
            this._laterLimit && date > this._laterLimit);
    },

    _onArrowClick: function(e) {
        var arrow = e.bemTarget;
        if(!arrow.hasMod('disabled')) {
            this.switchMonth(arrow.hasMod('direction', 'left') ? -1 : 1);
        }

    },

    _onDayClick: function(e) {
        var date = $(e.currentTarget).data('day');
        if(!date) return;
        
        this.setVal(date);

        var val = this.getVal();
        this._emit('change', {
            value: val,
            formated: this._formatDate(val)
        });
    },
    _selectDayElem: function(element) {
        if(this._selectedDayElem) {
            this._selectedDayElem.delMod('state');
        }
        element.setMod('state', 'current');
        this._selectedDayElem = element;
    }
},  /** @lends calendar */ {
    lazyInit: false,

    onInit: function() {
        this._domEvents('arrow').on('pointerclick', this.prototype._onArrowClick);
        this._domEvents('day').on('pointerclick', this.prototype._onDayClick);
    }
}));

});
