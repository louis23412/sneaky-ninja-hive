1. ### Installation:
* Clone this repo & cd into it <br>
`git clone https://github.com/louis23412/sneaky-ninja-hive.git && cd sneaky-ninja-hive` <br>

* Install dependencies <br>
`npm install`

2. ### Configuring variables & running the bot:
* Open __settings.json__ & add your account(s) + key(s) <br>
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
   For [security reasons](https://hive.blog/faq.html#Why_should_I_be_careful_with_my_master_password), only use your posting key(s)!
   
* Change the variables as needed:
   ```
    "GLOBALVARS" : {
        "REBLOG" : false,
        "FOLLOW" : false,
        "RFMINWEIGHT" : 100,

        "MINREP" : 35,
        "MAXACTIVEPOSTS" : 7,
        "MINAVGPOST" : 3,
        "MAXVOTERS" : 5,
        "MINSCHEDULETIME" : 4.88,

        "MINRC" : 80,
        "VPRANGESTART" : 92,
        "VPRANGESTOP" : 97,
        "BASEWEIGHT" : 15,
        "VWSCALE" : true
    }
   ```

* The bot should work just fine with the default rpc list provided, but if it seems a bit slow or fails, you can view the status of all active nodes [here](https://beacon.peakd.com/).

   ```
    "RPCLIST" : [
      "https://anyx.io",
      "https://rpc.ausbit.dev",
      "https://api.hive.blog",
      "https://api.openhive.network"
    ]
   ```
   
* Save the config file, then run the bot <br>
   `npm start`