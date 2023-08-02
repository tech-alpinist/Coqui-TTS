// init variables
let isLoading = false
let apiError = false;
let audioFile;

$(function(){

    $('#text').on('input', function() {
        var count = $(this).val().length;
        if(count >= 200)
            $('.limit').css('display', 'block')
        else
            $('.limit').css('display', 'none')
    })

    $('.btn_synthesize').on('click', function() {
        const text = $('#text').val()
        if(text == '')
            console.log('Please input text and try to synthesize')
        else
            synthesize(text)
    })
});

// function definitions
function synthesize(text) {
    const dict_values = {text}
    const query = JSON.stringify(dict_values)

    $('.generating').css('display', 'block')

    fetch("/synthesize_text", {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }).then(async (response) => {
        if(response)
        if(response.status!= 200) {
            let data = await response.json();
            apiError = true;
            alert("Please check the text and the recaptha again")
        }else{
            const reader = response.body.getReader();
            return new ReadableStream({
                start(controller) {
                    return pump();
                    function pump() {
                    return reader.read().then(({ done, value }) => {
                        if (done) {
                        controller.close();
                        return;
                        }
                        controller.enqueue(value);
                        return pump();
                    });
                    }
                }
            })
        }
       
    })
    .then((stream) => new Response(stream))
    .then((response) => response.blob())
    .then((blob) => {
        return URL.createObjectURL(blob)
    })
    .then((url) => {
        audioFile = url
        if(!apiError){
            document.querySelector("#audio_output").src = url
        }
       
        $('.generating').css('display', 'none');
    })
    .catch((err) => {
        console.log(err)
        $('.generating').css('display', 'none');
    });
}


