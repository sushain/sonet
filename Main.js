//*******************************************************
// Sonet v1.0
// Written by Sushain Pandit (sushain.pandit@gmail.com)
//*******************************************************
// Share or Remix it but please attribute the author
// Distributed as is; no liabilities whatsoever
//*******************************************************
// Last Modified: 17-04-2006
//*******************************************************

var surface;
var relationships;
var nodeList;
var data;

var dragStart = false;

var Relationship = function(id, rel, line, coords, value,from,to,data){
	this.id = id;
	this.rel = rel;
	this.line = line;
	this.coords = coords;
	this.value = value;
	this.from = from;
	this.to = to;	
	this.data=data;
}

var ShapeConstants = function(){
}
ShapeConstants.lineSize = 150;
ShapeConstants.rSize = {width:70,height:30};	
ShapeConstants.boxFill = [159,186,253];
ShapeConstants.font = {family: "Times", size: "10pt", weight: "bold"};
ShapeConstants.textFill =  "black";
ShapeConstants.textStroke = "red";
//ShapeConstants.lineStyle = {"style": "Solid", "width": 3, "color":[159,186,253,0.4],"opacity":0.4};
ShapeConstants.lineStyle = {"style": "Solid", "width": 3, "color":"black","opacity":0.4};
ShapeConstants.colors = {startNode: "#ff5555", visited: "#ff925e", selected:"#f57ed8"};

var Node = function(id,surface,coords,parent,url,data){

	this.id = id;
	this.surface=surface;
	this.coords=coords;
	
	this.rect;
	this.text;
	this.group;
	
	this.parent = parent;
	this.node = this;
	
	this.relationships = new dojox.collections.ArrayList();
	this.url=url;
	this.data = data;
	this.textVal = data;
	this.div;
	this.pMenu;
	
}

Node.prototype.getData = function(){
}

Node.prototype.createNode = function(){
	var rectCoords = getRectCoords(this.coords);
	
	this.group = this.surface.createGroup();
	this.group.getEventSource().setAttribute("id","group_"+this.id);
	
	this.text = this.group.createText({x: rectCoords.x+3,y: rectCoords.y + 18, text: this.textVal, align: "center"});
	this.text.setFill(ShapeConstants.textFill);
	this.text.setFont(ShapeConstants.font);
	this.text.getEventSource().setAttribute("id","text_"+this.id); 

	var textWidth = this.text.getTextWidth();
	var color = ShapeConstants.boxFill;
	
	/*if(this.id == "706120516930075047"){
		color = ShapeConstants.colors.startNode;
	}*/
	this.rect = this.group.createRect({x: rectCoords.x,y: rectCoords.y, width: ShapeConstants.rSize.width, height: ShapeConstants.rSize.height}).setFill(color);
	//this.rect = this.group.createRect({x: rectCoords.x,y: rectCoords.y, width: this.text.getTextWidth()+9, height: ShapeConstants.rSize.height}).setFill(ShapeConstants.boxFill);
	this.rect.getEventSource().setAttribute("id","rect_"+this.id);
	this.rect.moveToFront();
	this.text.moveToFront();
	new dojox.gfx.Moveable(this.group); 
	
	//if(!dojo.byId("menu_"+this.id)){
		this.pMenu = new dijit.Menu({targetNodeIds:["group_"+this.id], id:"menu_"+this.id});
		this.pMenu.addChild(new dijit.MenuItem({label:"View party relaitonships", id:this.id, onClick:function(){fetchRelations(this.id)}}));
		//var pSubMenu = new dijit.Menu({parentMenu:this.pMenu, id:"progSubMenu"});
		this.pMenu.addChild(new dijit.MenuItem({label:"View party details", id:"disp_"+this.id, onClick:function(){displayPartyDetails(this.id)}}));
		//this.pMenu.addChild(new dijit.MenuItem({label:"Hide", id:"remove_"+this.id, onClick:function(){hidePartyDetails(this.id)}}));
	//} else {
	//	pMenu = dojo.byId("menu_"+this.id);	
	//}

	dojo.connect(this.text.getEventSource(),"onclick",fetchRelations);
	dojo.connect(this.group.getEventSource(),"onmousedown",trackMouseDown);
	dojo.connect(this.group.getEventSource(),"onmousemove",trackMouseMove);
	dojo.connect(this.group.getEventSource(),"onmouseup",trackMouseUp);  

}

function trackMouseDown(evt){
	dragStart = true;
}

function trackMouseUp(evt){
	dragStart = false;
}

