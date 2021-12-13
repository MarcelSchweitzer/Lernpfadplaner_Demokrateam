//Alle Interaktionstypen Auswählen
function selectAll(name){
    var category=document.getElementsByName(name);
    for(var i=0; i<category.length; i++){
        if(category[i].type=='checkbox')
            category[i].checked=true;
    }
}
//Alle Interaktionstypen Abwählen
function UnSelectAll(name){
    var category=document.getElementsByName(name);
    for(var i=0; i<category.length; i++){
        if(category[i].type=='checkbox')
            category[i].checked=false;
    }
}
//Alle Interaktionstypen Aus-/Ab-wählen
function toggleSelect(name){
    var category=document.getElementsByName(name);
    for(var i=0; i<category.length; i++){
        if(category[i].type=='checkbox')
            if(category[i].checked==false)
                category[i].checked=true;
            else
                category[i].checked=false;
    }
}
//Anzeige Toggel der Kategoriens
function toggleCategoies(name){
    document.getElementById("global-i").style.visibility='hidden';
    document.getElementById("h5p-i").style.visibility='hidden';
    document.getElementById("moodle-i").style.visibility='hidden';
    document.getElementById("ilias-i").style.visibility='hidden';
    document.getElementById("adobeCaptivate-i").style.visibility='hidden';
    document.getElementById("3DVista-i").style.visibility='hidden';
    document.getElementById(name).style.visibility="visible";
}