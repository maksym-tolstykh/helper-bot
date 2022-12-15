import schedule from 'node-schedule';

export function schedules(obj, func, bot) {
    const scheduleRule = new schedule.RecurrenceRule();

    // scheduleRule.dayOfWeek = obj.dayOfWeek || null;
    // scheduleRule.month = obj.month || null;
    // scheduleRule.dayOfMonth = obj.dayOfMonth || null;
    scheduleRule.hour = obj.hour || null;
    scheduleRule.minute = obj.minute || null;

    const job = schedule.scheduleJob(scheduleRule, function () {
        func(bot);
    });

}