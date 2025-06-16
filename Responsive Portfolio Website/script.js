$(document).ready(function(){
    // Existing jQuery code
    $(window).scroll(function(){
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function(){
        $('html').css("scrollBehavior", "smooth");
    });

    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    var typed = new Typed(".typing", {
        strings: [ "Developer", "Designer", "Freelancer"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

  
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
                nav: false
            },
            600:{
                items: 2,
                nav: false
            },
            1000:{
                items: 3,
                nav: false
            }
        }
    });

    // Message form submission
    $('#messageForm').submit(async function(e){
        e.preventDefault();
        
        const API_BASE_URL = 'https://localhost:7170/api/messages'; // Update with your API URL
        const responseElement = $('#messageResponse');
        
        const messageData = {
            senderName: $('#senderName').val(),
            senderEmail: $('#senderEmail').val(),
            content: $('#content').val()
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            if (response.ok) {
                responseElement.removeClass('error').addClass('success').text('Message sent successfully!').show();
                $('#messageForm')[0].reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    responseElement.fadeOut();
                }, 5000);
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            responseElement.removeClass('success').addClass('error').text('Error: ' + error.message).show();
            
            // Hide error after 5 seconds
            setTimeout(() => {
                responseElement.fadeOut();
            }, 5000);
        }
    });
        // Modal functionality
       
});
