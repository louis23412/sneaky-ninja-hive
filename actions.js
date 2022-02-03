const hive = require('@hiveio/hive-js')
const dhive = require('@hiveio/dhive')
const fs = require('fs');
const { Console } = require('console');
const { Transform } = require('stream');

const { USERLIST, SKIPTAGS, SKIPVOTERS, RPCLIST} = JSON.parse(fs.readFileSync('./settings.json'));

const client = new dhive.Client(RPCLIST, {failoverThreshold : 0});
const rcapi = new dhive.RCAPI(client);

const userNamesList = USERLIST.map(user => {
    return user[0];
});

// Helpers :
//----------------------------------------------------
const round = (value, decimals) => {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};

const asc = arr => arr.sort((a, b) => a - b);
const Quartile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

const calculateProfit = (arr, avgval) => {
    const q1 = Quartile(arr, 0.25);
    const q2 = Quartile(arr, 0.5);
    const q3 = Quartile(arr, 0.75);
    const diff = ((q1 + q2 + q3) / 3) - avgval
    let percentile = round((diff / avgval) * 100, 3)
    if (isNaN(percentile)) {
        percentile = 0;
    }
    return percentile
}

const displayVotingPower = (trackerObject, globalState) => {
    const votingList = Object.entries(trackerObject).map(acc => {
        return `@${acc[0]}(VP:${acc[1].percentage / 100}% - RC:${globalState.system.rcList[acc[0]]}%)`
    })
    return votingList;
}

const commonItems = (arr1, arr2) => {
    return arr1.some(item => arr2.includes(item))
}