function trackMouseMove(evt){

	if(dragStart){
		
		var node = getNode(splitId(evt.target.id));
		
		var tempCenter = node.coords;
		var coords = getTransformation(node);
		var dx = coords.x;
		var dy = coords.y;
		
		var newC = {x: coords.cx,y: coords.cy};
		
		var relationships = node.relationships;

		var itr = relationships.getIterator();
		var index = 0;
		while(!itr.atEnd()){

			var rel = itr.get();
			var line = rel.line;
			var id = rel.id;
			var json = rel.data;		
			
			var temp = getRelationship(id);
			
			if(!temp){
				continue;
			}
			var lineCoords = rel.coords;
			var x1 = lineCoords.x1;var y1 = lineCoords.y1;
			var x2 = lineCoords.x2;var y2 = lineCoords.y2;
			
			var newCoords;
			if(Math.round(tempCenter.x) == x1 && Math.round(tempCenter.y) == y1){
				x1 = newC.x;y1 = newC.y;
			} else if (Math.round(tempCenter.x) == x2 && Math.round(tempCenter.y) == y2){
				x2 = newC.x;y2 = newC.y;
			}
			
			line.removeShape(true);
			
            var type = 14;
            
			var index = 0;
			if(type <= 11){
				index = 0;	
			} else if (type >= 15 && type <= 18){
				index = 1;
			} else if(type == 14) {
				index = 2;	
			} else {
				index = 3;	
			}
			var style = styles[index];
			ShapeConstants.lineStyle.style = style;
			
			line = surface.createLine({"x1":x1,"y1":y1,"x2":x2,"y2":y2}).setStroke(ShapeConstants.lineStyle);
			line.getEventSource().setAttribute("id",id);
			line.moveToBack();
//			dojo.connect(line.getEventSource(),"onmouseover",displayRelationShip);
			dojo.connect(line.getEventSource(),"onclick",displayRelationShip);
//			dojo.connect(line.getEventSource(),"onmouseout",hideRelationship);

			rel.line = line;
			
			rel.coords = {x1:x1,y1:y1,x2:x2,y2:y2};
			index++;	
		}
	}
}


function fetchRelations(e){
  var nodeId = e;
//	var nodeId = e.target.id;
//	var node = getNode(splitId(nodeId));
	var node = getNode(nodeId);
	var url = partyRelURL+splitId(nodeId);
	console.debug("url " + url);
	
	/*var val = dojo.xhrGet({
		url: url,
        handleAs: "xml",
        timeout: 5000, //Time in milliseconds
        handle: function(response, ioArgs){
	        var memberArr=response.documentElement.getElementsByTagName("member");
	        fetchRelationships(e,memberArr);
        }
	});*/
    
    if (nodeId % 3 == 0) {
        
        memberArr = new Array ("8", "9", "10");
    }
    
    else if (nodeId % 2 == 0) {
    
        memberArr = new Array ("5", "6", "7");
    }
    
    else {
        
        memberArr = new Array ("1", "2", "3", "4");
    }
    
    fetchRelationships (e,memberArr);
}

function fetchRelationships(e,memberArr){
	fetchChildren(e,memberArr);
}

function fetchChildren(e,data){

	//var nodeId = e.target.id;
	var nodeId = e;
	//var node = getNode(splitId(nodeId));
	var node = getNode(nodeId);
	var len = data.length;
	
	var degrees = 360/len;
	var degree = 0; 

	var cx,cy;
	if(node){
		cx = node.coords.x;
		cy = node.coords.y;
	}

	for(var i=0;i<len;i++){
	
		degree += degrees;

		/*var memberHref = data[i].getAttribute("href");
		memberHref = memberHref.replace("127.0.0.1","localhost");
		memberHref = memberHref.replace("xml","json");*/
		//console.debug("Member " + memberHref);
		call(e,{cx:cx,cy:cy},degree,data[i]);
	}
}

function call(e,coords,degree,href){
		/*var val = dojo.xhrGet({
		url: href,
        handleAs: "json",
        timeout: 5000, //Time in milliseconds
        handle: function(response, ioArgs){
	        buildRelationship(e,response,coords,degree);
        }
		});*/
        
        buildRelationship(e,href,coords,degree);
}


