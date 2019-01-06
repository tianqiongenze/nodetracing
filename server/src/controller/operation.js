const LevelDB = require('../cache/LevelDB.js')
// 路由相关
const Router = require('koa-router')
// 日志相关
// const log = require('tracer').colorConsole({ level: require('config').get('log').level })
// 初始化路由
const router = new Router()

/**
 * 获取单服务所有Operation
 */
router.get('/:serviceName', async (ctx, next) => {
    let operationArr = await LevelDB.queryByPrefix(`so_${ctx.params.serviceName}`)
    ctx.body = operationArr
})

/**
 * 获取单Operation所有根Span
 */
router.get('/:serviceName/:operationName', async (ctx, next) => {
    let rootSpanArr = []
    let rootSpanArrRes = await LevelDB.queryByPrefix(`sos_${ctx.params.serviceName}.${ctx.params.operationName}`)
    for (let rootSpan of rootSpanArrRes) {
        rootSpanArr.push({
            id: rootSpan.id,
            operationName: rootSpan.operationName,
            startMs: rootSpan.startMs,
            duration: rootSpan.finishMs - rootSpan.startMs
        })
    }
    ctx.body = rootSpanArr
})

module.exports = router