$(function() {
    $('a[href^="#"]').click(function () {
        const speed = 800;
        let href = $(this).attr("href");
        let target = $(href == "#" || href == "" ? 'html' : href);
        let position = target.offset().top - 80;
        $('body,html').animate({ scrollTop: position}, speed, 'swing');
        return false;
    });
});

$('#top-image').css('display', 'none').fadeIn(4000)

var ctx;
ctx = document.getElementById("canvas").getContext("2d");
ctx.scale(1, 1);
let deg = 90;
var r = 200;
let x = r;
let y = r;


let timerId = setInterval(function(){
    ctx.beginPath();
    ctx.fillStyle = "rgb(40, 40, 40)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let rad = deg * (Math.PI / 180);
    // let x_p = x * Math.cos(rad) - y * Math.sin(rad);
    // let y_p = x * Math.sin(rad) + y * Math.cos(rad);
    // x = x_p
    // y = y_p
    ctx.beginPath();
    ctx.strokeStyle = "rgb(225, 225, 225)";
    ctx.font = '30px serif';
    ctx.fillStyle = 'rgb(225, 225, 225)';
    ctx.lineWidth = 4;

    let x_start = 30;
    let y_start = r
    let y_end = 0

    ctx.moveTo(x_start, y_start);
    ctx.lineTo(x_start, y_end);

    ctx.moveTo(x_start, y_start);
    ctx.lineTo(Math.sin(rad) * r + x_start, r * (1 + Math.cos(rad)));

    ctx.stroke();

    ctx.fillText("B", 0, x_start)
    ctx.fillText("J", Math.sin(rad) * r + x_start + 10, r * (1 + Math.cos(rad)) + x_start);
    if (deg >= 150) {
        ctx.save()
        clearInterval(timerId);
    }
    deg++;
}, 100);