const table = (input) => {
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
    const logger = new Console({ stdout: ts })
    logger.table(input)
    const table = (ts.read() || '').toString()
    let result = '';
    for (let row of table.split(/[\r\n]+/)) {
      let r = row.replace(/[^┬]*┬/, '┌');
      r = r.replace(/^├─*┼/, '├');
      r = r.replace(/│[^│]*/, '');
      r = r.replace(/^└─*┴/, '└');
      r = r.replace(/'/g, ' ');
      result += `${r}\n`;
    }
    console.log(result);
}
//----------------------------------------------------

// Main actions:
//----------------------------------------------------
const logTrackers = (globalState) => {
    let active_voters = [];
    for (timeRange of globalState.system.timeFrames) {
        if (globalState.trackers[timeRange].onlineList.length > 0) {
            active_voters.push(displayVotingPower(globalState.trackers[timeRange].votingTracker, globalState))
        }
    }
    console.log(`└─| Online voters:(${globalState.system.accsLinked - Object.keys(globalState.trackers.offline.offlineVoters).length}): ${active_voters}`)
    console.log(`└─| Offline voters(${Object.keys(globalState.trackers.offline.offlineVoters).length}): ==> [${displayVotingPower(globalState.trackers.offline.offlineVoters, globalState)}]`)
}

const logStateStart = (globalState) => {
    let tableOutput1 = [];
    let tableOutput2 = [];
    let tableOutput3 = [];

    tableOutput1.push({
        'Min author rep' : globalState.globalVars.MINREP,
        'Max active posts' : globalState.globalVars.MAXACTIVEPOSTS,
        'Max voters' : globalState.globalVars.MAXVOTERS,
        'Max value @ voting time' : globalState.globalVars.MAXVALUETHRESHOLD
    })

    tableOutput2.push({
        'Progress logging' : globalState.globalVars.PROGRESSLOG,
        'Lograte' : globalState.globalVars.LOGRATE,
        'Voteweight scaling' : globalState.globalVars.VWSCALE,
        'Min RC' : globalState.globalVars.MINRC,
        'VP range start' : globalState.globalVars.VPRANGESTART,
        'VP range stop' : globalState.globalVars.VPRANGESTOP
    })

    for (i in globalState.trackers) {
        if (i != "onlineVotersList" && i != "offline") {
            tableOutput3.push({
                'BaseWeight' : globalState.trackers[i].baseWeight / 100,
                'Min VP' : globalState.trackers[i].minVP,
                'Schedule time' : round(globalState.trackers[i].scheduleTime, 3),
                'Min average post val' : round(globalState.trackers[i].posts.minAvg, 3),
                'Min voteweight %' : globalState.globalVars.VWSCALE ? round((globalState.trackers[i].baseWeight / 100) * globalState.trackers[i].posts.minAvg, 2) : globalState.trackers[i].baseWeight / 100,
            })
        }
    }
    console.log('SETTINGS:')
    table(tableOutput1);
    table(tableOutput2);
    console.log('TRACKERS:')
    table(tableOutput3);
}

const setGlobalOnlineLists = (globalState) => {
    globalState.trackers.onlineVotersList = {
        ONE : USERLIST.filter(voter => {
            if ([].concat(globalState.trackers.ONE.onlineList).includes(voter[0])) {
                return voter
            }
        }),
        TWO : USERLIST.filter(voter => {
            if ([].concat(globalState.trackers.ONE.onlineList, globalState.trackers.TWO.onlineList).includes(voter[0])) {
                return voter
            }
        }),
        THREE : USERLIST.filter(voter => {
            if ([].concat(globalState.trackers.ONE.onlineList, globalState.trackers.TWO.onlineList, globalState.trackers.THREE.onlineList).includes(voter[0])) {
                return voter
            }
        }),
        FOUR : USERLIST.filter(voter => {
            if ([].concat(globalState.trackers.ONE.onlineList, globalState.trackers.TWO.onlineList, globalState.trackers.THREE.onlineList, globalState.trackers.FOUR.onlineList).includes(voter[0])) {
                return voter
            }
        }),
        FIVE : USERLIST.filter(voter => {
            if ([].concat(globalState.trackers.ONE.onlineList, globalState.trackers.TWO.onlineList, globalState.trackers.THREE.onlineList, globalState.trackers.FOUR.onlineList, globalState.trackers.FIVE.onlineList).includes(voter[0])) {
                return voter
            }
        }),
        SIX : USERLIST.filter(voter => {
            if ([].concat(globalState.trackers.ONE.onlineList, globalState.trackers.TWO.onlineList, globalState.trackers.THREE.onlineList, globalState.trackers.FOUR.onlineList, globalState.trackers.FIVE.onlineList, globalState.trackers.SIX.onlineList).includes(voter[0])) {
                return voter
            }
        }),
        SEVEN : USERLIST.filter(voter => {
            if ([].concat(globalState.trackers.ONE.onlineList, globalState.trackers.TWO.onlineList, globalState.trackers.THREE.onlineList, globalState.trackers.FOUR.onlineList, globalState.trackers.FIVE.onlineList, globalState.trackers.SIX.onlineList, globalState.trackers.SEVEN.onlineList).includes(voter[0])) {
                return voter
            }
        }),
        EIGHT : USERLIST.filter(voter => {
            if ([].concat(globalState.trackers.ONE.onlineList, globalState.trackers.TWO.onlineList, globalState.trackers.THREE.onlineList, globalState.trackers.FOUR.onlineList, globalState.trackers.FIVE.onlineList, globalState.trackers.SIX.onlineList, globalState.trackers.SEVEN.onlineList, globalState.trackers.EIGHT.onlineList).includes(voter[0])) {
                return voter
            }
        }),
        NINE : USERLIST.filter(voter => {
            if ([].concat(globalState.trackers.ONE.onlineList, globalState.trackers.TWO.onlineList, globalState.trackers.THREE.onlineList, globalState.trackers.FOUR.onlineList, globalState.trackers.FIVE.onlineList, globalState.trackers.SIX.onlineList, globalState.trackers.SEVEN.onlineList, globalState.trackers.EIGHT.onlineList, globalState.trackers.NINE.onlineList).includes(voter[0])) {
                return voter
            }
        }),
        TEN : USERLIST.filter(voter => {
            if ([].concat(globalState.trackers.ONE.onlineList, globalState.trackers.TWO.onlineList, globalState.trackers.THREE.onlineList, globalState.trackers.FOUR.onlineList, globalState.trackers.FIVE.onlineList, globalState.trackers.SIX.onlineList, globalState.trackers.SEVEN.onlineList, globalState.trackers.EIGHT.onlineList, globalState.trackers.NINE.onlineList, globalState.trackers.TEN.onlineList).includes(voter[0])) {
                return voter
            }
        })
    }
}

const getVP = async (globalState) => {
    if (globalState.system.blockCounter % 15 == 0) {
        const result = await client.database.getDynamicGlobalProperties();
        vestPerHive = Number(result.total_vesting_fund_hive.replace(' HIVE', '')) / Number(result.total_vesting_shares.replace(' VESTS', ''))
    
        const usersData = await client.database.getAccounts(userNamesList)
        globalState.system.votingHivePower = 0
    
        for (usr of usersData) {
            const vestingShares = Number(usr.vesting_shares.replace(' VESTS', ''))
            const delegatedVestingShares = Number(usr.delegated_vesting_shares.replace(' VESTS', ''))
            const receivedVestingShares = Number(usr.received_vesting_shares.replace(' VESTS', ''))
            globalState.system.votingHivePower += ((vestingShares + receivedVestingShares) - delegatedVestingShares) * vestPerHive
        }
    }

    if (globalState.system.blockCounter % 5 == 0) {
        for (time in globalState.trackers) {
            if (time != 'offline') {
                globalState.trackers[time].votingTracker = {}
                globalState.trackers[time].onlineList = []
            } else if (time == 'offline') {
                globalState.trackers.offline.offlineVoters = {}
            }
        }

        let tempTracker = {}
        for (userName of userNamesList) {
            tempTracker[userName] = await rcapi.getVPMana(userName)
            globalState.system.rcList[userName] = Number((await rcapi.getRCMana(userName)).percentage) / 100
        }

        for (value of Object.entries(tempTracker)) {
            if (value[1].percentage / 100 >= globalState.trackers.ONE.minVP
                && Number(globalState.system.rcList[value[0]]) >= Number(globalState.globalVars.MINRC)) {
                globalState.trackers.ONE.votingTracker[value[0]] = value[1]
                if (!globalState.trackers.ONE.onlineList.includes(value[0])) {
                    globalState.trackers.ONE.onlineList.push(value[0])
                }
            } else if (value[1].percentage / 100 >= globalState.trackers.TWO.minVP
                && Number(globalState.system.rcList[value[0]]) >= Number(globalState.globalVars.MINRC)) {
                globalState.trackers.TWO.votingTracker[value[0]] = value[1]
                if (!globalState.trackers.TWO.onlineList.includes(value[0])) {
                    globalState.trackers.TWO.onlineList.push(value[0])
                }
            } else if (value[1].percentage / 100 >= globalState.trackers.THREE.minVP
                && Number(globalState.system.rcList[value[0]]) >= Number(globalState.globalVars.MINRC)) {
                globalState.trackers.THREE.votingTracker[value[0]] = value[1]
                if (!globalState.trackers.THREE.onlineList.includes(value[0])) {
                    globalState.trackers.THREE.onlineList.push(value[0])
                }
            } else if (value[1].percentage / 100 >= globalState.trackers.FOUR.minVP
                && Number(globalState.system.rcList[value[0]]) >= Number(globalState.globalVars.MINRC)) {
                globalState.trackers.FOUR.votingTracker[value[0]] = value[1]
                if (!globalState.trackers.FOUR.onlineList.includes(value[0])) {
                    globalState.trackers.FOUR.onlineList.push(value[0])
                }
            } else if (value[1].percentage / 100 >= globalState.trackers.FIVE.minVP
                && Number(globalState.system.rcList[value[0]]) >= Number(globalState.globalVars.MINRC)) {
                globalState.trackers.FIVE.votingTracker[value[0]] = value[1]
                if (!globalState.trackers.FIVE.onlineList.includes(value[0])) {
                    globalState.trackers.FIVE.onlineList.push(value[0])
                }
            }else if (value[1].percentage / 100 >= globalState.trackers.SIX.minVP
                && Number(globalState.system.rcList[value[0]]) >= Number(globalState.globalVars.MINRC)) {
                globalState.trackers.SIX.votingTracker[value[0]] = value[1]
                if (!globalState.trackers.SIX.onlineList.includes(value[0])) {
                    globalState.trackers.SIX.onlineList.push(value[0])
                }
            } else if (value[1].percentage / 100 >= globalState.trackers.SEVEN.minVP
                && Number(globalState.system.rcList[value[0]]) >= Number(globalState.globalVars.MINRC)) {
                globalState.trackers.SEVEN.votingTracker[value[0]] = value[1]
                if (!globalState.trackers.SEVEN.onlineList.includes(value[0])) {
                    globalState.trackers.SEVEN.onlineList.push(value[0])
                }
            } else if (value[1].percentage / 100 >= globalState.trackers.EIGHT.minVP
                && Number(globalState.system.rcList[value[0]]) >= Number(globalState.globalVars.MINRC)) {
                globalState.trackers.EIGHT.votingTracker[value[0]] = value[1]
                if (!globalState.trackers.EIGHT.onlineList.includes(value[0])) {
                    globalState.trackers.EIGHT.onlineList.push(value[0])
                }
            } else if (value[1].percentage / 100 >= globalState.trackers.NINE.minVP
                && Number(globalState.system.rcList[value[0]]) >= Number(globalState.globalVars.MINRC)) {
                globalState.trackers.NINE.votingTracker[value[0]] = value[1]
                if (!globalState.trackers.NINE.onlineList.includes(value[0])) {
                    globalState.trackers.NINE.onlineList.push(value[0])
                }
            } else if (value[1].percentage / 100 >= globalState.trackers.TEN.minVP
                && Number(globalState.system.rcList[value[0]]) >= Number(globalState.globalVars.MINRC)) {
                globalState.trackers.TEN.votingTracker[value[0]] = value[1]
                if (!globalState.trackers.TEN.onlineList.includes(value[0])) {
                    globalState.trackers.TEN.onlineList.push(value[0])
                }
            } else {
                globalState.trackers.offline.offlineVoters[value[0]] = value[1]
            }
        }
    }

    let maxPower = 0
    for (time in globalState.trackers) {
        if (time != 'offline' && time != 'onlineVotersList') {
            const dataObject = globalState.trackers[time]
            const newList = Object.values(dataObject.votingTracker).map(user => {
                return user.percentage / 100
            })
            const most = Math.max(...newList)
            if (most > maxPower) {
                maxPower = most
            } 
        }
    }
    return maxPower
}

const voteNow = (globalState, author, postperm, link, type, voteWeight, newUserList, timeName) => {
    if (newUserList.length > 0) {
        userToVote = newUserList[0]

        try {
            hive.broadcast.vote(userToVote[1], userToVote[0], author, postperm, voteWeight, (err, result) => {
                if (err) {
                    globalState.trackers[timeName][type].errors++
                    globalState.system.totalErrors++
                } else {
                    console.log(`Vote success with a weight of ${(voteWeight) / 100}%!`);
                    console.log(`---------------------`)
                }
            });

            let updatedUserListToVote = [...newUserList];
            updatedUserListToVote.splice(0, 1);
            voteNow(globalState, author, postperm, link, type, voteWeight, updatedUserListToVote, timeName);

        } catch (error) {
            globalState.trackers[timeName][type].errors++
            globalState.system.totalErrors++
        }

    } else if (newUserList.length == 0) {
        globalState.trackers[timeName][type].votes++
        globalState.system.totalVotes++
    }
}

const setSchedule = (globalState, time, contentType, author, avgValue, link, trackingList, timeName, pureL) => {
    new Promise((resolve, reject) => {
        setTimeout( async () => {
            const index = trackingList.indexOf(author)
            if (index > -1) {
                trackingList.splice(index, 1);
            }

            const index2 = globalState.system.pendingAuthorList.indexOf(author)
            if (index2 > -1) {
                globalState.system.pendingAuthorList.splice(index2, 1)
            }

            globalState.trackers[timeName][contentType].inspections++
            globalState.system.totalInspections++

            const PostData = await client.database.getState(pureL)
            const PostDetails = Object.values(PostData.content)[0]
            const PostCreateDate = Date.parse(new Date(PostDetails.created).toISOString())
            const MinuteDiff = (((new Date().getTime() - PostCreateDate) / 1000) / 60) - Math.abs(new Date().getTimezoneOffset())
            const postValue = Number(PostDetails.pending_payout_value.replace(' HBD', ''))
            const acceptingPayment = Number(PostDetails.max_accepted_payout.replace(' HBD', ''))
            const totalVoters = Number(PostDetails.active_votes.length)

            console.log(`Inspection time for ${'@' + author}!`)
            console.log(`Content-Age: ${round(MinuteDiff, 2)} -- Value: ${postValue} -- voters: ${totalVoters}`)
            console.log(`---------------------`)

            let votesignal = true
            let voteTicker = 0;
            for (voter of PostDetails.active_votes) {
                voteTicker++;
                if (userNamesList.includes(voter.voter) || voter == author 
                    || voteTicker > Number(globalState.globalVars.MAXVOTERS || globalState)
                    || SKIPVOTERS.includes(voter.voter)){
                    votesignal = false
                    break;
                }
            }

            if (postValue / avgValue <= globalState.globalVars.MAXVALUETHRESHOLD / 100
                && avgValue >= globalState.trackers[timeName].posts.minAvg
                && !isNaN(postValue / avgValue) 
                && votesignal == true 
                && acceptingPayment > 0
                && PostDetails.parent_author == '' 
                && PostDetails.title != ''
                && !commonItems(JSON.parse(PostDetails.json_metadata).tags, SKIPTAGS)) {

                let newVoteWeight = globalState.trackers[timeName].baseWeight;
                if (globalState.globalVars.VWSCALE == true) {
                    newVoteWeight = Math.round(globalState.trackers[timeName].baseWeight * avgValue)
                    if (newVoteWeight > 10000) {
                        newVoteWeight = 10000;
                    }
                }

                if (globalState.trackers.onlineVotersList[timeName].length > 0) {
                    const linkList = link.split('/')
                    const postPerm = linkList[linkList.length -1]
                    console.log(`VOTE OPPORTUNITY DETECTED! Broadcasting now with ${globalState.trackers.onlineVotersList[timeName].length} account(s)...`)
                    console.log(`---------------------`)
                    //Vote:
                    try {
                        voteNow(globalState, author, postPerm, link, contentType, newVoteWeight, globalState.trackers.onlineVotersList[timeName], timeName); 
                    } catch (error) {
                        globalState.system.totalErrors++;
                    }

                } else {
                    console.log('No accounts available to vote @ this timeframe!')
                    console.log(`---------------------`)
                }
            } else if (votesignal == false) {
                console.log(`Conditions not met!`)
                console.log(`---------------------`)
            } else {
                console.log(`Not worth the vote!`)
                console.log(`---------------------`)
            }
        }, time)
    })
    console.log(`Scheduled inspection for ${round(time / 1000, 2) + ' secs'} from now...`)
    console.log(`---------------------`)
}

const ScheduleFlag = async (globalState, operationDetails) => {
    const author = operationDetails.author
    const parentPermLink = operationDetails.parent_permlink
    const permlink = operationDetails.permlink
    const link = `https://hive.blog/${parentPermLink}/@${author}/${permlink}`
    const pureLink = `/${parentPermLink}/@${author}/${permlink}`
    const postData = await client.database.getState(`/${parentPermLink}/@${author}/${permlink}`)
    const postDetails = Object.values(postData.content)[0]
    const postCreateDate = Date.parse(new Date(postDetails.created).toISOString())
    const currentVoters = postDetails.active_votes.length
    const minuteDiff = (((new Date().getTime() - postCreateDate) / 1000) / 60) - Math.abs(new Date().getTimezoneOffset())

    const authorContent = await client.hivemind.call('get_account_posts', {sort: 'posts', account: author, limit: 100})
    const authorRep = authorContent[0].author_reputation;

    globalState.system.operationInspections++

    let postCount = 0
    let totalPostValue = 0
    let valueData = [];
    let allVoters = [];

    authorContent.forEach(authorPost => {
        const postValue = Number(authorPost.pending_payout_value.replace(' HBD', ''))
        const createDate = Date.parse(new Date(authorPost.created).toISOString())
        const timeDiff = (((new Date().getTime() - createDate) / 1000) / 60) - Math.abs(new Date().getTimezoneOffset())

        if (authorPost.author == author && timeDiff <= 10080) {
            postCount += 1
            totalPostValue += postValue
            valueData.push(postValue)
        }

        for (oldVoter of authorPost.active_votes) {
            allVoters.push(oldVoter.voter);
        }
    })

    let avgValue = totalPostValue / postCount
    if (isNaN(avgValue) || avgValue == null || avgValue == undefined) {
        avgValue = 0.000
    }

    const percentile = calculateProfit(valueData, avgValue);

    let timeFrame = ''
    let scheduleTime = ''
    let timeName = ''

    for (timeFrame of globalState.system.timeFrames) {
        if (authorRep >= globalState.globalVars.MINREP 
            && postCount <= globalState.globalVars.MAXACTIVEPOSTS
            && avgValue >= globalState.trackers[timeFrame].posts.minAvg 
            && currentVoters <= globalState.globalVars.MAXVOTERS
            && percentile > 0
            && postDetails.parent_author == '' 
            && postDetails.title != ''
            && !commonItems(JSON.parse(postDetails.json_metadata).tags, SKIPTAGS)
            && !commonItems(allVoters, SKIPVOTERS)) {

                scheduleTime = globalState.trackers[timeFrame].scheduleTime
                timeName = timeFrame
                timeFrame = globalState.trackers[timeFrame].posts.pendingInspections

                return {
                    signal : true,
                    author : author,
                    avg : avgValue,
                    link : link,
                    pureL : pureLink,
                    parentPerm : parentPermLink,
                    age : minuteDiff,
                    perm : permlink,
                    timeFrame : timeFrame,
                    scheduleTime : scheduleTime,
                    timeName : timeName,
                    profitChance : percentile
                }
            }
    }
    return {signal : false}
}
//----------------------------------------------------


module.exports = {
    round : round,
    logTrackers : logTrackers,
    logStateStart : logStateStart,
    setGlobalOnlineLists : setGlobalOnlineLists,
    getVP : getVP,
    setSchedule : setSchedule,
    ScheduleFlag : ScheduleFlag
}