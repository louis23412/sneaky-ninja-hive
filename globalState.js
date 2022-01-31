const fs = require('fs');

const { GLOBALVARS } = JSON.parse(fs.readFileSync('./settings.json'));

module.exports = globalState = {
    globalVars : { ...GLOBALVARS },
    
    system : {
        timeFrames : ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'],
        startTime : new Date(),
        blockCounter : 0,
        votingHivePower : 0,
        startHP : 0,
        votingPower : 0,
        pendingAuthorList : [],
        fails : 0,
        operationInspections : 0,
        totalVotes : 0,
        totalReblogs : 0,
        totalReblogFails : 0,
        totalFollows : 0,
        totalFollowFails : 0,
        totalErrors : 0,
        totalInspections : 0,
        rcList : {},
        accsLinked : 0,
        streamEnd : 0,
        streamErr : 0
    },

    trackers : {
        onlineVotersList : {},

        offline : {
            offlineVoters : {}
        },

        'ONE' : {
            baseWeight : (GLOBALVARS.BASEWEIGHT * 100),
            minVP : GLOBALVARS.VPRANGESTOP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                reblogs : 0,
                follows : 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'TWO' : {
            baseWeight : (GLOBALVARS.BASEWEIGHT * 100) - (((GLOBALVARS.BASEWEIGHT * 100) / 10) * 1),
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 1),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 5,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                reblogs : 0,
                follows : 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'THREE' : {
            baseWeight : (GLOBALVARS.BASEWEIGHT * 100) - (((GLOBALVARS.BASEWEIGHT * 100) / 10) * 2),
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 2),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 10,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                reblogs : 0,
                follows : 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'FOUR' : {
            baseWeight : (GLOBALVARS.BASEWEIGHT * 100) - (((GLOBALVARS.BASEWEIGHT * 100) / 10) * 3),
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 3),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 15,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                reblogs : 0,
                follows : 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'FIVE' : {
            baseWeight : (GLOBALVARS.BASEWEIGHT * 100) - (((GLOBALVARS.BASEWEIGHT * 100) / 10) * 4),
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 4),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 20,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                reblogs : 0,
                follows : 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'SIX' : {
            baseWeight : (GLOBALVARS.BASEWEIGHT * 100) - (((GLOBALVARS.BASEWEIGHT * 100) / 10) * 5),
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 5),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 25,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                reblogs : 0,
                follows : 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'SEVEN' : {
            baseWeight : (GLOBALVARS.BASEWEIGHT * 100) - (((GLOBALVARS.BASEWEIGHT * 100) / 10) * 6),
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 6),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 30,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                reblogs : 0,
                follows : 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'EIGHT' : {
            baseWeight : (GLOBALVARS.BASEWEIGHT * 100) - (((GLOBALVARS.BASEWEIGHT * 100) / 10) * 7),
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 7),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 35,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                reblogs : 0,
                follows : 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'NINE' : {
            baseWeight : (GLOBALVARS.BASEWEIGHT * 100) - (((GLOBALVARS.BASEWEIGHT * 100) / 10) * 8),
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 8),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 40,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                reblogs : 0,
                follows : 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'TEN' : {
            baseWeight : (GLOBALVARS.BASEWEIGHT * 100) - (((GLOBALVARS.BASEWEIGHT * 100) / 10) * 9),
            minVP : GLOBALVARS.VPRANGESTART,
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 45,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                reblogs : 0,
                follows : 0,
                inspections: 0,
                pendingInspections: []
            }
        }
    }
}