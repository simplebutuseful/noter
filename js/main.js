window.onload = function()
{
    'use strict';
    if ("serviceWorker" in navigator)
    {
        navigator.serviceWorker.register('/noter/sw.js');
    };
};

//class containing a single note entry
var delimiter="%25%25%25%25";
var delimiterstr="%%%%";
class Note
{
    constructor(number,type,text,isdone,tobedeleted)
    {
        this.number=number;
        this.type=type;
        this.text=text;
        this.isdone=(isdone=="true");
        this.tobedeleted=(tobedeleted=="true");
    };
    getName()
    {
        var divname="note"+this.number;
        return divname;
    };
    shade()
    {
        if( this.isdone==true){
            var divname=this.getName();
            var obj = document.getElementById(divname);
            obj.className="done";
        };
        if( this.isdone==false){
            var divname=this.getName();
            var obj = document.getElementById(divname);
            obj.className="";
        };
        if( this.tobedeleted==true){
            var divname=this.getName();
            var obj = document.getElementById(divname);
            obj.className="tobedeleted";
        };
    };
    show()
    {
        var divname=this.getName();
        var divstart="<div id=\""+divname+"\">";
        var notetitle="Note "+this.number+" ";
        var notetype=""+this.type+"<br>";
        var notetext=" "+this.text+" ";
        var divend="</div>";
        var obj = document.getElementById("notes-printed");
        var button = "<div><button type=\"button\" onclick=\"fulfillNote("+this.number+")\">check</button>";
        var buttonRemove = "<button type=\"button\" onclick=\"clearNote("+this.number+")\">forget</button></div>";
        obj.innerHTML+=
            divstart
            //+notetitle
            +notetype
            +notetext
            +divend
            +button
            +buttonRemove;
        this.shade();
    };
    save()
    {
        var days=1;
        if(this.tobedeleted==false){
        };
        if(this.tobedeleted==true){
            days=-1;
        };
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        var expires = ";expires="+date.toUTCString();
        document.cookie = "note"+this.number+"="
	+this.type+delimiter
	+this.text+delimiter
	+this.isdone+delimiter
	+this.tobedeleted+delimiter
	+expires+";path=/";
    };
};

//manage all notes
var notenum=1;
AllNotes = [];
function fulfillNote(arg)
{
    var i=Number(arg)-1;
    AllNotes[i].isdone=!(AllNotes[i].isdone);
    AllNotes[i].shade();
    AllNotes[i].save();
};

function clearNote(arg)
{
    var i=Number(arg)-1;
    AllNotes[i].tobedeleted=!(AllNotes[i].tobedeleted);
    AllNotes[i].shade();
    AllNotes[i].save();
};

//print all notes in the document
function printNotes(Notes)
{
    document.getElementById("notes-printed").innerHTML="";
    for(var i=(Notes.length - 1); i>=0 ;i--){
        AllNotes[i].show();
    }
}
function showCookies(){
    var data = decodeURIComponent(document.cookie);
    alert(data);
}
function loadNotes()
{
    notenum=1;
    var data = decodeURIComponent(document.cookie);
    var dataArray = data.split(';');
    AllNotes=[];
    for(var i=0; i<dataArray.length ;i++){
        var f=dataArray[i].indexOf("=");
        if(f>0){
            s=dataArray[i].substr(f+1);
            var ss = s.split(delimiterstr);
                if(ss.length>=4){
                    var temp = new Note(notenum,ss[0],ss[1],ss[2],ss[3]);
                    AllNotes.push(temp);
                    notenum++;
                };
        };
    }
}
function saveNotes()
{
    for(var i=0; i<AllNotes.length ;i++){
        AllNotes[i].save();
    }
}
function loadData()
{
    loadNotes();
    printNotes(AllNotes);
}
function resetRoutines()
{
    loadNotes();
    for(var i=0; i<AllNotes.length ;i++){
        if(AllNotes[i].type=="Routine")
        {
        AllNotes[i].isdone=false;
        };
    }
    saveNotes();
    printNotes(AllNotes);
}
function addNote()
{
    //load notes
    loadNotes();
    //add new note
    var category = document.getElementById("note-category").value;
    var text = document.getElementById("note-text").value;
    tmp = new Note(notenum,category,text,false,false);
    AllNotes.push(tmp);

    //print all notes
    printNotes(AllNotes);
    saveNotes(AllNotes);

    //clear user input
    document.getElementById("note-text").value="";
}
