const fs = require('fs');

const { GLOBALVARS } = JSON.parse(fs.readFileSync('./globalProps.json'));

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
            baseWeight : GLOBALVARS.BASEWEIGHT,
            minVP : GLOBALVARS.VPRANGESTOP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'TWO' : {
            baseWeight : GLOBALVARS.BASEWEIGHT - 50,
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 1),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 15,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'THREE' : {
            baseWeight : GLOBALVARS.BASEWEIGHT - 100,
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 2),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 30,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'FOUR' : {
            baseWeight : GLOBALVARS.BASEWEIGHT - 150,
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 3),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 45,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'FIVE' : {
            baseWeight : GLOBALVARS.BASEWEIGHT - 200,
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 4),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 60,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'SIX' : {
            baseWeight : GLOBALVARS.BASEWEIGHT - 250,
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 5),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 75,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'SEVEN' : {
            baseWeight : GLOBALVARS.BASEWEIGHT - 300,
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 6),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 90,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'EIGHT' : {
            baseWeight : GLOBALVARS.BASEWEIGHT - 350,
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 7),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 105,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'NINE' : {
            baseWeight : GLOBALVARS.BASEWEIGHT - 400,
            minVP : GLOBALVARS.VPRANGESTOP - (((GLOBALVARS.VPRANGESTOP - GLOBALVARS.VPRANGESTART) / 10) * 8),
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 120,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'TEN' : {
            baseWeight : GLOBALVARS.BASEWEIGHT - 450,
            minVP : GLOBALVARS.VPRANGESTART,
            onlineList : [],
            votingTracker : {},
            scheduleTime : GLOBALVARS.MINSCHEDULETIME + 135,
            posts : {
                minAvg : GLOBALVARS.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        }
    }
}