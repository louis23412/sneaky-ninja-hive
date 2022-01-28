const dhive = require('@hiveio/dhive')
const fs = require('fs');
const es = require('event-stream');
const actions = require('./actions');
let globalState = require('./globalState');

const { USERLIST, RPCLIST } = JSON.parse(fs.readFileSync('./globalProps.json'));

const client = new dhive.Client(RPCLIST, {failoverThreshold : 0});
const stream = client.blockchain.getBlockStream('Latest');

const userNamesList = USERLIST.map(user => {
    return user[0];
});

const streamNow = () => {
    stream.pipe(es.map(async (block, callback) => {
        globalState.system.accsLinked = userNamesList.length;
    
        try {
            globalState.system.votingPower = await actions.getVP(globalState);
        } catch (err) {
            console.log(actions.rt(`GetVP error! -- ${err}`))
        }
        actions.setGlobalOnlineLists(globalState);
    
        let voteStatus = actions.rt(`Recharging Hive Power`)
        for (timeFrame of [...globalState.system.timeFrames].reverse()) {
            if (globalState.system.votingPower > globalState.trackers[timeFrame].minVP) {
                voteStatus = actions.gt(`Curating content`);
            }
        }
    
        const data = block.transactions
        const blockId = block.block_id
        globalState.system.blockCounter ++
    
        if (globalState.system.blockCounter === 1) {
            globalState.system.startHP = globalState.system.votingHivePower
        }
    
        const runtimeSPGain = globalState.system.votingHivePower - globalState.system.startHP
        const blockCatchRatio = `${actions.yt(actions.round((globalState.system.blockCounter / (actions.round((new Date() - globalState.system.startTime) / 1000 / 60, 2) * 20)) * 100, 2) + '%')}`
    
        console.log(`${actions.yt('*')} Status: ${voteStatus} || Runtime: ${actions.yt(actions.round((new Date() - globalState.system.startTime) / 1000 / 60, 2) + ' mins')} || Highest-VP: ${actions.yt(actions.round(globalState.system.votingPower, 3) + '%')} || Block Catch Ratio: ${blockCatchRatio}`)
        console.log(`${actions.yt('*')} Last block inspected ID: ${actions.yt(blockId)} || ${actions.yt(globalState.system.operationInspections)} posts detected in ${actions.yt(globalState.system.blockCounter)} blocks`)
        console.log(`${actions.yt('*')} Accounts Linked: ${actions.yt(userNamesList.length)} || Total HP voting: ${actions.yt(globalState.system.votingHivePower)} || Run-time HP Gain: ${actions.yt(runtimeSPGain)} || Gain %: ${actions.yt((runtimeSPGain / globalState.system.votingHivePower) * 100)}`)
        console.log(`${actions.yt('*')} Total Votes: ${actions.yt(globalState.system.totalVotes)} || Total Vote Fails: ${actions.yt(globalState.system.totalErrors)} || Total Inspections: ${actions.yt(globalState.system.totalInspections)} || Total Pending inspections: ${actions.yt(globalState.system.pendingAuthorList.length)}`)
        console.log(`* Streams errors: ${globalState.system.streamErr} - Stream restarts: ${globalState.system.streamErr}`)
        console.log()
    
        actions.logTrackers(globalState)
        console.log(`└─| Offline voters(${Object.keys(globalState.trackers.offline.offlineVoters).length}): ==> [${actions.displayVotingPower(globalState.trackers.offline.offlineVoters, globalState)}]`)
    
        console.log(`${actions.yt('----------------------------------------------------------------------')}`)
    
        data.forEach(async trans => {
            const operations = trans.operations
            const typeOf = operations[0][0]
            const operationDetails = operations[0][1]
    
            if (typeOf === 'comment' && operationDetails.parent_author === '') {
                try {
                    const answer = await actions.ScheduleFlag(globalState, operationDetails, 'posts')
                    if (answer.signal === true && !globalState.system.pendingAuthorList.includes(answer.author)) {
                        answer.timeFrame.push(answer.author)
                        globalState.system.pendingAuthorList.push(answer.author)
                        console.log('Post Detected!')
                        console.log(`In block: ${actions.yt(blockId)} | Match #: ${actions.yt(answer.timeFrame.length)}`)
                        console.log(`Author: ${actions.yt(answer.author)} | Content-age: ${actions.yt(actions.round(answer.age, 2))} | Avg Value: ${actions.yt(answer.avg)} | Profit Chance: ${actions.yt(actions.round(answer.profitChance, 3) + '%')}`)
                        console.log(`Content-link: ${actions.yt(answer.link)}`)
        
                        let scheduleTime = (answer.scheduleTime * 60) * 1000 - ((answer.age * 60) * 1000)
                        actions.setSchedule(globalState, scheduleTime, 'posts', answer.author, answer.parentPerm, answer.perm, answer.avg, answer.link, blockId, answer.timeFrame, answer.timeName);
                    }
                } catch (err) {
                    console.log(actions.rt(`Post ScheduleFlag Error! -- ${err}`))
                }
            }
        })
    }))
    .on('end', () => {
        globalState.system.streamEnd++;
        streamNow();
    })
    .on('error', () => {
        globalState.system.streamErr++;
    })
}

console.log('Starting up block stream...')
streamNow();