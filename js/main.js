window.onload = function()
{
    'use strict';
    if ("serviceWorker" in navigator)
    {
        navigator.serviceWorker.register('/noter/sw.js');
    };
    loadData();
};

//class containing a single note entry
var delimiter="%25%25%25%25";
var delimiterstr="%%%%";
class Note
{
    constructor(number,type,text,isdone,tobedeleted,date)
    {
        this.number=number;
        this.type=type;
        this.text=text;
        this.isdone=(isdone=="true");
        this.tobedeleted=(tobedeleted=="true");
    this.date=date;
    };
    getName()
    {
        var divname="note"+this.number;
        return divname;
    };
    shade()
    {
        if( this.isdone==false){
            var divname=this.getName();
            var obj = document.getElementById(divname);
            obj.className="";
        };
        if( this.type=="Routine"){
            var divname=this.getName();
            var obj = document.getElementById(divname);
            obj.className="routine";
        };
        if( this.isdone==true){
            var divname=this.getName();
            var obj = document.getElementById(divname);
            obj.className="done";
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
        var routineclass="";
        var divstart="<div id=\""+divname+"\" >";
        var notetitle="Note "+this.number+" ";
        var notetype=""+this.type+": ";
        var notetext=" "+this.text+" ";
        var divend="</div>";
        var obj = document.getElementById("notes-printed");
        var button = "<div><button type=\"button\" onclick=\"fulfillNote("+this.number+")\">check</button>";
        var buttonRemove = "<button type=\"button\" onclick=\"clearNote("+this.number+")\">forget</button>";
        var buttonTop = "<button type=\"button\" onclick=\"toTop("+this.number+")\">to top</button></div>";
    var datenow = new Date();
    var datethen = new Date(this.date);
    var difftime = Math.floor(datethen - datenow);
    var diffdays = Math.floor(difftime / (1000 * 60 * 60 * 24));
    var noteeta = "";
    //magic numbers for now
    if(diffdays>-366 && diffdays<366){
        noteeta = "<br>due date on "+this.date+", in "+diffdays+" days";
    };
    if(diffdays<14){
            noteeta += "<br>!!! FOCUS !!!<br>" 
    }
        obj.innerHTML+=
            divstart
            //+notetitle
            +notetype
            +notetext
        +noteeta
            +divend
            +button
            +buttonRemove
            +buttonTop;
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
    +this.date+delimiter
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
function toTop(arg)
{
    var i=Number(arg)-1;
    const TempNotes = []; 
    for(var j=0; j<AllNotes.length ;j++){
        var element=AllNotes[j];
        TempNotes.push(element);
    }
    var s=AllNotes.length-1;
    for(var j=0, k=0; k<AllNotes.length ;j++,k++){
        AllNotes[j]=TempNotes[k];
        if(j==i){
            AllNotes[s]=TempNotes[k];
            j--;
            i=-1;//avoid standing in this event
        };
    }
    saveNotes();
    loadData();
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
                if(ss.length>=5){
                    var temp = new Note(notenum,ss[0],ss[1],ss[2],ss[3],ss[4]);
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
    saveNotes();
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
    var date = document.getElementById("note-date").value;
    tmp = new Note(notenum,category,text,false,false,date);
    AllNotes.push(tmp);

    //print all notes
    printNotes(AllNotes);
    saveNotes(AllNotes);

    //clear user input
    document.getElementById("note-text").value="";
}