function buildRelationship(e,json,coords,degree){

	//var nodeId = e.target.id;
	var nodeId = e;
//	var node = getNode(splitId(nodeId));
	var node = getNode(nodeId);
	cx = node.coords.x;cy=node.coords.y;
	var xp = Math.round(cx + (ShapeConstants.lineSize * Math.cos((degree * Math.PI)/180))); 
	var yp = Math.round(cy + (ShapeConstants.lineSize * Math.sin((degree * Math.PI)/180))); 
	
	var relationshipText="";
    
	if(json != null){
	
		relationshipText += json;
        
        fromPartyId = nodeId;
        
        toPartyId = json;
    }

	/*else {
	
		//changeonce sushain changes the code .. from and to 
		fromPartyId = json.TCRMPartyRelationshipBObj.RelationshipToPartyId;
		toPartyId = json.TCRMPartyRelationshipBObj.RelationshipFromPartyId;
		relationshipText = json.TCRMPartyRelationshipBObj.RelationshipValue;
	}*/
    
    var type = 14;
    
	var index = 0;
	if(type <= 11){
		index = 0;	
	} else if (type >= 15 && type <= 18){
		index = 1;
	} else if(type == 14) {
		index = 2;	
	} else {
		index = 3;	
	}
    
    console.debug ("index" + index);
    
	var style = styles[index];
	ShapeConstants.lineStyle.style = style;
	
	var relId = fromPartyId+"_"+toPartyId;
	if(getRelationship(relId))
		return;
	
	var n = getNode(toPartyId);

	var flag = true;
	var line;
	if(n){
		xp = n.coords.x;
		yp = n.coords.y;
		flag = false;
	}

	var lineCoords = {"x1":cx,"y1":cy,"x2":xp,"y2":yp};
	
	if(xp <= 8 && yp >= 8){
		xp = 8;	
	} else if(xp >=8 && yp <= 8){
		yp = 8;	
	} else if(xp <= 8 && yp <= 8){
		xp=8;yp=8;	
	} else if(xp >= screen.width-8 && yp <= screen.height-8){
		xp = screen.width-15;	
	} else if(xp <= screen.width-8 && yp >= screen.height-8){
		yp = screen.height-15;	
	} else if(xp >= screen.width-8 && yp >= screen.height-8){
		xp = screen.width-15;	
		yp = screen.height-15;	
	}
	
	var line = surface.createLine(lineCoords).setStroke(ShapeConstants.lineStyle);
	line.getEventSource().setAttribute("id",relId);
	line.moveToBack();
//	dojo.connect(line.getEventSource(),"onmouseover",displayRelationShip);
	dojo.connect(line.getEventSource(),"onclick",displayRelationShip);
//	dojo.connect(line.getEventSource(),"onmouseout",hideRelationship);
	
	var rel = new Relationship(relId,null,line,lineCoords,relationshipText,fromPartyId,toPartyId,json);
	relationships.add(rel);

	if(flag)
		loadPartyRelationship(toPartyId,partyURL,{x:xp,y:yp},rel);
	else {
		n.relationships.add(rel);
	}
	
	node.relationships.add(rel);
}

function displayRelationShip(evt){
	
	var id = evt.target.id;
	console.debug("Party Id : " + id);
	
	var line = dojo.byId(id);
	
	var rel = getRelationship(id);
	showPopup(rel);
}

function getTransformation(obj){
	
	var rect = obj.rect;
	var coords = rect.getTransformedBoundingBox();
	var cx = coords[0].x+((coords[1].x - coords[0].x)/2);
	var cy = coords[0].y+((coords[2].y - coords[0].y)/2);

	obj.coords = {x:cx,y:cy};
	return {x:coords[0].x,y:coords[0].y,cx:cx,cy:cy};
}

function splitId(str){
	
	var temp = str.split("_");
	var id = temp[temp.length-1];
	
	return id;
}

function getRectCoords(coords){
	var node = getNode(id);
	var x = coords.x - (ShapeConstants.rSize.width/2);
	var y = coords.y - (ShapeConstants.rSize.height/2);
	
	return {x:x,y:y};
}

function getCenter(rect) {
	
	var x = Math.round(rect.shape.x + (rect.shape.width/2));
	var y = Math.round(rect.shape.y + (rect.shape.height/2));
	
	return {x:x,y:y};
}

function getCenterForCoords(coords) {
	
	var x = Math.round(coords.dx + (ShapeConstants.rSize.width/2));
	var y = Math.round(coords.dy + (ShapeConstants.rSize.height/2));
	
	return {x:x,y:y};
}

function getNode(id){
	
	var itr = nodeList.getIterator();
	var obj;
	var temp;
	
	while(!itr.atEnd()){
		obj = itr.get();
		if(obj.id == id){
			temp = obj;
		}	
	}
	
	return temp;
}

