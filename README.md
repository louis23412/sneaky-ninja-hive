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
        "PROGRESSLOG" : true,
        "LOGRATE" : 1,

        "MINREP" : 35,
        "MAXACTIVEPOSTS" : 7,
        "MAXVOTERS" : 3,
        "MINAVGPOST" : 1,
        "DOWNSCALEMINAVG" : true,
        "MAXVALUETHRESHOLD" : 2.5,
        "MINSCHEDULETIME" : 4.88,

        "MINRC" : 80,
        "BASEWEIGHT" : 1,
        "VPRANGESTART" : 95,
        "VPRANGESTOP" : 99,
        "VWSCALE" : true
    },

    "SKIPTAGS" : [
        "cross-post",
        "nsfw"
    ],

    "SKIPVOTERS" : [
        "spaminator"
    ],

    "RPCLIST" : [
        "https://anyx.io",
        "https://rpc.ausbit.dev",
        "https://api.hive.blog",
        "https://api.openhive.network"
    ]
   ```
   
* Save the config file, then run the bot <br>
   `npm start`