const dhive = require('@hiveio/dhive')
const hive = require('@hiveio/hive-js');
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
    
        let voteStatus = `Recharging Hive Power`
        for (timeFrame of [...globalState.system.timeFrames].reverse()) {
            if (globalState.system.votingPower > globalState.trackers[timeFrame].minVP) {
                voteStatus = `Curating content`;
            }
        }

        let vwModeStatus = "FIXED";
        if (globalState.globalVars.VWSCALE == true) {
            vwModeStatus = "SCALE";
        }
    
        const data = block.transactions
        const blockId = block.block_id
        globalState.system.blockCounter ++
    
        if (globalState.system.blockCounter == 1) {
            globalState.system.startHP = globalState.system.votingHivePower
            console.log('Stream started!')
            console.log(`---------------------`)
        }
    
        const runtimeSPGain = globalState.system.votingHivePower - globalState.system.startHP
        const blockCatchRatio = `${actions.round((globalState.system.blockCounter / (actions.round((new Date() - globalState.system.startTime) / 1000 / 60, 2) * 20)) * 100, 2) + '%'}`
    
        if (globalState.globalVars.PROGRESSLOG == true & (globalState.system.blockCounter % globalState.globalVars.LOGRATE == 0 || globalState.system.blockCounter == 1)) {
            console.log(`* Status: ${voteStatus} || Runtime: ${actions.round((new Date() - globalState.system.startTime) / 1000 / 60, 2) + ' mins'} || Stream errors: ${globalState.system.streamErr} || Block Catch Ratio: ${blockCatchRatio}`)
            console.log(`* Last block inspected ID: ${blockId} || ${globalState.system.operationInspections} posts detected in ${globalState.system.blockCounter} blocks || Voteweight mode: ${vwModeStatus}`)
            console.log(`* Accounts Linked: ${userNamesList.length} || Total HP voting: ${globalState.system.votingHivePower} || Run-time HP Gain: ${runtimeSPGain} || Gain %: ${(runtimeSPGain / globalState.system.votingHivePower) * 100}`)
            console.log(`* Highest-VP: ${actions.round(globalState.system.votingPower, 3) + '%'} || Votes: ${globalState.system.totalVotes} || Vote Fails: ${globalState.system.totalErrors} || Completed Inspections: ${globalState.system.totalInspections} || Pending Inspections: ${globalState.system.pendingAuthorList.length}`)
            console.log()
            actions.logTrackers(globalState)
            console.log(`${'----------------------------------------------------------------------'}`)
        }
    
        data.forEach(async trans => {
            const operations = trans.operations
            const typeOf = operations[0][0]
            const operationDetails = operations[0][1]
    
            if (typeOf == 'comment' && operationDetails.author.length > 0 
                && operationDetails.parent_author == '' && operationDetails.title != '') {
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
    }))
}

const main = async () => {
    //Update config for hivejs with new rpc list:
    altEnds = []
    RPCLIST.forEach(rpc => {
        if (!(rpc == RPCLIST[0])) {
            altEnds.push(rpc);
        }
    });

    hive.config.uri = RPCLIST[0];
    hive.config.url = RPCLIST[0];
    hive.config.alternative_api_endpoints = altEnds;
    hive.config.failover_threshold = 0;
    hive.config.transport = 'http';
    //----------------------------------------------------
    //Check base weight before starting script:
    if (globalState.globalVars.BASEWEIGHT < 1) {
        console.log('==> SCRIPT STOPPED! BASEWEIGHT HAS TO BE > 1%')
        console.log(`---------------------`)
        process.exit();
    }
    //----------------------------------------------------
    //Start:
    actions.logStateStart(globalState);
    console.log('Starting up block stream...')
    streamNow();
}
main();