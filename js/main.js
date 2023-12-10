window.onload = function()
{
    if ("serviceWorker" in navigator)
    {
        navigator.serviceWorker.register('./sw.js');
    };
};

var notenum=1;
function addNote(){
    var category = document.getElementById("note-category").value;
    var text = document.getElementById("note-text").value;
    document.cookie = "note"+notenum+"="+category+text;
    var data = decodeURIComponent(document.cookie);
    alert(data);
    notenum++;
}
