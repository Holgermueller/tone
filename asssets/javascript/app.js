'use strict'
//Facebook Connection
    $('.fb-login-button').on('click',function(){
        FB.login(function(response){
            if(response === 'connected'){
            alert("login worked");
            }else if(response === 'not_authorized'){
            alert('You are allready logged in');
            }else{
                alert('Totaly not logged in')
            }
        });
    });
        
    $('.test-btn').on('click', function(){
        $('body').append('test');
        FB.api('/me', {fields: 'last_name'}, function(response) {
            $('body').append(response);
            console.log(response);
        });
        // for this next step to work need to ste up auth token
        var body = 'Testing';
        FB.api('/me/feed', 'post', { message: body }, function(response) {
            if (!response || response.error) {
            alert('Error occured');
            } else {
            alert('Post ID: ' + response.id);
            }
        });

    });
      
$('.test-btn').on('click', function(){
    $('body').append('test');
  
    FB.api(
        '/me',
        'GET',
        {},
        function(response) {
           console.log(response)
        }
      );
      

})

//modal for age verification/login

    $(".modal").modal();

//let example = userInput;

/*$ curl -H "Content-Type: application/json" --data \
    '{comment: {text: "what kind of idiot name is foo?"},
      languages: ["en"],
      requestedAttributes: {TOXICITY:{}} }' \
    https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyCY4GjmWVO7suPMSdD-V-Pm8tlExBkIFJE*/

    $.ajax({
        contentType: "application/json",
        data: JSON.stringify({
                comment: {
                        text: "what a lovely hat"
                },
                languages: ["en"],
                requestedAttributes: {
                        TOXICITY: {}
                }
        }),
        method: 'POST',
        url: 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyC_mGbSsEJnpL8tD7BnO5jRXS_uTPMyFwE',
        success: function(response) {
                console.log(response);
        }
});

//Content Pages
    // Floating Action Button(s)
        //Setup Menu FAB
        var elem = document.querySelector('.fixed-action-btn');
        var instance = M.FloatingActionButton.init(elem, {
            hoverEnabled: false
        });
    //Image Carousel
    var elem2 = document.querySelector('.carousel');
    var instance = M.Carousel.init(elem2, {
        fullWidth: false
    });