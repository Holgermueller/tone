'use strict'

let slackInfomation = null;

//FIREBASE CONNECTION
var config = {
    apiKey: "AIzaSyBw_XTxT6R_bfFIQCIsvAnbP3lUKaGPogo",
    authDomain: "tone-app-199717.firebaseapp.com",
    databaseURL: "https://tone-app-199717.firebaseio.com",
    projectId: "tone-app-199717",
    storageBucket: "tone-app-199717.appspot.com",
    messagingSenderId: "618773555838"
  };
   firebase.initializeApp(config);

   const database = firebase.database();

//INDEX / LOGIN PAGE
    //MODAL TRIGGERS
        var elem3 = document.querySelector('#modal1');
        var instance3 = M.Modal.init(elem3, {
            dismissable: false
        });

        var elem4 = document.querySelector('#modal2');
        var instance3 = M.Modal.init(elem4, {
            dismissable: false
        });
    //SIGN UP MODAL
        $("#sign-up").on("click", function(e){
            let userName = $("#userName").val().trim();
            let password = $("#password").val().trim();
            //push to firebase
            database.ref().push({
                username: userName,
                password: password
            });
        });
        //
        database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
            //store snapshot value
            let sv = snapshot.val();

            let userNAme = snapshot.val().username;
            let passWord = snapshot.val().password;
            //console.log(userNAme);
        });

        //Age of User
        let userAge;
        $('#dOB').change(function(){
            let DOB = this.value;
            userAge = moment().diff(moment(DOB, "YYYY-MM-DD"), 'years');
                //console.log(userAge);
            return(userAge);
        });

        //Sign Up requirements met?
        $(':checkbox').on('click',function(){
            let checkBox = document.getElementById("checkbox-agree");
                //console.log(checkBox);
            // Requirements met
            if ($(':checkbox').is(':checked') && $('#userName').val() && $('#password').val() && userAge >= 13) {
                $('#sign-up-slack').css("visibility","visible");
            }
            //At least 1 requirement not met
            else {
                $('#sign-up-slack').css("visibility","hidden");
                if (userAge < 13){
                    console.log("too young");
                }
                else if (!$('#userName').val()){
                    console.log("no username");
                }
                else if (!$('#pasword').val()){
                    console.log("no password");
                }
            }
        });
        //SIGN IN MODAL
            //check username & password -- allow login?

