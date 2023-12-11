window.onload = function()
{
    'use strict';
    if ("serviceWorker" in navigator)
    {
        navigator.serviceWorker.register('/noter/sw.js');
    };
};

//class containing a single note entry
class Note
{
    constructor(number,type,text)
    {
        this.number=number;
        this.type=type;
        this.text=text;
    };
    getName()
    {
        var divname="note"+this.number;
        return divname;
    };
    show()
    {
        var divname=this.getName();
        var divstart="<div id=\""+divname+"\">";
        var notetitle="Note "+this.number+" ";
        var notetype="Type: "+this.type+"<br>";
        var notetext=" "+this.text+" ";
        var divend="</div>";
        var obj = document.getElementById("notes-printed");
    var button = "<div><button type=\"button\" onclick=\"fulfillNote("+this.number+")\">check</button></div>";
    obj.innerHTML+=
            divstart
            +notetitle
            +notetype
            +notetext
            +divend
        +button;
    };
    done()
    {
        var divname=this.getName();
        var obj = document.getElementById(divname);
    obj.classList.toggle("done");
    };
};

//manage all notes
var notenum=1;
AllNotes = [];
function fulfillNote(arg)
{
    var i=Number(arg)-1;
    AllNotes[i].done();
};
function printNotes(Notes)
{
    document.getElementById("notes-printed").innerHTML="";
    for(var i=(Notes.length - 1); i>=0 ;i--){
        AllNotes[i].show();
    }
}
function addNote()
{
    //add new note
    var category = document.getElementById("note-category").value;
    var text = document.getElementById("note-text").value;
    tmp = new Note(notenum,category,text);
    AllNotes.push(tmp);

    //print all notes
    printNotes(AllNotes);

    //document.cookie = "note"+notenum+"="+category+text;
    //var data = decodeURIComponent(document.cookie);
    //alert(data);
    notenum++;
}
