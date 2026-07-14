<?php 
      if(!empty($_POST["send"])){
        $firstName = $_POST["firstName"];
        $email = $_POST["email"];

        $btnMessage = $_POST["message"];
        
        $toEmail = "info@putitdigital.co.za";

        $mailBody = "Name: " . $firstName . "\r\n"
          . "Email: " . $email . "\r\n\r\n"
          . "Message:\r\n" . $btnMessage;

        $subject = "Website contact from " . $firstName;
        $headers = "From: " . $email . "\r\n" .
                   "Reply-To: " . $email . "\r\n" .
                   "Content-Type: text/plain; charset=UTF-8\r\n";

        $send_email = mail($toEmail, $subject, $mailBody, $headers);
        if ($send_email) {
            $message = "Message was sent successfully";
        } else {
            $message = "Message was not sent";
        }
        
      }
    ?>
<html>

<head>
    <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
</head>
<style>
body {
    text-align: center;
    padding: 40px 0;
    background: #EBF0F5;
}

h1 {
    color: #88B04B;
    font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
    font-weight: 900;
    font-size: 40px;
    margin-bottom: 10px;
}

p {
    color: #404F5E;
    font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
    font-size: 20px;
    margin: 0;
}

i {
    color: #9ABC66;
    font-size: 100px;
    line-height: 200px;
    margin-left: -15px;
}

.card {
    background: white;
    padding: 60px;
    border-radius: 4px;
    box-shadow: 0 2px 3px #C8D0D8;
    display: inline-block;
    margin: 0 auto;
}
</style>

<body>
    <div class="card">
        <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
            <i class="checkmark">✓</i>
        </div>
        <h1>
            <?php
                if(isset($message)) echo $message;
            ?>
        </h1>
        <p> Hi
            <?php 
                if(isset($firstName)) echo $firstName;
            ?>
            We received your booking <br /> we'll be in touch shortly!</p>

    </div>
</body>

</html>