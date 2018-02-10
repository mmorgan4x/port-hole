
$(function () {

    //if (detectIE()!=-1)
    //alert('Porthole may not be compatible with IE. \nIf the page you are looking for is not You may need to use a different Browser.');

    //setup-----
    resizeWindow();

    $('#options').dropdown();
    $('#info').dropdown();

    autoHideOn = false;

    if ($('#options-data').data('autohideon') == 'True') {
        autoHideOn = true;
        $('#autoHide').addClass('selected-Option');
    }
    else {
        autoHideOn = false;
        $('#dontAutoHide').addClass('selected-Option');
    }

    if ($('#options-data').data('showborderon') == 'True')
        $('#showBorders').addClass('selected-Option');
    else {
        $('#lens').removeClass("lensEffect");
        $('#hideBorders').addClass('selected-Option');
    }
    if ($('#options-data').data('squarecornerson') == 'True')
        $('#squareCorners').addClass('selected-Option');
    else {
        $('#lens').css("border-radius", "50%");
        $("#lens").height($("#lens").width());
        $('#roundCorners').addClass('selected-Option');
    }

    $(window).resize(function () {
        resizeWindow();
    });

    //resize window-----
    function resizeWindow() {
        $("#Main-Frame").width($(window).width());
        $("#Main-Frame").height($(window).height());

        $("#Hidden-Frame").width($(window).width());
        $("#Hidden-Frame").height($(window).height());

        $("#lens").css("max-width", $(window).width() * 2);
        $("#lens").css("max-height", $(window).height() * 2);
    }

    //mousewheel-----
    s = 1.2
    $(window).bind('mousewheel', function (e, delta) {
        if (!isFullScreen && !isLocked && $("#Main-Frame").hasClass("non-interactive") && $("#Hidden-Frame").hasClass("non-interactive")) {
            if (delta > 0) {
                $('#lens').width($('#lens').width() * s);
                $('#lens').height($('#lens').height() * s);
            }
            else {
                $('#lens').width($('#lens').width() / s);
                $('#lens').height($('#lens').height() / s);
            }

            if ($('#lens').height() < 10) {
                $('#lens').hide();
            } else
                $('#lens').show();

            MoveLens(e);
        }
    });

    //go to mouse----
    $(document).on("mousemove", function (e) {
        MoveLens(e);
    });

    function MoveLens(e) {
        if (!isFullScreen && !isLocked) {
            x = e.pageX - $('#lens').width() / 2;
            y = e.pageY - $("#lens").height() / 2;

            $('#lens').css({ 'top': y, 'left': x });
            $('#Hidden-Frame').css({ 'top': -y, 'left': -x });
        }
    }

    //keys-----
    isHidden = false;
    isLocked = false;
    $(document).keydown(function (e) {
        if (!isFullScreen) {

            //resize porthole
            l = $('#lens');
            i = $('#Hidden-Frame');
            delta = 30;
            if (e.keyCode == 38 && e.ctrlKey) {//up
                l.height(l.height() + delta);
                l.css("top", l.position().top - delta / 2);
                i.css("top", -l.position().top);
            }
            else if (e.keyCode == 40 && e.ctrlKey) {//down
                l.height(l.height() - delta);
                l.css("top", l.position().top + delta / 2);
                i.css("top", -l.position().top);
            }
            else if (e.keyCode == 39 && e.ctrlKey) {//right
                l.width(l.width() + delta);
                l.css("left", l.position().left - delta / 2);
                i.css("left", -l.position().left);
            }
            else if (e.keyCode == 37 && e.ctrlKey) {//left
                l.width(l.width() - delta);
                l.css("left", l.position().left + delta / 2);
                i.css("left", -l.position().left);
            }

                //reload both pages
            else if (e.keyCode == 13 && e.ctrlKey) {//ctrl + enter
                loc1 = $('#MainURL').val();
                loc2 = $('#HiddenURL').val();
                history.pushState("", "", '/?URL1=' + loc1 + '?&URL2=' + loc2);
                $('#Main-Frame').attr('src', loc1);
                $('#Hidden-Frame').attr('src', loc2);
            }
                //else if (e.keyCode == 13) {//enter
                //    $('#footer').toggle(300);
                //    $('#logo').toggleClass('logo-Hidden');
                //    $('#leftArrow').toggleClass('logo-Hidden');
                //}

                //hide porthole
            else if (e.keyCode == 18 && e.ctrlKey) {//ctrl + alt              
                $("#lens").toggle(100);
                isHidden = !isHidden;
                if (isHidden) {
                    $('#hidden-noti').show(200);
                    $('#logo-noti').show(100);
                    $('#Main-label').addClass('red');
                    $("#Main-Frame").removeClass("non-interactive");
                }
                else {
                    $('#hidden-noti').hide(200);
                    $('#logo-noti').hide(100);
                    $('#Main-label').removeClass('red');
                    $("#Main-Frame").addClass("non-interactive");
                }
            }
                //lock porthole
            else if (e.keyCode == 16 && e.ctrlKey) {//ctrl + shift            
                isLocked = !isLocked;
                if (isLocked) {
                    $('#locked-noti').show(200);
                    $('#logo-noti').show(100);
                    $('#Main-label').addClass('red');
                    $('#Hidden-label').addClass('red');
                    $('#Main-Frame').removeClass("non-interactive");
                    $('#Hidden-Frame').removeClass("non-interactive");
                } else {
                    $('#locked-noti').hide(200);
                    $('#logo-noti').hide(100);
                    $('#Main-label').removeClass('red');
                    $('#Hidden-label').removeClass('red');
                    $('#Main-Frame').addClass("non-interactive");
                    $('#Hidden-Frame').addClass("non-interactive");
                }
            }
            else {
                return;
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)

        }
    });

    //auto-hide nav on click-----
    $(document).click(function (e) {
        if (!isFullScreen) {
            if (autoHideOn) {
                $('#footer').hide(300);
                $('#logo').addClass('logo-Hidden');
                $('#leftArrow').addClass('logo-Hidden');
            }
        }
    });

    //watermark logo-----
    $('#logo').click(function (e) {
        $('#footer').show(300);
        $('#logo').removeClass('logo-Hidden');
        $('#leftArrow').removeClass('logo-Hidden');
        e.stopPropagation();
    });

    $('#logo-noti').click(function (e) {
        $('#logo-noti').hide(100);
        $('#locked-noti').trigger('click');
        $('#hidden-noti').trigger('click');
    });


    //nav-----
    $('#leftArrow').click(function (e) {
        $('#footer').hide(300);
        $('#logo').addClass('logo-Hidden');
        $('#leftArrow').addClass('logo-Hidden');
    });

    //$('#brand').click(function (e) {
    //    var win = window.open("http://qa-websrvr:89/wiki/", '_blank');
    //    win.focus();
    //});

    //tab notifications-----
    $('#locked-noti').click(function (e) {
        if (!isFullScreen) {
            isLocked = false;
            $('#locked-noti').hide(200);
            $('#logo-noti').hide(100);
            $('#Main-label').removeClass('red');
            $('#Hidden-label').removeClass('red');
            $('#Main-Frame').addClass("non-interactive");
            $('#Hidden-Frame').addClass("non-interactive");
        }
    });

    $('#hidden-noti').click(function (e) {
        if (!isFullScreen) {
            isHidden = false;
            $('#hidden-noti').hide(200);
            $('#logo-noti').hide(100);
            $("#lens").show(100);
            $('#Main-label').removeClass('red');
            $("#Main-Frame").addClass("non-interactive");
        }
    });

    //interactive labels-----
    $('#Main-label').click(function (e) {
        $('#Main-label').toggleClass('red');
        $("#Main-Frame").toggleClass("non-interactive");
    });
    $('#Hidden-label').click(function (e) {
        $('#Hidden-label').toggleClass('red');
        $("#Hidden-Frame").toggleClass("non-interactive");
    });

    //refresh iFrames-----
    $('#Main-refresh').click(function (e) {
        loc1 = $('#MainURL').val();
        loc2 = $('#HiddenURL').val();
        history.pushState("", "", '/?URL1=' + loc1 + '?&URL2=' + loc2);
        $('#Main-Frame').attr('src', loc1);
    });

    $('#Hidden-refresh').click(function (e) {
        loc1 = $('#MainURL').val();
        loc2 = $('#HiddenURL').val();
        history.pushState("", "", '/?URL1=' + loc1 + '?&URL2=' + loc2);
        $('#Hidden-Frame').attr('src', loc2);
    });

    $('#swap').click(function (e) {
        loc2 = $('#MainURL').val();
        loc1 = $('#HiddenURL').val();
        $('#MainURL').val(loc1);
        $('#HiddenURL').val(loc2);
        history.pushState("", "", '/?URL1=' + loc1 + '?&URL2=' + loc2);
        $('#Main-Frame').attr('src', loc1);
        $('#Hidden-Frame').attr('src', loc2);
    });

    //options-----
    $('#dontAutoHide').click(function (e) {
        autoHideOn = false;
        $('#autoHide').removeClass('selected-Option');
        $('#dontAutoHide').addClass('selected-Option');
        updateOptions();
    });

    $('#autoHide').click(function (e) {
        autoHideOn = true;
        $('#dontAutoHide').removeClass('selected-Option');
        $('#autoHide').addClass('selected-Option');
        updateOptions();
    });

    $('#squareCorners').click(function (e) {
        if (!isFullScreen) {
            $('#lens').css("border-radius", "1%");
            $("#lens").height($("#lens").width() * 9 / 16);

            $('#roundCorners').removeClass('selected-Option');
            $('#squareCorners').addClass('selected-Option');
            updateOptions();
        }
    });

    $('#roundCorners').click(function (e) {
        if (!isFullScreen) {
            $('#lens').css("border-radius", "50%");
            $("#lens").height($("#lens").width());

            $('#squareCorners').removeClass('selected-Option');
            $('#roundCorners').addClass('selected-Option');
            updateOptions();
        }
    });

    $('#showBorders').click(function (e) {
        if (!isFullScreen) {
            $('#lens').addClass("lensEffect");

            $('#hideBorders').removeClass('selected-Option');
            $('#showBorders').addClass('selected-Option');
            updateOptions();
        }
    });

    $('#hideBorders').click(function (e) {
        if (!isFullScreen) {
            $('#lens').removeClass("lensEffect");

            $('#showBorders').removeClass('selected-Option');
            $('#hideBorders').addClass('selected-Option');
            updateOptions();
        }
    });

    function updateOptions() {
        autoHide = $('#autoHide').hasClass('selected-Option');
        showBorders = $('#showBorders').hasClass('selected-Option');
        squareCorners = $('#squareCorners').hasClass('selected-Option');
        $.ajax({
            url: saveOptionsURL,
            data: { autoHide: autoHide, showBorders: showBorders, squareCorners: squareCorners },
        });
    }

    //fullscreen mode-----
    isFullScreen = false;
    oldWidth = 0;
    oldHeight = 0;
    oldRadius = 0;
    $('#fullScreen').click(function () {
        isFullScreen = !isFullScreen;
        if (isFullScreen) {
            $("#lens").show()
            $('#Hidden-label').addClass('red');;
            $("#Hidden-Frame").removeClass("non-interactive");

            $(this).html("<i class='fa fa-compress'>");
            $("#fullScreen-container").addClass("active");

            $("#options-container").addClass("disabled");
            $("#options").addClass("disabled");

            $('#lens').css({ 'top': 0, 'left': 0 });
            $('#Hidden-Frame').css({ 'top': 0, 'left': 0 });

            oldWidth = $("#lens").width();
            oldHeight = $("#lens").height();
            oldRadius = $('#lens').css("border-radius");
            $("#lens").width($(window).width());
            $("#lens").height($(window).height());
            $('#lens').css("border-radius", "0%");
        }
        else {
            $('#Hidden-label').removeClass('red');
            $("#Hidden-Frame").addClass("non-interactive");

            $(this).html("<i class='fa fa-arrows-alt'>");
            $("#fullScreen-container").removeClass("active");

            $("#options-container").removeClass("disabled");
            $("#options").removeClass("disabled");

            $("#lens").width(oldWidth);
            $("#lens").height(oldHeight);
            $('#lens').css("border-radius", oldRadius);
        }
    });

    //for auto-hiding-----
    $('#footer').click(function (e) {
        e.stopPropagation();
    });
});

function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // IE 12 => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return -1;
}