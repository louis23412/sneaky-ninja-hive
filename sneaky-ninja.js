const dhive = require('@hiveio/dhive')
const hive = require('@hiveio/hive-js');
const fs = require('fs');
const es = require('event-stream');
const actions = require('./actions');
let globalState = require('./globalState');

const { USERLIST, RPCLIST } = JSON.parse(fs.readFileSync('./settings.json'));

//Update config for hivejs with new rpc list:
//----------------------------------------------------
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

const client = new dhive.Client(RPCLIST, {failoverThreshold : 0});

const streamNow = () => {
    const userNamesList = USERLIST.map(user => {
        return user[0];
    });

    const stream = client.blockchain.getBlockStream('Latest')
    .on('error', () => {
        console.log('Stream error!!!')
        globalState.system.streamErr++
        streamNow();
    })

    stream.pipe(es.map(async (block, callback) => {
        globalState.system.accsLinked = userNamesList.length;
    
        try {
            globalState.system.votingPower = await actions.getVP(globalState);
        } catch (err) {
            console.log(`GetVP error! -- ${err}`)
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
        }
    
        const runtimeSPGain = globalState.system.votingHivePower - globalState.system.startHP
        const blockCatchRatio = `${actions.round((globalState.system.blockCounter / (actions.round((new Date() - globalState.system.startTime) / 1000 / 60, 2) * 20)) * 100, 2) + '%'}`
    
        console.log(`* Status: ${voteStatus} || Runtime: ${actions.round((new Date() - globalState.system.startTime) / 1000 / 60, 2) + ' mins'} || Highest-VP: ${actions.round(globalState.system.votingPower, 3) + '%'} || Block Catch Ratio: ${blockCatchRatio}`)
        console.log(`* Last block inspected ID: ${blockId} || ${globalState.system.operationInspections} posts detected in ${globalState.system.blockCounter} blocks`)
        console.log(`* Accounts Linked: ${userNamesList.length} || Total HP voting: ${globalState.system.votingHivePower} || Run-time HP Gain: ${runtimeSPGain} || Gain %: ${(runtimeSPGain / globalState.system.votingHivePower) * 100}`)
        console.log(`* Total Votes: ${globalState.system.totalVotes} || Total Vote Fails: ${globalState.system.totalErrors} || Completed Inspections: ${globalState.system.totalInspections} || Pending Inspections: ${globalState.system.pendingAuthorList.length}`)
        console.log(`* Stream errors: ${globalState.system.streamErr} || Voteweight mode: ${vwModeStatus}`)
        console.log()
    
        actions.logTrackers(globalState)
        console.log(`└─| Offline voters(${Object.keys(globalState.trackers.offline.offlineVoters).length}): ==> [${actions.displayVotingPower(globalState.trackers.offline.offlineVoters, globalState)}]`)
    
        console.log(`${'----------------------------------------------------------------------'}`)
    
        data.forEach(async trans => {
            const operations = trans.operations
            const typeOf = operations[0][0]
            const operationDetails = operations[0][1]
    
            if (typeOf == 'comment' && operationDetails.parent_author == '') {
                try {
                    const answer = await actions.ScheduleFlag(globalState, operationDetails)
                    if (answer.signal == true && !globalState.system.pendingAuthorList.includes(answer.author)) {
                        answer.timeFrame.push(answer.author)
                        globalState.system.pendingAuthorList.push(answer.author)
                        console.log('Post Detected!')
                        console.log(`In block: ${blockId} | Match #: ${answer.timeFrame.length}`)
                        console.log(`Author: ${answer.author} | Content-age: ${actions.round(answer.age, 2)} | Avg Value: ${answer.avg} | Profit Chance: ${actions.round(answer.profitChance, 3) + '%'}`)
                        console.log(`Content-link: ${answer.link}`)
        
                        let scheduleTime = (answer.scheduleTime * 60) * 1000 - ((answer.age * 60) * 1000)
                        actions.setSchedule(globalState, scheduleTime, 'posts', answer.author, answer.parentPerm, answer.perm, answer.avg, answer.link, blockId, answer.timeFrame, answer.timeName);
                    }
                } catch (err) {
                    console.log(`Post ScheduleFlag Error! -- ${err}`)
                }
            }
        })
    }))
}

console.log('Starting up block stream...')
streamNow();