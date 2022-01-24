1. ### Installation:
* Clone this repo & cd into it <br>
`git clone https://github.com/louis23412/sneaky-ninja-hive.git && cd sneaky-ninja-hive` <br>

* Install dependencies <br>
`npm install`

2. ### Configuring variables & running the bot:
* Open __globalProps.json__ & add your account(s) + key(s) <br>
   ##### Single account: <br>
   ```
   "USERLIST" : [
       ["usernameHere", "privatePostingKeyHere"]
   ]
   ```
   
   ##### Multiple accounts: <br>
   ```
   "USERLIST" : [
       ["usernameHere", "privatePostingKeyHere"],
       ["usernameHere", "privatePostingKeyHere"],
       ["usernameHere", "privatePostingKeyHere"]
   ]
   ```
   
* Change the variables as needed:
   ```
    "GLOBALVARS" : {
        "REBLOG" : false,
        "FOLLOW" : false,
        "RFMINWEIGHT" : 33,
        "MINRC" : 80,
        "MINREP" : 35,
        "MAXACTIVEPOSTS" : 7,
        "PROFITMIN" : 10,
        "MAXVOTERS" : 5
    }
   ```

* Set properties for each tracker. Example:
   ```
   "ONE" : {
      "MINVP" : 97,
      "SCHEDULETIME" : 3.98,
      "BASEWEIGHT" : 1500, //Divide by 100 to get base voteweight. 1500 = 15%.
      "MINAVGPOST" : 3,
      "ACTIVE" : true
   }
   ```
   Each tracking category should be higher in MinVp than the next! So tracker ONE minVP should be > than tracker TWO minVP. (The globalProps file provided comes with my current setup running as example.)
   
* Save the config file, then run the bot <br>
   `npm start`