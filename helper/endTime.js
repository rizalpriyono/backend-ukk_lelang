const { CronJob } = require('cron')
const { lelangStatus } = require('./enum')
const { toIsoString } = require('./date')
const { lelang } = require('../models/index')
const runTime = (time, timestamp, id) => {
    let job = new CronJob(time, async () => {
        const date = new Date(Date.now())
        const date7 = new Date(toIsoString(date))
        const now = date7.getTime()
        if (now > timestamp) {
            await lelang.update({ status: lelangStatus.DITUTUP }, { where: { id: id } })
            job.stop()
        }
    });
    job.start()
}

module.exports = {
    runTime
}