function removeNode(id){
	var itr = nodeList.getIterator();
	var obj;
	var temp;
	var inc = 0;	
	while(!itr.atEnd()){
		obj = itr.get();
		if(obj.id == id){
			nodeList.removeAt(inc);
			break;
		}	
		inc++;
	}
	
}

function removeRelationship(id){

	var itr = relationships.getIterator();
	var obj;
	var inc = 0;
	
	while(!itr.atEnd()){
		obj = itr.get();
		if(obj.id == id){
			relationships.removeAt(inc);
			break;
		}
		inc++;
	}
}

function getRelationship(id){

	var itr = relationships.getIterator();
	var obj;
	
	var temp = null;
	while(!itr.atEnd()){
		obj = itr.get();
		if(obj.id == id){
			temp = obj;
		}
	}
	return temp;	
}

function showPopup(rel){
	
	var div = document.getElementById("rel1");	
	
	var x1 = rel.coords.x1;
	var x2 = rel.coords.x2;
	var y1 = rel.coords.y1;
	var y2 = rel.coords.y2;
	
	var xp = x1 + (x2-x1)/2;
	var yp = y1 + (y2-y1)/2; 
	div.style.top = yp;
	div.style.left = xp;
	div.style.visibility = "visible";
	div.innerHTML = "<TABLE width = '100%'><TR><TD align = 'right'><A href='javascript:hideRelationship()'><img src = './tabClose.gif'/></A></TD></TR><TR><TD class = 'normal'>" + rel.value + "</TD></TR>";
}

function hideRelationship(){
	var div = document.getElementById("rel1");	
	div.style.visibility = "hidden";
}
//Move this code to loadParty
loadPartyRelationship = function(id,url,coords,rel){
	var progress = document.getElementById("indeterminateBar1");
	progress.style.top = center.y;
	progress.style.left = center.x;
	progress.style.visibility = "visible";
	
    /*var val = dojo.xhrGet({
		url: "http://localhost:9083/MDMRestService/party/json/"+id,
        handleAs: "json",
        timeout: 5000, //Time in milliseconds
        handle: function(response, ioArgs){
	        createPartyRelNode(id,url,coords,response,rel);
        }
	});*/
    
    createPartyRelNode(id,url,coords,id+"",rel);
}

createPartyRelNode = function(id,url,coords,data,rel){
	var progress = document.getElementById("indeterminateBar1");
	progress.style.visibility = "hidden";
	var n = new Node(id,surface,coords,null,url,data);
	n.createNode();
	n.relationships.add(rel);
	nodeList.add(n);
}

//Data Handler
loadParty = function(id,url,coords){
	var progress = document.getElementById("indeterminateBar1");
	progress.style.top = center.y;
	progress.style.left = center.x;
	progress.style.visibility = "visible";
	/*var val = dojo.xhrGet({
		url: "http://localhost:9083/MDMRestService/party/json/"+id,
        handleAs: "json",
        timeout: 5000, //Time in milliseconds
        handle: function(response, ioArgs){
	        createNode(id,url,coords,response);
        }
	});*/
    response = "Root";
    createNode(id,url,coords,response);
}

createNode = function(id,url,coords,data){
	var progress = document.getElementById("indeterminateBar1");
	progress.style.visibility = "hidden";
	var n = new Node(id,surface,coords,null,url,data);
	n.createNode();
	this.nodeList.add(n);
}

displayPartyDetails = function(id){
	var div = document.getElementById("div1");
	var node = getNode(splitId(id));
	var data = node.data;
	document.getElementById("partyId").innerHTML = data;
	document.getElementById("partyName").innerHTML = "Name" + data;
	document.getElementById("dob").innerHTML = "DOB" + data;
	var w = 400/2;
	var h = 100/2;
	var x = node.coords.x - w;
	var y = node.coords.y - h;
	
	div.style.top = y;
	div.style.left = x; 
	dojo.fadeIn({ node: 'div1', duration: 5000,onBegin: function(){div.style.visibility = "visible"} }).play(); 
	//div.style.visibility = "visible"; 

}

/*hidePartyDetails = function(id){
	
	var node = getNode(splitId(id));	
	node.group.removeShape(true);
	//node.pMenu = null;	
	var relationships = node.relationships;

	var itr = relationships.getIterator();
	var index = 0;
	while(!itr.atEnd()){
		
		var rel = itr.get();
		var line = rel.line;
		removeRelationship(rel.id);
		line.removeShape(true);
		index++;	
	}
	removeNode(splitId(id));
	//dojo._destroyElement(dojo.byId("menu_"+id));
	
}*/