// SLACK PAGE
    //RESPONSIVE DESIGN
        // Set .ontent-main div to window height (keeps messages from getting cut off by footer/message input)
            $(document).ready(function() {
                function setHeight() {
                  let windowHeight = $(window).innerHeight();
                  $('.content-main').css('height', windowHeight);
                };
                setHeight();
                
                $(window).resize(function() {
                  setHeight();
                });
              });

    //SLACK API
        const username = 'test'
        const UID = 'UA0ATEGTG';

        // Slack event Listners
        $('.getSlack').on('click', getMessageFromSlack);

        $('.slack-submit').on('click', function(){
            event.preventDefault();
            const message = $('#textarea1').val();
            postMessageToSlack(message);
            })

        /**
         *  This will pull the last 100 messages from slack
         * 
         *  @method getMessageFromSlack
         * 
         */
        function getMessageFromSlack() {
        $.ajax({
            type: 'GET',
            url: SLACK_URL + SLACK_TOKEN + SLACK_CHANNEL,
            success: function(data) {console.log(data); slackInfomation = data.messages },
            error: function(data){console.log(data);}
            })
        }

        /**
         * This will gather all the infomation on the user from slack
         * 
         * @param {*} UID user id from slack
         * @return jsoon Object
         * Main list of the key values that will be most used
         *  object profile { display_name,display_name_normalized,image_24,image_32,image_48,image_72,image_192,image_512,
         *  real_name,real_name_normalized}
         */
        function gatherUserInfomation(UID) {
        $.ajax({
            method:'GET',
            url: `https://slack.com/api/users.profile.get${SLACK_TOKEN}&user=${UID}&pretty=1`,
            success: function(data){
                console.log(data)
                // Will need to call the function to add to the Page in here  
                return data.profile;
            },
            error:function(error){
                console.log('error Unable to gather infomation with the given user ID: ' ,error)}
            });
        }

        /**
         * This will take the given message and post it to slack
         * 
         * @param {*} message string message you want posted to slack
         * @param username given user name you want to post as
         */
        function postMessageToSlack(message, username = 'Tone') {
                $.ajax({
                    dataType: 'json',
                    processData: false,
                    type: 'POST',
                    url: `https://slack.com/api/chat.postMessage${SLACK_TOKEN}&channel=C9Z8JTEMA&text=${message}&as_user=false&username=${username}&pretty=1`,
                    error:function(error){console.log('unable to post message to slack: ' , error)}
                });
        }

        /**
         * Will append a single message to the view
         * 
         * @param {*} user 
         * @param {*} message 
         */
        function displayMessageToApp(user ,message, i) {
            console.log(message);
            const template = `<div class="user-message">
                <div class="row message-head">
                    <div class="chip username"><img class="chip-img" src="https://static01.nyt.com/images/2018/02/11/realestate/11dogs-topbreeds-Chihuahua/11dogs-topbreeds-Chihuahua-master495.jpg" alt="Contact Person">
                    <span>${user}</span>
                    </div>
                    <div class="right toxicity" id="toxicity${i}"></div>
                </div>
                <p class="row message-text">${message}</p>
                <div  class="right timestamp">Time AMPM</div>
            </div>`;
            $('#all-messages').append(template);

        }

        /**
         * Display Last message
         * 
         */
        function displayLastMessage() {
            let text = slackInfomation[0].text;
            //aditonal User varification to see if we need more user data can be done here
            const user = slackInfomation[0].username || slackInfoation[0].user
            text = checkIfTextMessageIsImgUrl(text);
            displayMessageToApp(user, text);
        }

        /**
         * This will diaply all the message received on the screen (currenlty the last 100)
         * 
         * 
         */

        function displayAllMessages() {
            for(let i = slackInfomation.length -1; i => 0; i--){
                let text = slackInfomation[i].text;
                //aditonal User varification to see if we need more user data can be done here
                const user = slackInfomation[i].username || slackInfomation[i].user || slackInfomation[i].bot_id
                text = checkIfTextMessageIsImgUrl(text);
                $.ajax({
                    contentType: "application/json",
                    data: JSON.stringify({
                        comment: {
                            text: text
                        },
                        languages: ["en"],
                        requestedAttributes: {
                            TOXICITY: {}
                        }
                    }),
                    method: 'POST',
                    url: 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyC_mGbSsEJnpL8tD7BnO5jRXS_uTPMyFwE',
                    success: function(response) {
                        //console.log(response);
                        //console.log(response.attributeScores.TOXICITY.summaryScore.value);
                        let tox = response.attributeScores.TOXICITY.summaryScore.value
                        let toxPercentage = (tox*100).toFixed(0)
                        //console.log(toxPercentage,"% Toxic")
                        $(`#toxicity${i}`).append(toxPercentage+"% Toxicity")
                    } 
                });
                displayMessageToApp(user, text, i);

            }
        }

        /**
         * This will check if the image is a ULR img from slack if it is then it will convert the text to an html string
         * 
         * @method checkIfTextMessageIsImgUrl
         * @param {*} text 
         * @return {*} text || html element
         */
        function checkIfTextMessageIsImgUrl(text) {
            if(! text.charAt(0) === '<'){

                return text;
            }
            text = text.replace('<', '');
            text = text.replace('>', '');
            if(text.includes('.gif')){
                const imageElement = `<img src='${text}' >`;
                return imageElement;
            }

            return text;
        }


        $('.displaymessage').on('click', displayAllMessages);


    //PERSPECTIVE API
        //TOXICITY OF EACH MESSAGE (see displayAllMessages function)
        //TOXICITY OF MESSAGE BEING TYPED
        let contentToAnalize = ""

        $('#textarea1').keyup( function(){
            contentToAnalize = $('#textarea1').val();
            // timeout so we don't jam the perspective API
            setTimeout( 
            // This Ajax call gives us the analized content from the perpective API
                function(){ $.ajax({
                    contentType: "application/json",
                    data: JSON.stringify({
                        comment: {
                            text: contentToAnalize
                        },
                        languages: ["en"],
                        requestedAttributes: {
                            TOXICITY: {}
                        }
                    }),
                    method: 'POST',
                    url: 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyC_mGbSsEJnpL8tD7BnO5jRXS_uTPMyFwE',
                    success: function(response) {
                        //console.log(response);
                        //console.log(response.attributeScores.TOXICITY.summaryScore.value);
                        let toxicity = response.attributeScores.TOXICITY.summaryScore.value
                        let toxicityPercentage = (toxicity*100).toFixed(0)
                        //console.log(toxicityPercentage)
                        $('#percentage').text(toxicityPercentage + "% Toxic")
                    } 
                }); }
            , 3000);
        });

