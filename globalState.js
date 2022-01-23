const fs = require('fs');

const { TRACKERS, GLOBALVARS } = JSON.parse(fs.readFileSync('./globalProps.json'));

module.exports = globalState = {
    globalVars : { ...GLOBALVARS },
    
    system : {
        timeFrames : ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'],
        startTime : new Date(),
        blockCounter : 0,
        votingHivePower : 0,
        startSP : 0,
        votingPower : 0,
        pendingAuthorList : [],
        fails : 0,
        operationInspections : 0,
        totalVotes : 0,
        totalErrors : 0,
        totalInspections : 0,
        rcList : {},
        accsLinked : 0
    },

    trackers : {
        onlineVotersList : {},

        offline : {
            offlineVoters : {}
        },

        'ONE' : {
            baseWeight : TRACKERS.ONE.BASEWEIGHT,
            minVP : TRACKERS.ONE.MINVP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : TRACKERS.ONE.SCHEDULETIME,
            posts : {
                minAvg : TRACKERS.ONE.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'TWO' : {
            baseWeight : TRACKERS.TWO.BASEWEIGHT,
            minVP : TRACKERS.TWO.MINVP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : TRACKERS.TWO.SCHEDULETIME,
            posts : {
                minAvg : TRACKERS.TWO.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'THREE' : {
            baseWeight : TRACKERS.THREE.BASEWEIGHT,
            minVP : TRACKERS.THREE.MINVP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : TRACKERS.THREE.SCHEDULETIME,
            posts : {
                minAvg : TRACKERS.THREE.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'FOUR' : {
            baseWeight : TRACKERS.FOUR.BASEWEIGHT,
            minVP : TRACKERS.FOUR.MINVP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : TRACKERS.FOUR.SCHEDULETIME,
            posts : {
                minAvg : TRACKERS.FOUR.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'FIVE' : {
            baseWeight : TRACKERS.FIVE.BASEWEIGHT,
            minVP : TRACKERS.FIVE.MINVP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : TRACKERS.FIVE.SCHEDULETIME,
            posts : {
                minAvg : TRACKERS.FIVE.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'SIX' : {
            baseWeight : TRACKERS.SIX.BASEWEIGHT,
            minVP : TRACKERS.SIX.MINVP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : TRACKERS.SIX.SCHEDULETIME,
            posts : {
                minAvg : TRACKERS.SIX.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'SEVEN' : {
            baseWeight : TRACKERS.SEVEN.BASEWEIGHT,
            minVP : TRACKERS.SEVEN.MINVP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : TRACKERS.SEVEN.SCHEDULETIME,
            posts : {
                minAvg : TRACKERS.SEVEN.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'EIGHT' : {
            baseWeight : TRACKERS.EIGHT.BASEWEIGHT,
            minVP : TRACKERS.EIGHT.MINVP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : TRACKERS.EIGHT.SCHEDULETIME,
            posts : {
                minAvg : TRACKERS.EIGHT.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'NINE' : {
            baseWeight : TRACKERS.NINE.BASEWEIGHT,
            minVP : TRACKERS.NINE.MINVP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : TRACKERS.NINE.SCHEDULETIME,
            posts : {
                minAvg : TRACKERS.NINE.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        },

        'TEN' : {
            baseWeight : TRACKERS.TEN.BASEWEIGHT,
            minVP : TRACKERS.TEN.MINVP,
            onlineList : [],
            votingTracker : {},
            scheduleTime : TRACKERS.TEN.SCHEDULETIME,
            posts : {
                minAvg : TRACKERS.TEN.MINAVGPOST,
                errors: 0,
                votes: 0,
                inspections: 0,
                pendingInspections: []
            }
        }
    }
}