1. ### Requirements:
* [Node.js](https://nodejs.org/en/)

2. ### Installation:
* Clone this repo & cd into it <br>
`git clone https://github.com/louis23412/sneaky-ninja-hive.git && cd sneaky-ninja-hive` <br>

* Install dependencies <br>
`npm install`

3. ### Configuring variables & running the bot:
* Open __globalProps.json__ & add your account(s) + key(s) <br>
   ##### Single account: <br>
   ```
   "USERLIST" : [
       ["username_here", "KEY_HERE"]
   ]
   ```
   
   ##### Multiple accounts: <br>
   ```
   "USERLIST" : [
       ["username_here", "KEY_HERE"],
       ["username_here", "KEY_HERE"],
       ["username_here", "KEY_HERE"]
   ]
   ```
   
* Change the variables as needed:
   ```
    "GLOBALVARS" : {
        "REBLOG" : true,
        "FOLLOW" : true,
        "RFMINWEIGHT" : 33,
        "MINRC" : 80,
        "MINREP" : 35,
        "MAXACTIVEPOSTS" : 7,
        "PROFITMIN" : 0.001,
        "MAXVOTERS" : 5
    }
   ```

* Set properties for each tracker. Example:
   ```
   "ONE" : {
      "MINVP" : 97,
      "SCHEDULETIME" : 3.98,
      "BASEWEIGHT" : 1500, //Divide by 100 to get base voteweight. 1500 = 15%.
      "MINAVGPOST" : 3
   }
   ```
   Each tracking category should be higher in MinVp than the next! So tracker ONE minVP should be > than tracker TWO minVP. (The globalProps file provided comes with my current setup running as example.)
   
* Save the config file, then run the bot <br>
   `npm start`