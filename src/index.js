/**
 * Created by Natallia on 4/3/2017.
 */

var parse = require('csv-parse'); //CSV file [arser
var $ = require('jQuery');

/*Load CSV file content and parse it*/
$( "#loadFile" ).click(function() {
    var inputFile = $("#inputFile")[0];
    if (inputFile.files && inputFile.files[0]){
        var file = inputFile.files[0];
        console.log("File", file);
        var fr = new FileReader(); // FileReader instance
        fr.readAsText(file);
        fr.onload = function () {
            parse( fr.result , {comment: '#'}, function(err, output){
                showInTable(output);
                generateResources(output);
            });
        };
    } else {
        alert("No CSV file selected!");
    }
});

/*Save generated content*/
$( "#saveFile" ).click(function() {
    var outputFile = $("#outputFile").val();
    var textToWrite = $( '#outputFileContent' ).text();
    saveTextAsFile(textToWrite, outputFile);
});

function showInTable(lines){
    $("#inputFileContent tr").remove();
    console.log(lines);
    for (var i = 0; i < lines.length; i++){
        var row = $("<tr />");
        for (var j = 0; j < lines[i].length; j++){
            var col = $("<td>" + lines[i][j] + "</td>");
            row.append(col);
        }
        console.log("Appeding row", i);
        $("#inputFileContent").append(row);
    }
}

/*Convert data to open physiology resources*/
function generateResources(input){
    //console.log("Processing data ", input);
    $( '#outputFileContent' ).text("Your generated REST API calls go here!");
}

/*Save text to a file with a given name and download it*/
function saveTextAsFile(textToWrite, fileNameToSaveAs){
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    if (!fileNameToSaveAs) {
        var fileNameToSaveAs = "output.txt";
    }
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.URL != null){
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    }
    downloadLink.click();
}


