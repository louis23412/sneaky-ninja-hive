1. ### Requirements:
* [Node.js](https://nodejs.org/en/)

2. ### Installation:
* Clone this repo & cd into it <br>
`git clone https://github.com/louis23412/sneaky-ninja.git` <br>
`cd sneaky-ninja`

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
      "ACTIVATEPOSTS" : true, => true to activate post voting / false to disable.
      "ACTIVATECOMMENTS" : true, => true to activate comment voting / false to disable.
      "ACTIVATELOGGING" : true, => true to activate tracker logging runtime / false to disable.
      "MINREP" : 35, => Minimum reputation for the author of the content (Post or Comment)
      "MAXACTIVEPOSTS" : 7, => Max active posts in the last 7 days (Post or comment)
      "PROFITMIN" : -10, => Minimum profit chance to trigger upvotes (Can be negative. Formula used to calculate: (((q1 + q2 + q3) / 3) - avgval) / avgval
      "MAXVOTERS" : 5 => Max voters allowed on the content being inspected to trigger an upvote
   }
   ```

* Set properties for each tracker. Example:
   ```
   "ONE" : {
      "MINVP" : 97, => Min VP needed for this category
      "SCHEDULETIME" : 3.98, => Min post age / schedule time for this category
      "BASEWEIGHT" : 1500, => Divide by 100 to get weight %. Base weight used to determine the final vote Weight (Formula used: Base Weight * Average Value)
      "MINAVGPOST" : 3, => Minimum Average post value for this category
      "MINAVGCOMMENT" : 2 => Minimun Average comment value for this category
   }
   ```
   Each tracking category should be higher in MinVp than the next! So tracker ONE minVP should be > than tracker TWO minVP. (The globalProps file provided comes with my current setup running as example.)
   
* Save the config file, then run the bot <br>
   `npm start`
