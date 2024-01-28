; (function ($) {

    

    var Global = {
        section_name: [],
        isScrolling: true,
        section_num: 1
    };
    Global.fadeInByOrder = function (selector, interval, callback) {
        var i = 1,
            length = $(selector + ' .cfade').length + 1,
            intervala = interval || 100,
            callbacka = callback || function () { return; };

        (function fadeInIt() {
            if (i < length) {
                $(selector + ' .cfade' + i).addClass('cfade-in');
                i++;
                setTimeout(arguments.callee, intervala);
                if (i === length) {
                    callbacka();
                }
            }
        })();
    };
    Global.throttle = function (fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    };
    Global.reCal = function () {

        (function centerLoading() {
            if (!$('body').hasClass('finish-loading')) {
                var topOffset = ($(window).height() - 175) / 2,
                    leftOffset = ($(window).width() - $('loading').width()) / 2 - 60;

                $('.loading').css({
                    top: topOffset,
                    left: leftOffset,
                    right: 'auto',
                    bottom: 'auto'
                });
            }
        })();

        $('.section-wrap').each(function (index, el) {
            Global.section_name[index] = $(this).attr('class').substr(($(this).attr('class').indexOf('section-wrap ') + 13));
            $(this).find('.section').height($(window).height());
        });

        $('.section-content').each(function () {
            $(this).css({
                marginTop: ($(window).height() - 40 - $(this).height()) / 2
            });
        });

    };
    Global.fixedbg = function () {
        var slide_rate = 1000 / 667,
            window_rate;
        (function () {
            window_rate = $(window).width() / $(window).height();
            if (window_rate < slide_rate) {
                $('.home-bg img').css({ height: $(window).height() + 'px', width: ($(window).height() * slide_rate) + 'px', 'margin-left': '-' + ($(window).height() * slide_rate - $(window).width()) / 2 + 'px' });
            } else {
                $('.home-bg img').css({ height: ($(window).width() / slide_rate) + 'px', width: $(window).width() + 'px', 'margin-left': 0 });
            }
        })();
    };
    Global.shrinkHeader = function (doShrink) {
        if (doShrink) {
            $('.section-header').addClass('shrink');
        } else {
            $('.section-header').removeClass('shrink');
        }
    };
    Global.fire_nav = function (theNav) {
        $('.nav .cfade').removeClass('hover');
        switch (theNav) {
            case 2:
                $('.nav .cfade1').addClass('hover');
                break;
            case 3:
                $('.nav .cfade2').addClass('hover');
                break;
            case 4:
                $('.nav .cfade3').addClass('hover');
                break;
            case 5:
                $('.nav .cfade4').addClass('hover');
                break;
            case 6:
                $('.nav .cfade5').addClass('hover');
                break;
            case 7:
                $('.nav .cfade6').addClass('hover');
                break;
        }
    };
    Global.scrollHandle = function (scrollDown) {
        if (!Global.isScrolling) {

            Global.isScrolling = true;
            var targetScrollTopValue = scrollDown ? Global.targetScrollTop(++Global.section_num) : Global.targetScrollTop(--Global.section_num);

            if (scrollDown) {
                if (Global.section_num > 1) {
                    Global.shrinkHeader(true);
                }
            } else {
                if (Global.section_num === 1) {
                    Global.shrinkHeader(false);
                }
            }

            $('html,body').animate({ scrollTop: targetScrollTopValue }, 600, function () {
                Global.isScrolling = false;
            });
            Global.fire_nav(Global.section_num);

        }
    };
    Global.targetScrollTop = function (n) {
        if (n > Global.section_name.length) {
            Global.section_num = Global.section_name.length;
        }
        if (n < 1) {
            Global.section_num = 1;
        }
        return ($(window).height() * (Global.section_num - 1));
    };
    Global.forRetina = function () {

        $('body').append('<div class="state-indicator"></div>');

        function getDeviceState() {
            switch (parseInt($('.state-indicator').css('z-index'), 10)) {
                case 1:
                    return false;
                case 2:
                    return true;
            }
        }

        if (getDeviceState()) {
            Global.changeDBImg();
        }

        $('.state-indicator').remove();
    };
    Global.changeDBImg = function () {
        function changeDBURL(imgURL, imgType) {
            return imgURL.substring(0, imgURL.indexOf('.' + imgType)) + '@2x.' + imgType;
        }
        $('.my-photo').attr('src', function () {
            return changeDBURL($(this).attr('src'), 'jpg');
        });
    };
    Global.handleTouchEvent = function (event) {
        if (event.touches.length == 1) {

            var touchStartY,
                touchMoveY;

            switch (event.type) {
                case "touchstart":
                    touchStartY = event.touches[0].clientY;
                    break;
                case "touchmove":
                    touchMoveY = event.changedTouches[0].clientY;
                    break;
            }
            Global.scrollHandle(touchStartY > touchMoveY ? true : false);

        }
        event.preventDefault();
    };


    $(document).ready(function () {

        $('a[href="#"]').click(function (e) { e.preventDefault(); return false; });

        Global.reCal();
        Global.fixedbg();
        Global.forRetina();

        $('.nav a').click(function (e) {

            var target = $(this).attr('href');
            switch (target) {
                case '#top':
                    target = 1;
                    break;
                case '#about':
                    target = 2;
                    break;
                case '#works':
                    target = 3;
                    break;
                case '#projects':
                    target = 4;
                    break;
                case '#skill':
                    target = 5;
                    break;
                case '#coursis':
                    target = 6;
                    break;
                case '#contact':
                    target = 7;
                    break;
            }
            Global.section_num = target;
            if (target == 1) {
                Global.shrinkHeader(false);
                $('.nav .cfade').removeClass('hover');
            } else {
                Global.fire_nav(target);
                Global.shrinkHeader(true);
            }
            $('body,html').animate({ scrollTop: Global.targetScrollTop(target) }, 600, function () {

            });

            e.preventDefault(); return false;
        });

        $('.scroll-tip').click(function (event) {
            if (!Global.isScrolling) {
                Global.isScrolling = true;
                $('html,body').animate({ scrollTop: Global.targetScrollTop(++Global.section_num) }, 400, function () {
                    Global.isScrolling = false;
                });
                if (Global.section_num > 1) {
                    Global.shrinkHeader(true);
                }
            }
        });

    });


    window.onresize = Global.throttle(function () {
        Global.reCal();
        Global.fixedbg();
    }, 50);


    $(window).load(function () {

        Global.fixedbg();
        Global.reCal();
        $('html,body').animate({ scrollTop: 0 }, 100);
        Global.isScrolling = false;

        (function load_init() {

            $("body").addClass('finish-loading');

            $('.finish-loading .loading').animate({ top: "20px" }, 600, function () {
                $('.back-home').css('opacity', 1);
                $('.loading').remove();
            });

            setTimeout(function () {
                $('body').removeClass('loading-process');
            }, 600);

            Global.fadeInByOrder('.nav', 100, function () {
                Global.fadeInByOrder('.section-fristpage', 300);
            });

        })();

    });

    window.onscroll = Global.throttle(function () {

        $('body').removeClass('finish-loading');
        var fadeInTarget;
        switch (Global.section_num) {
            case 1:
                fadeInTarget = '.section-fristpage';
                $('body').addClass('finish-loading');
                break;
            case 2:
                fadeInTarget = '.about-content';
                break;
            case 3:
                fadeInTarget = '.works-list';
                break;
            case 4:
                fadeInTarget = '.projects-content';
                break;
            case 5:
                fadeInTarget = '.skill-content';
                break;
            case 6:
                fadeInTarget = '.coursis-content';
                break;
            case 7:
                fadeInTarget = '.contact-content';
                break;
        }

        Global.fadeInByOrder(fadeInTarget, 200);

    }, 50);

    $(document).on('mousewheel DOMMouseScroll', function (e) {
        var e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail,
            isMouseScrollDown = delta < 0 ? true : false;

        if (isMouseScrollDown) {

            Global.scrollHandle(true);

        } else {

            Global.scrollHandle(false);

        }

        e.preventDefault();
    });

    // Drag and drop list
    let isDragging = false;
    let currentItem = null;
    let containerOffsetY = 0;
    let initY = 0;

    const container = document.querySelector(".container");
    container.style.width = container.offsetWidth + "px";
    container.style.height = container.offsetHeight + "px";

    document.addEventListener("mousedown", (e) => {
      const item = e.target.closest(".item");
      if (item) {
        isDragging = true;
        currentItem = item;
        containerOffsetY = currentItem.offsetTop;
        currentItem.classList.add("dragging");
        document.body.style.userSelect = "none";
        currentItem.classList.add("insert-animation");
        currentItem.style.top = containerOffsetY + "px";
        initY = e.clientY;
      }
    });
    document.addEventListener("mousemove", (e) => {
      if (isDragging && currentItem) {
        currentItem.classList.remove("insert-animation");
        let newTop = containerOffsetY - (initY - e.clientY);
        if (newTop < -50) {
          newTop = -50;
        } else if (newTop > container.offsetHeight - 30) {
          newTop = container.offsetHeight - 30;
        }
        currentItem.style.top = newTop + "px";

        let itemSibilings = [
          ...document.querySelectorAll(".item:not(.dragging)"),
        ];
        let nextItem = itemSibilings.find((sibiling) => {
          return (
            e.clientY - container.getBoundingClientRect().top <=
            sibiling.offsetTop + sibiling.offsetHeight / 2
          );
        });

        itemSibilings.forEach((sibiling) => {
          sibiling.style.marginTop = "10px";
        });

        if (nextItem) {
          nextItem.style.marginTop = currentItem.offsetHeight + 20 + "px";
        }
        container.insertBefore(currentItem, nextItem);
      }
    });

    document.addEventListener("mouseup", () => {
      if (currentItem) {
        currentItem.classList.remove("dragging");
        currentItem.style.top = "auto";
        currentItem = null;
        isDragging = false;

        document.body.style.userSelect = "auto";
      }

      let itemSibilings = [
        ...document.querySelectorAll(".item:not(.dragging)"),
      ];

      itemSibilings.forEach((sibiling) => {
        sibiling.style.marginTop = "10px";
      });
    });

    // Tabs switch animation
    tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              inter: ["Inter", "sans-serif"],
              caveat: ["Caveat", "cursive"],
            },
          },
        },
      };

})(jQuery);
