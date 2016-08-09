var req;
var isIE;
var queryField;
var subjectidField;
var startField;
var endField;
var sampleField;
var completeLeadList;
var checkboxes;
var checkboxesChecked = [];
var vitGraphs = [];
var ecgGraphs = [];
var leadDefaults = [
       {name: 'ecg.I.uv', x: 0, y: 0, width: 4, height: 3},
       {name: 'ecg.II.uv', x: 4, y: 0, width: 4, height: 3},
       {name: 'ecg.III.uv', x: 8, y: 0, width: 4, height: 3},
       {name: 'ecg.aVF.uv', x: 0, y: 3, width: 4, height: 3},
       {name: 'ecg.aVL.uv', x: 4, y: 3, width: 4, height: 3},
       {name: 'ecg.aVR.uv', x: 8, y: 3, width: 4, height: 3},
       {name: 'vitals.heartRate.perMin.perMin', x: 0, y: 0, width: 6, height: 2},
       {name: 'vitals.expiredCO2.mmHg.perMin', x: 0, y: 6, width: 6, height: 2},
       {name: 'vitals.arterialPressureDiastolic.mmHg.perMin', x: 2, y: 0, width: 6, height: 2},
       {name: 'vitals.arterialPressureMean.mmHg.perMin', x: 2, y: 6, width: 6, height: 2}
   ];

function init() {
	getLeadContainer();
	appendLeadList();
	doQuery();
}

// findSelection was written to handle selections within radio button fields... not currently used.
function findSelection(field) {
    var test = document.getElementsByName(field);
    var sizes = test.length;
    for (i=0; i < sizes; i++) {
        if (test[i].selected===true) {
        return test[i].value;
	    }
	}
}

function sendHTTPRequest(i) {
    var httpRequest; // ** Local variable
    queryField = checkboxesChecked[i].value;
	var url = "tsd?action=query&id=" + escape(queryField) + "&subjectid=" + escape(subjectidField.value) + "&start=" + escape(startField.value) + "&end=" + escape(endField.value) + "&gsize=" + escape(sampleField.value); //generates url for callback on keystroke...
    httpRequest = initRequest();
    httpRequest.open("GET", url, true);
    // ** Callback specific to *this* request
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                // successful, call the callback
                callback(httpRequest);
            } else {
                // error, call the callback -- here we use null to indicate the error
                callback(null);
            }
        } else {
            // not ready
        }
    };
    httpRequest.send(null);
}

