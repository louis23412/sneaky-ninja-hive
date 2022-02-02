const hive = require('@hiveio/hive-js')
const dhive = require('@hiveio/dhive')
const fs = require('fs');

const { USERLIST, RPCLIST} = JSON.parse(fs.readFileSync('./settings.json'));

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

const reblogNow = (globalState, author, postperm, type, newUserList, timeName) => {
    if (newUserList.length > 0) {
        userToVote = newUserList[0]

        try {
            const json = JSON.stringify(['reblog', {
                account: userToVote[0],
                author: author,
                permlink: postperm
            }]);
        
            console.log(`Reblog author => @${author}...`)
                
            hive.broadcast.customJson(userToVote[1], [], [userToVote[0]], 'follow', json, (err, result) => {
                if (err) {
                    globalState.trackers[timeName][type].errors++
                    globalState.system.totalReblogFails++;
                } else {
                    console.log(`@${userToVote[0]} reblog success!`);
                }
            });

            let updatedUserListToVote = [...newUserList];
            updatedUserListToVote.splice(0, 1);
            reblogNow(globalState, author, postperm, type, updatedUserListToVote, timeName);

        } catch (error) {
            globalState.trackers[timeName][type].errors++
            globalState.system.totalReblogFails++;
        }

    } else if (newUserList.length == 0) {
        globalState.trackers[timeName][type].reblogs++
        globalState.system.totalReblogs++
    }
}

const followNow = (globalState, author, type, newUserList, timeName) => {
    if (newUserList.length > 0) {
        userToVote = newUserList[0]

        try {
            const json2 = JSON.stringify(['follow', {
                follower: userToVote[0],
                following: author,
                what: ["blog"],
            }]);
        
            console.log(`Follow author => @${author}...`)
        
            hive.broadcast.customJson(userToVote[1], [], [userToVote[0]], 'follow', json2, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Follow success!`);
                }
            });

            let updatedUserListToVote = [...newUserList];
            updatedUserListToVote.splice(0, 1);
            followNow(globalState, author, type, updatedUserListToVote, timeName);
            
        } catch (error) {
            globalState.trackers[timeName][type].errors++
            globalState.system.totalFollowFails++;
        }

    } else if (newUserList.length == 0) {
        globalState.trackers[timeName][type].follows++
        globalState.system.totalFollows++
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
                if (userNamesList.includes(voter.voter) || voter == author || voteTicker > Number(globalState.globalVars.MAXVOTERS)){
                    votesignal = false
                    break;
                }
            }

            if (postValue / avgValue <= 0.025 && !isNaN(postValue / avgValue) && votesignal == true && acceptingPayment > 0
            && postValue < globalState.trackers[timeName].posts.minAvg
            && PostDetails.parent_author == '' && PostDetails.title != '') {

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

                    //Reblog:
                    if (globalState.globalVars.REBLOG == true) {
                        try {
                            reblogNow(globalState, author, postPerm, contentType, globalState.trackers.onlineVotersList[timeName], timeName)
                        } catch (error) {
                            globalState.system.totalReblogFails++;
                        }
                    }

                    //Follow:
                    if (globalState.globalVars.FOLLOW == true) {
                        try {
                            followNow(globalState, author, contentType, globalState.trackers.onlineVotersList[timeName], timeName)
                        } catch (error) {
                            globalState.system.totalFollowFails++;
                        }
                    }

                } else {
                    console.log('No accounts available to vote @ this timeframe')
                    console.log(`---------------------`)
                }
            } else if (votesignal == false) {
                console.log(`Already voted here! / Author has voted here! / Too many voters!`)
                console.log(`---------------------`)
            } else {
                console.log(`Not profitable to vote! =(`)
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
    const authorState = await client.database.getState(`/@${author}`)
    const authorDetails = Object.values(authorState.accounts)[0]
    const authorRep = hive.formatter.reputation(authorDetails.reputation)
    let authorContent = Object.values(authorState.content)

    globalState.system.operationInspections++

    let postCount = 0
    let totalPostValue = 0
    let valueData = [];

    authorContent.forEach(authorPost => {
        const postValue = Number(authorPost.pending_payout_value.replace(' HBD', ''))
        const createDate = Date.parse(new Date(authorPost.created).toISOString())
        const timeDiff = (((new Date().getTime() - createDate) / 1000) / 60) - Math.abs(new Date().getTimezoneOffset())

        if (authorPost.author == author && timeDiff <= 10080) {
            postCount += 1
            totalPostValue += postValue
            valueData.push(postValue)
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
        if (authorRep >= globalState.globalVars.MINREP && postCount <= globalState.globalVars.MAXACTIVEPOSTS
            && avgValue >= globalState.trackers[timeFrame].posts.minAvg && currentVoters <= globalState.globalVars.MAXVOTERS
            && percentile > 0 && globalState.trackers[timeFrame].onlineList.length > 0
            && postDetails.parent_author == '' && postDetails.title != ''
            && !(JSON.parse(postDetails.json_metadata).tags.includes('cross-post'))) {
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
    displayVotingPower : displayVotingPower,
    logTrackers : logTrackers,
    setGlobalOnlineLists : setGlobalOnlineLists,
    getVP : getVP,
    voteNow : voteNow,
    setSchedule : setSchedule,
    ScheduleFlag : ScheduleFlag
}