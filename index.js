

const express = require('express')
const write = require('write')
const fetch = require('node-fetch');
const app = express()
const port = 3000
const util = require('util')

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/hello', function (req, res) {
    res.send('Hello World!')
  })

const marketourl = 'https://602-KKD-677.mktorest.com'
const clientid = 'REPLACE WITH YOUR OWN'
const secretkey = 'REPLACE WITH YOUR OWN'
const accessurl = marketourl + '/identity/oauth/token?grant_type=client_credentials&client_id=' + clientid + '&client_secret='+secretkey
var marketoaccess_token = ''
var hubspotcontacts = ''
const vid = []


function createleads(body,accesstoken,begin,end) {
    //check there is more than 300 people in body input
    var bodyuse =  {  
        "partitionName":"Default",
        "action":"createOrUpdate",
        "lookupField":"email",
        "input":[  
          
             {
                 
             }]}

    if (body.input.slice(begin).length>300){
        bodyuse.input = body.input.slice(begin,end)
        console.log(bodyuse.input.length)
        fetch(marketourl+'/rest/v1/leads.json?access_token='+ accesstoken, {
            method: 'post',
            body:    JSON.stringify(bodyuse),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json()).then(json => console.log(json)).then(function(){
            begin = end
            end = end + 300
            createleads(body,accesstoken,begin,end)
        })
    }
    else {
        bodyuse.input = body.input.slice(begin)
        console.log('end is',end,'begin is',begin,'length is',body.input.length)
        fetch(marketourl+'/rest/v1/leads.json?access_token='+ accesstoken, {
            method: 'post',
            body:    JSON.stringify(bodyuse),
            headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json())
    }

    //create body with 0 to 299
    //do fetch
    //check there is more thatn 300 people in body input
    //createbody with 300 to 600
    //check thereis more than 300 people...
    //there is not. great do 600 to end of body
     
    }

    function createleadstest(accesstoken) {
        console.log('the access token right before create leads is ' + accesstoken)
        }


hspotlink = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=REPLACEWITHYOUROWN&property=firstname&property=lastname&property=email&count=100'
hspotrecent = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/recent?hapikey=REPLACEWITHYOUROWN&property=firstname&property=lastname&property=email&property=id'



//get the contacts from hubspot --> put in body --> put in marketo --> get contacts from marketo put in hubspot

// function accesstoken(aurl) {
//     return fetch(accessurl).then(res => res.json()).then(json => {json.access_token})
// }

var at = ''
var ur1 = ''

const boday = {  
    "partitionName":"Default",
    "action":"createOrUpdate",
    "lookupField":"email",
    "input":[  
      
         {
             
         }]}

 
vidoffset = ''
function hubspoteasy(vidoffset) {
    var rawlink = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=REPLACEWITHYOUROWNproperty=firstname&property=lastname&property=email&count=100&vidOffset='
    var at = ''
    var hlink = rawlink + vidoffset
    fetch(hlink)
    .then(res => res.json()).then((json) => {
                 var count = 0
                for (a in json.contacts) {

                    count = count + 1
                    const temp = {}
                
                    temp.firstName = (json.contacts[a].properties.firstname.value)
                    temp.lastName = (json.contacts[a].properties.lastname.value)
                    temp.email = (json.contacts[a].properties.email.value)
                    // temp.vid = (json.contacts[a].vid)
                        
                      if(!vid.includes(temp.vid)) {
                            boday.input.push(temp)
                            console.log(boday.length)
                        }

                    
                    
                    }

        if(json['has-more'] == true) {
            var vidoffset = json['vid-offset']
            return hubspoteasy(vidoffset)
    }
    else {
        var boday2 = boday
        fetch(accessurl) .then(res => res.json()).then(json => {
            at = json.access_token
            // ur1 = marketourl+'/rest/v1/leads.json?access_token='+ at
            return at
        }).then(function(){
            createleads(boday,at,0,300)
        })
            
    }
    })
}


setInterval(function(){hubspoteasy(0)},30000)