function doQuery() {
	getFormElements();
	$('#vitContainer').data('gridstack').removeAll();
	$('#ecgContainer').data('gridstack').removeAll();
	vitGraphs = [];
	ecgGraphs = [];
	for(i=0;i<checkboxesChecked.length;i++){
		sendHTTPRequest(i);
	}
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function initRequest() {
    if (window.XMLHttpRequest) {
        if (navigator.userAgent.indexOf('MSIE') != -1) {
            isIE = true;
        }
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        isIE = true;
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function callback(req) {
	parseMessages(req.responseXML);
}

function getLeadContainer(){
	completeLeadList = document.getElementById("selectorBox");
}

function getCheckedBoxes(chkboxName) {
	  checkboxes = document.getElementsByName(chkboxName);
	  checkboxesChecked = [];
	  // loop over them all
	  for (var i=0; i<checkboxes.length; i++) {
	     // And stick the checked ones onto an array...
	     if (checkboxes[i].checked) {
	        checkboxesChecked.push(checkboxes[i]);
	     }
	  }
	  return checkboxesChecked.length > 0 ? checkboxesChecked : null;
	}

function getFormElements(){
	var e = getCheckedBoxes("query-field");
	// hang on to lines that follow - processing for 'option' fields rather than 'checkboxes'
	//queryField = findSelection("query-field");
//	var e = document.getElementById("query-field");
//	if (e !== null){
//		var f = e.selectedIndex;
//		queryField = e.getElementsByTagName("option")[f].value;
//	}
	subjectidField = document.getElementById("subjectid-field");
	startField = document.getElementById("start-field");
	endField = document.getElementById("end-field");
	sampleField = document.getElementById("sample-field");
}

function appendLeadList() {
	var elementArray = {   // array of available leads: once we are querying tsd for these on per-subject basis, pass to function...
		"ecg.I.uv":"ecg I", 
		"ecg.II.uv":"ecg II", 
		"ecg.III.uv":"ecg III",
		"ecg.aVF.uv":"ecg aVF", 
		"ecg.aVL.uv":"ecg aVL",
		"ecg.aVR.uv":"ecg aVR", 
		"ecg.V1.uv":"ecg V1",
		"ecg.V2.uv":"ecg V2", 
		"ecg.V3.uv":"ecg V3",
		"ecg.V4.uv":"ecg V4", 
		"ecg.V5.uv":"ecg V5",
		"ecg.V6.uv":"ecg V6", 
		"vitals.heartRate.perMin.perMin":"heartRate perMin",
		"vitals.expiredCO2.mmHg.perMin":"expiredCO2 mmHg perMin",
		"vitals.arterialPressureDiastolic.mmHg.perMin":"arterialPressureDiastolic mmHg perMin", 
		"vitals.arterialPressureMean.mmHg.perMin":"arterialPressureMean mmHg perMin",
		"vitals.arterialPressureRate.perMin.perMin":"arterialPressureRate perMin", 
		"vitals.arterialPressureSystolic.mmHg.perMin":"arterialPressureSystolic mmHg perMin", 
		"vitals.centralVenousPressureMean.mmHg.perMin":"centralVenousPressureMean mmHg perMin"			
	};
    var list;
    var linkElement;
    var inputElement;
    
    list = document.createElement("list");
	list.id = "query-field";
	list.className = "query-selects"
	
	for (var key in elementArray){
		inputElement = document.createElement("input");
		inputElement.type = "checkbox";
		inputElement.name = "query-field";
		inputElement.value = key;
		/*for (var a = 0; a<leadDefaults.length; a++){
			console.log(leadDefaults[a].name);
		}*/
		for (var a in leadDefaults){
			if(key===leadDefaults[a].name){
				inputElement.checked = true;
				break;
			}
		}
        list.appendChild(inputElement);   	
	    list.appendChild(document.createTextNode(elementArray[key]));
	    list.appendChild(document.createElement("br"));
    }
    completeLeadList.appendChild(list); 
}

function getElementY(element){
    var targetTop = 0;
    if (element.offsetParent) {
        while (element.offsetParent) {
            targetTop += element.offsetTop;
            element = element.offsetParent;
        }
    } else if (element.y) {
        targetTop += element.y;
    }
    return targetTop;
}

function clearTable(elementToClean,tagID) {
    if (elementToClean.getElementsByClassName(tagID).length > 0) {
    	elementToClean.style.display = 'none';
        for (loop = elementToClean.childNodes.length -1; loop >= 0 ; loop--) {
        	elementToClean.removeChild(elementToClean.childNodes[loop]);
        }
    }
}

function parseMessages(response) {
    if (response == null) {
        return false;
    } else {
    	//console.log(response);
    	xmlDoc = response;
    	wfID = getParameterByName("id", xmlDoc.URL);
    	var txt = "";
    	x = xmlDoc.getElementsByTagName("rawdata");
    	for (i = 0; i < x.length; i++){
    		if (x[i].firstChild.nodeValue !== "undefined"){
    			txt += x[i].firstChild.nodeValue;
    		}
    	}
        if (txt.length !== 0){
        	renderGraphDiv(wfID,txt);
        }
    }
}

//accepts 1> div to render graph to and 2> returned query text. 
//Function constructs div for waveform, processes raw text into dygraph parseable array, 
//generates dygraph and appends to page.
function renderGraphDiv(wfID,txt){  
	var wfIDcanvas = wfID + "-canvas";
	var wfIDcontainer = wfID + "-container";
	var graphContainer = wfID.substring(0,3) + "Container";
	var gridstackContainers = document.getElementsByClassName("grid-stack-item");
	var waveformContainer = document.getElementById(graphContainer);
	var gsStackItemDiv;
    var gsStackItemContentDiv;
    var gsItemContenth4;
    var gsItemContentCanvas;
    
	if (!graphies){
		var graphies = []; 
	}
	txt = txt.slice(1);
	txt = txt.slice(0, txt.length -1);
	var roughSegments = [];  // holds individual element text chunks while processing into multi-dimensional array
	roughSegments = txt.split("],[");
	var dataToRender = [];  // final correctly formatted array to pass along to dygraph
	for (var i = 0; i < roughSegments.length; i++){
    	var singleEntry = [];  // holds each date/value pair before processing
    	var singleElement = [];   // holds each date/value pair after processing
    	singleEntry = roughSegments[i].split(",");
    	for (var j = 0; j < singleEntry.length; j++){
    		switch (j){
    		case 0: // s/b more error handling > array[0] is the date object
    			var b = singleEntry[j].replace(" ", "T").replace(/\//g,"-");
    		    var a = new Date(b);
    			singleElement.push(a);
    			break;
    		case 1:// s/b more error handling > array[1] is the value in string form
    			var b = parseInt(singleEntry[j]);
    			singleElement.push(b);
    			break;
    		default:
    			break;
    		}
    	}
    	dataToRender.push(singleElement);
	}

    var gridD = $('#'+graphContainer+'.grid-stack').data('gridstack');

    switch(graphContainer){   //  grx = node.x, gry = node.y, grw = node.width, grh = node.height
	    case"vitContainer":
	    	var grX = 0;
	        var grY = 0;
	        var grW = 6;
	        var grH = 2;
	        break;
	    case"ecgContainer":
	    	var grX = 0;
	        var grY = 0;
	        var grW = 4;
	        var grH = 3;
	        break;
	    default:
	    	var grX = 0;
	        var grY = 0;
	        var grW = 4;
	        var grH = 3;
	        break;
    }
    var spaceBool = false;
    for (var i = 0; i<100 && spaceBool === false; i++){
    	if (gridD.isAreaEmpty(grX,grY,grW,grH)){
    		spaceBool = true;
    	}else if(grX < (12 - grW)){
    		grX += grW;
    	}else{
    		grX = 0;
    		grY += grH;
    	}           	
    }
    gsStackItemDiv = document.createElement("div");
    gsStackItemDiv.className = "grid-stack-item";
    gsStackItemDiv.id = wfIDcanvas;
    gsStackItemContentDiv = document.createElement("div");
    gsStackItemContentDiv.className = "grid-stack-item-content";
    gsItemContenth4 = document.createElement("h4");
    gsItemContenth4.className = "draghandle";
    gsItemContenth4.appendChild(document.createTextNode(wfID));
    gsItemContentCanvas = document.createElement("div");
    gsItemContentCanvas.className = "div_g";
    gsItemContentCanvas.id = wfID;
    gsStackItemContentDiv.appendChild(gsItemContenth4);
    gsStackItemContentDiv.appendChild(gsItemContentCanvas);
    gsStackItemDiv.appendChild(gsStackItemContentDiv);
    gridD.addWidget(gsStackItemDiv, grX, grY, grW, grH);
	
    if (wfID.substring(0,3)==="vit"){
    	graphPush(vitGraphs,dataToRender);
    }else{
    	graphPush(ecgGraphs,dataToRender);
    }
    
}

function graphPush(g,data){
	g.push( new Dygraph(
	        document.getElementById(wfID),
	        data,{
	        	labels:["Time","uV"], 
	        	xlabel:["Time"],
	        	ylabel:["uV"]
	        	
	        }
	        )
		);
}

function syncGraphs() {
    Dygraph.synchronize(vitGraphs, {zoom: true, selection: true, range: false});
    Dygraph.synchronize(ecgGraphs, {zoom: true, selection: true, range: false});
}


function activateResize(){
	var ecgClass = document.getElementsByClassName('ui-icon-gripsmall-diagonal-se');
	for (var i = 0; i < ecgClass.length; i++) {
	    console.log("something exists");
		ecgClass[i].addEventListener('click', resizeGraphs);
	}
}

function resizeGraphs() {
	//alert("trying to resize");
	for(var i = 0; i < vitGraphs.length; i++){
		vitGraphs[i].resize();
	}
  }


function collapseControlText(){
	var lookup = document.getElementById("queryOptions");
	if (lookup.className ==="row in"){
		var buttonMod = document.getElementById("collapseOptions");
		buttonMod.innerHTML = "View Query Controls";
	}else{
		var buttonMod = document.getElementById("collapseOptions");
		buttonMod.innerHTML = "Hide Query Controls";
	}
}