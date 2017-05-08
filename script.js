var deleteButton = "<button onclick='remove($(this).parent().parent())' class='pull-right'>Delete</button>";
var upButton = "<button onclick='up($(this).parent().parent())' class='pull-right'>Up</button>";
var downButton = "<button onclick='down($(this).parent().parent())' class='pull-right'>Down</button>";
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
        "htmlTag": "h1",
        "default": "Title"
    },
    "textbox":
    {
        "isText": true,
        "htmlTag": "p",
        "default": "This is a text box <i>Enter text here...</i>"
    },
    "image":
    {
        "isText": false,
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
    }
};

var dropBlock = {};
for (var i = 0; i < Object.keys(dropJson).length; i++) {
    var dropJsonElementName = Object.keys(dropJson)[i];
    if (dropJson[dropJsonElementName]["isText"]) {
        dropBlock[dropJsonElementName] =
        "<div class='element-wrapper'>" +
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
        "<div class='element-wrapper'>" +
            dropJson[dropJsonElementName]["menu"] +
            "<div class='result'></div>" +
        "</div>" +
        dropLocation;
        console.log(dropBlock[dropJsonElementName]);
    }
}

function drag(event) {
    event.dataTransfer.setData("dropBlock", dropBlock[event.target.id]);
}

function drop(event) {
    event.preventDefault();
    if ($(event.target).hasClass("drop-location")) {
        $(event.target).after(event.dataTransfer.getData("dropBlock"));
        $(event.target).next(".element-wrapper").attr("id", parseInt($(event.target).prev(".element-wrapper").attr("id")) + 1);
        var prevThis;
        $("#canvas").children(".element-wrapper").each(function(index) {
            if ($(this).attr("id") == $(prevThis).attr("id")) {
                console.log("test")
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
    console.log($(elementWrapper).prevAll(".element-wrapper:first").attr("id"));
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
    var finalHTML = "";
    $("#canvas").find(".result").each(function() {
        htmlArray.push($(this).removeAttr("class").removeAttr("contenteditable"));
    });
    $.each(htmlArray, function(index, html) {
        finalHTML += $(html).prop("outerHTML"); 
    });
    return finalHTML;
}

$(document).ready(function() {
    $("#drop-toolbox-offset").html($("#drop-toolbox").html());
})
