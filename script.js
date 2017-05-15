var deleteButton = "<button onclick='remove($(this).parent().parent())' class='delete pull-right'>Delete</button>";
var upButton = "<button onclick='up($(this).parent().parent())' class='up pull-right'>Up</button>";
var downButton = "<button onclick='down($(this).parent().parent())' class='down pull-right'>Down</button>";
var cssAttributes = {};
var textBoxToolBar =
"<div class='textbox-toolbar'>" + 
    "<button onclick='document.execCommand(&quot;italic&quot;,false,null);'>" +
        "<i>Italic</i>" + 
    "</button>" + 
    "<button onclick='document.execCommand(&quot;bold&quot;,false,null);'>" +
        "<b>Bold</b>" + 
    "</button>" +
    deleteButton +
    downButton +
    upButton +
"</div>";
var dropLocation = "<div class='drop-location text-center'></div>";
var dropJson = {
    "title":
    {
        "isText": true,
        "oneOnly": false,
        "htmlTag": "h1",
        "default": "Title"
    },
    "textbox":
    {
        "isText": true,
        "oneOnly": false,
        "htmlTag": "p",
        "default": "This is a text box <i>Enter text here...</i>"
    },
    "image":
    {
        "isText": false,
        "oneOnly": false,
        "menu":
        "<div class='image-toolbar form-group'>" +
            "<label for='image-url'>Image URL:</label>" +
            "<input type='text' name='image-url' class='image-url form-control'>" +
            "<br>" +
            "<label for='image-size'>Size:</label>" +
            "<input type='range' name='image-size' class='image-size form-control'>" +
            "<br>" +
            "<button onclick='loadImage($(this).parent())'>Update</button>" +
            deleteButton +
            downButton +
            upButton +
        "</div>"
    },
    "background-color":
    {
        "isText": false,
        "oneOnly": true,
        "menu":
        "<div class='background-color-toolbar form-group'>" +
            "<label for='color'>Select color...</label>" +
            "<input type='color' class='color' name='color' value='#ffffff' onchange='updateBackgroundColor(&quot;#&quot; + $(this).parent().parent().parent().parent().attr(&quot;id&quot;))' style='margin-left: 5px;'>" +
            deleteButton +
            downButton +
            upButton +
        "</div>"
    },
    "div":
    {
        "isText": false,
        "oneOnly": false,
        "menu":
        "<div class='background-color-toolbar form-group'>" +
            deleteButton + downButton + upButton +
        "</div>",
        "nestable": true
    },
    "font-family":
    {
        "isText": false,
        "oneOnly": true,
        "menu":
        "<div class='font-family-toolbar form-group'>" +
            "<label for='font-family'>Select font family...</label>" +
            "<select class='form-control font-family' name='font-family' onchange='updateFontFamily(&quot;#&quot; + $(this).parent().parent().parent().parent().attr(&quot;id&quot;))'>" +
                "<option value='arial'>Arial</option>" +
                "<option value='Open Sans'>Open Sans</option>" +
                "<option value='Ubuntu'>Ubuntu</option>" +
            "</select>" +
            deleteButton +
            downButton +
            upButton +
        "</div>"
    }
};

var dropBlock = {};
for (var i = 0; i < Object.keys(dropJson).length; i++) {
    var dropJsonElementName = Object.keys(dropJson)[i];
    if (dropJson[dropJsonElementName]["nestable"]) {
        nestCode = dropLocation;
    }
    else {
        nestCode = "";
    }
    if (dropJson[dropJsonElementName]["isText"]) {
        dropBlock[dropJsonElementName] =
        "<div class='element-wrapper' type='" + dropJsonElementName + "' >" +
            textBoxToolBar +
            "<" + dropJson[dropJsonElementName]["htmlTag"] + " class='result textbox' contenteditable='true'>" +
            dropJson[dropJsonElementName]["default"] +
            "</" +
            dropJson[dropJsonElementName]["htmlTag"].split(" ")[0] +
            ">" +
            nestCode +
        "</div>" +
        dropLocation;
    }
    else {
        dropBlock[dropJsonElementName] =
        "<div class='element-wrapper' type='" + dropJsonElementName + "' >" +
            dropJson[dropJsonElementName]["menu"] +
            "<div class='result'>" +
                nestCode +
            "</div>" +
        "</div>" +
        dropLocation;
    }
}

function updateId() {
    $("#canvas").find(".element-wrapper").each(function(index) {
        $(this).attr("id", index + 1);
    });
    $(".up, .down").css("display", "inline-block");
    $("#canvas").children(".element-wrapper").first().children().children(".up").css("display", "none");
    $("#canvas").children(".element-wrapper").last().children().children(".down").css("display", "none");
    $(".element-wrapper[type=div]").each(function(index) {
        $(this).find(".element-wrapper").first().find(".up").css("display", "none");
        $(this).find(".element-wrapper").last().find(".down").css("display", "none");
    });
}

