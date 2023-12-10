window.onload = function()
{
    'use strict';
    if ("serviceWorker" in navigator)
    {
        alert("registering service worker");
        navigator.serviceWorker.register('/noter/sw.js');
    };
};

var notenum=1;
function addNote()
{
    var category = document.getElementById("note-category").value;
    var text = document.getElementById("note-text").value;
    document.cookie = "note"+notenum+"="+category+text;
    var data = decodeURIComponent(document.cookie);
    alert(data);
    notenum++;
}
