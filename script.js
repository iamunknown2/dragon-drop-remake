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
        "<div class='image-toolbar form-group'>" +
            "<label for='color'>Select color...</label>" +
            "<input type='color' class='color' name='color form-control' onchange='updateBackgroundColor()'>" +
            deleteButton +
            downButton +
            upButton +
        "</div>"
    }
};

var dropBlock = {};
for (var i = 0; i < Object.keys(dropJson).length; i++) {
    var dropJsonElementName = Object.keys(dropJson)[i];
    if (dropJson[dropJsonElementName]["isText"]) {
        dropBlock[dropJsonElementName] =
        "<div class='element-wrapper' type='" + dropJsonElementName + "'>" +
            textBoxToolBar +
            "<" + dropJson[dropJsonElementName]["htmlTag"] + " class='result textbox' contenteditable='true'>" +
            dropJson[dropJsonElementName]["default"] +
            "</" +
            dropJson[dropJsonElementName]["htmlTag"].split(" ")[0] +
            ">" +
        "</div>" +
        dropLocation;
    }
    else {
        dropBlock[dropJsonElementName] =
        "<div class='element-wrapper' type='" + dropJsonElementName + "'>" +
            dropJson[dropJsonElementName]["menu"] +
            "<div class='result'></div>" +
        "</div>" +
        dropLocation;
    }
}

function drag(event) {
    event.dataTransfer.setData("dropBlock", dropBlock[event.target.id]);
}

function drop(event) {
    var dropBlockElement = $($.parseHTML(event.dataTransfer.getData("dropBlock")));
    var dropBlockElementType = dropBlockElement.attr('type');
    if (dropJson[dropBlockElementType]["oneOnly"]) {
        if ($("#canvas").children(".element-wrapper[type=" + dropBlockElementType + "]").length > 0) {
            return "Fail: Only one element allowed";
        }
    }
    event.preventDefault();
    if ($(event.target).hasClass("drop-location")) {
        $(event.target).after($('<div/>').html(event.dataTransfer.getData("dropBlock")));
        $(event.target).next(".element-wrapper").attr("id", parseInt($(event.target).prev(".element-wrapper").attr("id")) + 1);
        var prevThis;
        $("#canvas").children(".element-wrapper").each(function(index) {
            if ($(this).attr("id") == $(prevThis).attr("id")) {
                $(this).attr("id", parseInt($(this).attr("id")) + 1);
            }
            prevThis = this;
        });
    } else if ($(event.target).is("#canvas")) {
        $("#canvas").append(event.dataTransfer.getData("dropBlock"));
        $("#canvas").children(".element-wrapper").last().attr("id", $("#canvas").children(".element-wrapper").length);
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function loadImage(formElement) {
    $(formElement).siblings(".result").html("<img src='" +
    $(formElement).children(".image-url").val() +
    "'/>");
    $(formElement).siblings(".result").children().css("width", $(formElement).children(".image-size").val() + "%");
}

function remove(elementWrapper) {
    $(elementWrapper).next().remove();
    $(elementWrapper).remove();
}

function sort() {
    htmlToBeAdded = "";
    $("#canvas").children(".element-wrapper").each(function(index) {
        htmlToBeAdded += $("#" + (index + 1).toString()).prop("outerHTML") + dropLocation;
    });
    $("#canvas").html(htmlToBeAdded);
}

function up(elementWrapper) {
    $(elementWrapper).attr("id", parseInt($(elementWrapper).attr("id")) - 1);
    $(elementWrapper).prevAll(".element-wrapper:first").attr("id", parseInt($(elementWrapper).attr("id")) + 1);
    sort();
}

function down(elementWrapper) {
    $(elementWrapper).attr("id", parseInt($(elementWrapper).attr("id")) + 1);
    $(elementWrapper).nextAll(".element-wrapper:first").attr("id", parseInt($(elementWrapper).attr("id")) - 1);
    sort();
}

function exportToHTML() {
    var htmlArray = [];
    var finalBody = "";
    $("#canvas").find(".result").each(function() {
        htmlArray.push($(this).removeAttr("contenteditable"));
    });
    $.each(htmlArray, function(index, html) {
        finalBody += $(html).prop("outerHTML"); 
    });
    var finalHead = "<head><title>" + $("h1").first().text() + "</title></head>";
    return finalHead + finalBody;
}

function updateBackgroundColor() {
    $("#canvas").css("background-color", $("#canvas").find("input.color[type=color]").val());
}

$(document).ready(function() {
    $("#drop-toolbox-offset").html($("#drop-toolbox").html());
})
