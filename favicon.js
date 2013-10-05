/* http://mit-license.org/ */

(function(global) {
    if (global["favicon"]) {
        return;
    }

    /*\
    |*| Private
    \*/

    var head = global.document.getElementsByTagName("head")[0];
    var sequencePause;
    var iconSequence;
    var iconIndex;
    var loopTimeout = null;
    var preloadIcons = function(icons) {
        var image = new Image();
        for (var i = 0; i < icons.length; i++) {
            image.src = icons[i];
        }
    };
    var addLink = function(iconUrl) {
        var newLink = document.createElement("link");
        newLink.type = "image/x-icon";
        newLink.rel = "icon";
        newLink.href = iconUrl;
        if (changeLinkIfExists(iconUrl) == false)
            head.appendChild(newLink);
    };
    var changeLinkIfExists = function(iconUrl) {
        var links = head.getElementsByTagName("link");
        var flag = false;
        for (var key in links) {
            if (links[key].rel != undefined && links[key].rel.search(/^\s*(shortcut\s+)?icon(\s+shortcut)?\s*$/) != -1) {
                links[key].href = iconUrl;
                flag = true;
            }
        }
        return flag;
    };

    /*\
    |*| Public
    \*/

    global["favicon"] = {
        "defaultPause": 2000,
        "change": function(iconURL, optionalDocTitle) {
            clearTimeout(loopTimeout);
            if (optionalDocTitle) {
                document.title = optionalDocTitle;
            }
            if (iconURL !== "") {
                addLink(iconURL);
            }
        },
        "animate": function(icons, optionalDelay) {
            clearTimeout(loopTimeout);
            var that = this;
            preloadIcons(icons);
            iconSequence = icons;
            sequencePause = (optionalDelay) ? optionalDelay : that["defaultPause"];
            iconIndex = 0;
            that["change"](iconSequence[0]);
            loopTimeout = setTimeout(function animateFunc() {
                iconIndex = (iconIndex + 1) % iconSequence.length;
                addLink(iconSequence[iconIndex]);
                loopTimeout = setTimeout(animateFunc, sequencePause);
            }, sequencePause);
        },
        "stopAnimate": function() {
            clearTimeout(loopTimeout);
        }
    };
})(this);