function drag(event) {
    event.dataTransfer.setData("dropBlock", dropBlock[event.target.id]);
}

function drop(event) {
    var dropBlockElement = $($.parseHTML(event.dataTransfer.getData("dropBlock")));
    var dropBlockElementType = dropBlockElement.attr('type');
    if (dropJson[dropBlockElementType]["oneOnly"]) {
        if ($(event.target).siblings(".element-wrapper[type=" + dropBlockElementType + "]").length + $(event.target).children(".element-wrapper[type=" + dropBlockElementType + "]").length > 0) {
            return "Fail: Only one element allowed";
        }
    }
    event.preventDefault();
    if ($(event.target).hasClass("drop-location")) {
        $(event.target).after(event.dataTransfer.getData("dropBlock"));
    } else if ($(event.target).is("#canvas")) {
        $("#canvas").append(event.dataTransfer.getData("dropBlock"));
    }
    updateId();
}

function allowDrop(event) {
    event.preventDefault();
}

function up(elementWrapper) {
    $(elementWrapper).attr("id", parseInt($(elementWrapper).attr("id")) - 1);
    $(elementWrapper).prevAll(".element-wrapper:first").attr("id", parseInt($(elementWrapper).attr("id")) + 1);
    sort($(elementWrapper).parent());
    updateId();
}

function down(elementWrapper) {
    $(elementWrapper).attr("id", parseInt($(elementWrapper).attr("id")) + 1);
    $(elementWrapper).nextAll(".element-wrapper:first").attr("id", parseInt($(elementWrapper).attr("id")) - 1);
    sort($(elementWrapper).parent());
    updateId();
}

function sort(wrapperContainer) {
    htmlToBeAdded = dropLocation;
    var elementWrappers = $(wrapperContainer).children(".element-wrapper");
    elementWrappers.sort(function(a, b) {
        return parseInt($(a).attr("id")) - parseInt($(b).attr("id"));
    })
    elementWrappers.each(function(index) {
        htmlToBeAdded += $(this).prop("outerHTML") + dropLocation;
    });
    $(wrapperContainer).html(htmlToBeAdded);
}

function remove(elementWrapper) {
    $(elementWrapper).next().remove();
    $(elementWrapper).remove();
    updateId();
}

function exportToHTML() {
    var htmlArray = [];
    var finalBody = "";
    var finalCSS = "";
    $.each(cssAttributes, function(index1, value1) {
        finalCSS += index1 + "{";
        $.each(value1, function(index2, value2) {
            finalCSS += index2 + ":" + value2 + ";";
        });
        finalCSS += "}";
    })
    $("#canvas").find(".result").each(function() {
        htmlArray.push($(this).removeAttr("contenteditable"));
    });
    $.each(htmlArray, function(index, html) {
        finalBody += $(html).prop("outerHTML"); 
    });
    var finalHead = "<head><title>" + $("h1").first().text() + "</title><style>" + finalCSS + "</style></head>";
    return finalHead + finalBody;
}

function loadImage(formElement) {
    $(formElement).siblings(".result").html("<img src='" +
    $(formElement).children(".image-url").val() +
    "'/>");
    $(formElement).siblings(".result").children().css("width", $(formElement).children(".image-size").val() + "%");
}

function updateBackgroundColor(selector) {
    var realSelector = selector === "#undefined" ? "#canvas" : selector;
    if (realSelector == "#canvas") {
        $(realSelector).css("background-color", $(realSelector).children(".element-wrapper").children(".form-group").children("input.color").val());
    }
    else {
        $(realSelector).css("background-color", $(realSelector).find("input.color").val());
    }
    if (cssAttributes[realSelector] === undefined) {
        cssAttributes[realSelector] = {};
    }
    if (realSelector == "#canvas") {
        cssAttributes[realSelector]["background-color"] = $(realSelector).children(".element-wrapper").children(".form-group").children("input.color").val();
    }
    else {
        cssAttributes[realSelector]["background-color"] = $(realSelector).find("input.color").val();
    }
}

function updateFontFamily(selector) {
    var realSelector = selector === "#undefined" ? "#canvas" : selector;
    if (realSelector == "#canvas") {
        $(realSelector).css("font-family", $(realSelector).children(".element-wrapper").children(".form-group").children("select.font-family").val());
    }
    else {
        $(realSelector).css("font-family", $(realSelector).find("select.font-family").val());
        console.log($(realSelector).css("font-family"));
    }
    if (cssAttributes[realSelector] === undefined) {
        cssAttributes[realSelector] = {};
    }
    if (realSelector == "#canvas") {
        cssAttributes[realSelector]["font-family"] = $(realSelector).children(".element-wrapper").children(".form-group").children("select.font-family").val();
    }
    else {
        cssAttributes[realSelector]["font-family"] = $(realSelector).find("select.font-family").val();
    }
}

$(document).ready(function() {
    $("#drop-toolbox-offset").html($("#drop-toolbox").html());
});
