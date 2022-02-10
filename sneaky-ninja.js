const dhive = require('@hiveio/dhive')
const fs = require('fs');
const es = require('event-stream');
const actions = require('./actions');
let globalState = require('./globalState');

const { USERLIST, RPCLIST} = JSON.parse(fs.readFileSync('./settings.json'));

const client = new dhive.Client(RPCLIST, {failoverThreshold : 0});

const streamNow = () => {
    const userNamesList = USERLIST.map(user => {
        return user[0];
    });

    const stream = client.blockchain.getBlockStream('Latest')
    .on('error', () => {
        console.log('Stream error!!!')
        console.log(`---------------------`)
        globalState.system.streamErr++
        streamNow();
    })

    stream.pipe(es.map(async (block, callback) => {
        globalState.system.accsLinked = userNamesList.length;
    
        try {
            globalState.system.votingPower = await actions.getVP(globalState);
        } catch (err) {
            console.log(`GetVP error! -- ${err}`)
            console.log(`---------------------`)
        }
        actions.setGlobalOnlineLists(globalState);
    
        const data = block.transactions
        const blockId = block.block_id
        globalState.system.blockCounter ++
    
        if (globalState.system.blockCounter == 1) {
            globalState.system.startHP = globalState.system.votingHivePower
            console.log('Stream started!')
            console.log(`---------------------`)
        } else if (globalState.system.blockCounter % 100 == 0 && globalState.system.blockCounter != 1) {
            actions.reportToMaster(globalState);
        }
    
        data.forEach(async trans => {
            const operations = trans.operations
            const typeOf = operations[0][0]
            const operationDetails = operations[0][1]
    
            if (typeOf == 'comment' 
                && operationDetails.author.length > 0 
                && operationDetails.parent_author == '' 
                && operationDetails.title != ''
                && globalState.system.accsLinked - Object.keys(globalState.trackers.offline.offlineVoters).length > 0) {

                try {
                    const answer = await actions.ScheduleFlag(globalState, operationDetails)
                    if (answer.signal == true && !globalState.system.pendingAuthorList.includes(answer.author)) {
                        answer.timeFrame.push(answer.author)
                        globalState.system.pendingAuthorList.push(answer.author)
                        console.log(`Post Detected in block id:${blockId}`)
                        console.log(`Author: ${answer.author} | Content-age: ${actions.round(answer.age, 2)} | Avg Value: ${answer.avg} | Profit Chance: ${actions.round(answer.profitChance, 3) + '%'}`)
                        console.log(`Content-link: ${answer.link}`)
        
                        let scheduleTime = (answer.scheduleTime * 60) * 1000 - ((answer.age * 60) * 1000)
                        actions.setSchedule(globalState, scheduleTime, 'posts', answer.author, answer.avg, answer.link, answer.timeFrame, answer.timeName, answer.pureL);
                    }
                } catch (err) {
                    console.log(`Post ScheduleFlag Error! -- ${err}`)
                    console.log(`---------------------`)
                }
            }
        })

        actions.progressLogger(globalState, blockId)
    }))
}

const main = async () => {
    actions.validateSettings(globalState);
    actions.logStateStart(globalState);
    await actions.validateUsersKeys(USERLIST);

    console.log('Starting up block stream...');
    streamNow();
}

main();