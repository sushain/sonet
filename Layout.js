//*******************************************************
// HierarchyLayout v1.0
// Written by Sushain Pandit (sushain.pandit@gmail.com)
//*******************************************************
// Share or Remix it but please attribute the author
// Distributed as is; no liabilities whatsoever
//*******************************************************
// Created: 17-04-2006
//*******************************************************

var globalAlignment;

var HierarchyLayout = function (doc, parentNode, alignment) {

    this.x_coor_for_north = 100;

    this.y_coor_for_north = 10;

    this.x_coor_for_south = 100;

    this.y_coor_for_south = self.innerHeight - 100;

    this.x_coor_for_east = self.innerWidth - 100;

    this.y_coor_for_east = 50;

    this.x_coor_for_west = 100;

    this.y_coor_for_west = 50;

    this.x_coor_for_center = self.innerWidth / 2;

    this.y_coor_for_center = 50;

    this.document = doc;

    this.x_gap = 50;

    this.y_gap = 30;

    this.type = alignment;

    globalAlignment = alignment;

    // added for vertical & horizontal hierarchy layouts

    if (alignment == 'vertical') {

        parentNode.coords.x = self.innerWidth / 2;

        parentNode.coords.y = 100;
    }

    else {

        parentNode.coords.x = 50;

        parentNode.coords.y = self.innerHeight / 2;
    }
}


function HierarchyLayout (parentNode, doc) {

    this.document = doc;

    parentNode.coords.x = self.innerWidth / 2;

    parentNode.coords.y = 50;
}


HierarchyLayout.prototype.addDiv = function (alignment, num_of_placeholders_to_skip, divId) {

    switch (alignment) {

        case 'north': this.document.getElementById(divId).style.left = this.x_coor_for_north;

                       this.document.getElementById(divId).style.top = this.y_coor_for_north;

                       this.x_coor_for_north = this.x_coor_for_north + this.document.getElementById(divId).offsetWidth;

                       break;

        case 'south': this.document.getElementById(divId).style.left = this.x_coor_for_south;

                       this.document.getElementById(divId).style.top = this.y_coor_for_south;

                       this.x_coor_for_south = this.x_coor_for_south + this.document.getElementById(divId).offsetWidth;

                       break;

        case 'east': this.document.getElementById(divId).style.left = this.x_coor_for_east;

                      this.document.getElementById(divId).style.top = this.y_coor_for_east;

                      this.y_coor_for_east = this.y_coor_for_east + this.document.getElementById(divId).offsetHeight;

                      break;

        case 'west': this.document.getElementById(divId).style.left = this.x_coor_for_west;

                      this.document.getElementById(divId).style.top = this.y_coor_for_west;

                      this.y_coor_for_west = this.y_coor_for_west + this.document.getElementById(divId).offsetHeight;

                      break;

        case 'center': this.document.getElementById(divId).style.left = this.x_coor_for_center;

                        this.document.getElementById(divId).style.top = this.y_coor_for_center;

                        this.y_coor_for_east = this.y_coor_for_center + this.document.getElementById(divId).offsetHeight;

                        break;
    }
}


HierarchyLayout.prototype.addNode = function (alignment, num_of_placeholders_to_skip, node) {

    switch (alignment) {

        case 'north': this.x_coor_for_north = this.x_coor_for_north + ShapeConstants.rSize.width + this.x_gap;

                       node.coords.x = this.x_coor_for_north;

                       node.coords.y = this.y_coor_for_north;

                       break;

        case 'south': this.x_coor_for_south = this.x_coor_for_south + ShapeConstants.rSize.width + this.x_gap;

                       node.coords.x = this.x_coor_for_south;

                       node.coords.y = this.y_coor_for_south;

                       break;

        case 'east':  this.y_coor_for_east = this.y_coor_for_east + ShapeConstants.rSize.height + this.y_gap * (num_of_placeholders_to_skip + 1);

                       node.coords.x = this.x_coor_for_east;

                       node.coords.y = this.y_coor_for_east;

                       //this.x_coor_for_east = this.x_coor_for_east + ShapeConstants.rSize.width + this.x_gap;

                       break;

        case 'west':  this.y_coor_for_west = this.y_coor_for_west + ShapeConstants.rSize.height + this.y_gap * (num_of_placeholders_to_skip + 1);

                       node.coords.x = this.x_coor_for_west;

                       node.coords.y = this.y_coor_for_west;

                       //this.x_coor_for_west = this.x_coor_for_west + ShapeConstants.rSize.width + this.x_gap;

                       break;

        case 'center': this.y_coor_for_center = this.y_coor_for_center + ShapeConstants.rSize.height + this.y_gap * (num_of_placeholders_to_skip + 1);

                        node.coords.x = this.x_coor_for_center;

                        node.coords.y = this.y_coor_for_center;

                        //this.x_coor_for_center = this.x_coor_for_center + ShapeConstants.rSize.width + this.x_gap;

                        break;
    }
}


HierarchyLayout.prototype.addNodeHierarchy = function (parentNode, relationshipList) {

    switch (this.type) {

        case 'vertical':

                        //window.alert ("pp => " + parentNode.id + " " + parentNode.coords.x + " " + parentNode.coords.y);

                        var childListIterator = parentNode.childList.getIterator ();

                        var numOfChildren = parentNode.childList.count;

                        //window.alert (numOfChildren);

                        //var tempList = new dojox.collections.ArrayList;

                        var childNode;

                        var y_coor = parentNode.coords.y + ShapeConstants.rSize.height + this.y_gap;

                        if (numOfChildren % 2 == 0) {

                            var toggleFlag = 0;

                            var x_offset;

                            var counter = 1;

                            while (!childListIterator.atEnd ()) {

                                // window.alert ("Flag = " + toggleFlag);

                                // positive offset
                                if (toggleFlag == 0) {

                                    x_offset = (ShapeConstants.rSize.width / 2) * (3 * counter - 2) + ShapeConstants.rSize.width / 2;

                                    //window.alert (x_offset);
                                }

                                // negative offset
                                else if (toggleFlag == 1) {

                                    x_offset = (-1) * ((ShapeConstants.rSize.width / 2) * (3 * counter - 2) + ShapeConstants.rSize.width / 2);

                                    //window.alert (x_offset);
                                }

                                // offset increment and flag reset
                                else if (toggleFlag == 2) {

                                    toggleFlag = 0;

                                    counter = counter + 1; // next pair of blocks

                                    continue;
                                }

                                childNode = childListIterator.get ();

                                // node placement code goes here -- relative to the parentNode

                                //window.alert ("pp => " + parentNode.id + " " + parentNode.coords);

                                childNode.coords = {x:parentNode.coords.x + x_offset, y:y_coor};

                                //window.alert (childNode.id + " " + childNode.coords.x + " " + childNode.coords.y);

                                if (childNode.childList != null) {

                                    //window.alert ("inside");

                                    this.addNodeHierarchy (childNode, relationshipList);
                                }

                                //tempList.add (childNode);

                                toggleFlag ++;
                            }

                            /*var iter = tempList.getIterator ();

                            while (!iter.atEnd ()) {

                                var n = iter.get ();

                                window.alert (n.id + " " + n.coords.x + " " + n.coords.y);
                            }*/

                            //parentNode.childList = tempList;
                        }

                        else {

                            var toggleFlag = 0;

                            var x_offset;

                            var counter = 1;

                            while (!childListIterator.atEnd ()) {

                                // window.alert ("Flag = " + toggleFlag);

                                // positive offset
                                if (toggleFlag == 0) {

                                    x_offset = (ShapeConstants.rSize.width / 2) * (3 * counter - 3);

                                    //window.alert (x_offset);

                                    if (x_offset == 0) {

                                        toggleFlag++;
                                    }
                                }

                                // negative offset
                                else if (toggleFlag == 1) {

                                    x_offset = (-1) * (ShapeConstants.rSize.width / 2) * (3 * counter - 3);

                                    //window.alert (x_offset);
                                }

                                // offset increment and flag reset
                                else if (toggleFlag == 2) {

                                    toggleFlag = 0;

                                    counter = counter + 1; // next pair of blocks

                                    continue;
                                }

                                childNode = childListIterator.get ();

                                // node placement code goes here -- relative to the parentNode

                                //window.alert ("pp => " + parentNode.id + " " + parentNode.coords);

                                childNode.coords = {x:parentNode.coords.x + x_offset, y:y_coor};

                                //window.alert (childNode.id + " " + childNode.coords.x + " " + childNode.coords.y);

                                if (childNode.childList != null) {

                                    this.addNodeHierarchy (childNode, relationshipList);
                                }

                                //tempList.add (childNode);

                                toggleFlag ++;
                            }

                            /*var iter = tempList.getIterator ();

                            while (!iter.atEnd ()) {

                                var n = iter.get ();

                                window.alert (n.id + " " + n.coords.x + " " + n.coords.y);
                            }*/

                            //parentNode.childList = tempList;

                        }

                        break;

        case 'horizontal':

                        //window.alert ("pp => " + parentNode.id + " " + parentNode.coords.x + " " + parentNode.coords.y);

                        var childListIterator = parentNode.childList.getIterator ();

                        var numOfChildren = parentNode.childList.count;

                        //window.alert (numOfChildren);

                        //var tempList = new dojox.collections.ArrayList;

                        var childNode;

                        var x_coor = parentNode.coords.x + ShapeConstants.rSize.width + this.x_gap;

                        if (numOfChildren % 2 == 0) {

                            var toggleFlag = 0;

                            var y_offset;

                            var counter = 1;

                            while (!childListIterator.atEnd ()) {

                                // window.alert ("Flag = " + toggleFlag);

                                // positive offset
                                if (toggleFlag == 0) {

                                    y_offset = (ShapeConstants.rSize.height / 2) * (3 * counter - 2) + ShapeConstants.rSize.height / 2;

                                    //window.alert (x_offset);
                                }

                                // negative offset
                                else if (toggleFlag == 1) {

                                    y_offset = (-1) * ((ShapeConstants.rSize.height / 2) * (3 * counter - 2) + ShapeConstants.rSize.height / 2);

                                    //window.alert (x_offset);
                                }

                                // offset increment and flag reset
                                else if (toggleFlag == 2) {

                                    toggleFlag = 0;

                                    counter = counter + 1; // next pair of blocks

                                    continue;
                                }

                                childNode = childListIterator.get ();

                                // node placement code goes here -- relative to the parentNode

                                //window.alert ("pp => " + parentNode.id + " " + parentNode.coords);

                                childNode.coords = {x:x_coor, y:parentNode.coords.y + y_offset};

                                //window.alert (childNode.id + " " + childNode.coords.x + " " + childNode.coords.y);

                                if (childNode.childList != null) {

                                    //window.alert ("inside");

                                    this.addNodeHierarchy (childNode, relationshipList);
                                }

                                //tempList.add (childNode);

                                toggleFlag ++;
                            }

                            /*var iter = tempList.getIterator ();

                            while (!iter.atEnd ()) {

                                var n = iter.get ();

                                window.alert (n.id + " " + n.coords.x + " " + n.coords.y);
                            }*/

                            //parentNode.childList = tempList;
                        }

                        else {

                            var toggleFlag = 0;

                            var y_offset;

                            var counter = 1;

                            while (!childListIterator.atEnd ()) {

                                // window.alert ("Flag = " + toggleFlag);

                                // positive offset
                                if (toggleFlag == 0) {

                                    y_offset = (ShapeConstants.rSize.height / 2) * (3 * counter - 3);

                                    //window.alert (x_offset);

                                    if (y_offset == 0) {

                                        toggleFlag++;
                                    }
                                }

                                // negative offset
                                else if (toggleFlag == 1) {

                                    y_offset = (-1) * (ShapeConstants.rSize.height / 2) * (3 * counter - 3);

                                    //window.alert (x_offset);
                                }

                                // offset increment and flag reset
                                else if (toggleFlag == 2) {

                                    toggleFlag = 0;

                                    counter = counter + 1; // next pair of blocks

                                    continue;
                                }

                                childNode = childListIterator.get ();

                                // node placement code goes here -- relative to the parentNode

                                //window.alert ("pp => " + parentNode.id + " " + parentNode.coords);

                                childNode.coords = {x:x_coor, y:parentNode.coords.y + y_offset};

                                //window.alert (childNode.id + " " + childNode.coords.x + " " + childNode.coords.y);

                                if (childNode.childList != null) {

                                    this.addNodeHierarchy (childNode, relationshipList);
                                }

                                //tempList.add (childNode);

                                toggleFlag ++;
                            }

                            /*var iter = tempList.getIterator ();

                            while (!iter.atEnd ()) {

                                var n = iter.get ();

                                window.alert (n.id + " " + n.coords.x + " " + n.coords.y);
                            }*/

                            //parentNode.childList = tempList;

                        }

                        break;
    }
}


//------------------------------------------------------------------------------------------------------
// Rendering Logic
//------------------------------------------------------------------------------------------------------
renderHierarchy = function () {

    var parentNode = this;

    if (parentNode.childList == null) {

        return;
    }

    var childListIterator = parentNode.childList.getIterator ();

    var numOfChildren = parentNode.childList.count;

    //window.alert ("In renderHierarchy: Num of children = " + numOfChildren);

    while (!childListIterator.atEnd ()) {

        var n = childListIterator.get ();

        n.createNode ();
    }

    renderRelations(parentNode);
}


renderRelations = function(parentNode) {

    if (parentNode.childList == null) {

        return;
    }

    var childListIterator = parentNode.childList.getIterator ();

    var numOfChildren = parentNode.childList.count;

   // window.alert ("In renderRelations: Num of children = " + numOfChildren);

    var childNode;

    var xp = parentNode.coords.x;

    var yp = parentNode.coords.y;

    var line;

    var lineCoords;

    var xc;

    var yc;

    while (!childListIterator.atEnd ()) {

        childNode = childListIterator.get ();

        // calculate child coordinates

        xc = childNode.coords.x;

        yc = childNode.coords.y;

        switch (globalAlignment) {

            case 'vertical':

                        // draw straight down
                        if (xp == xc) {

                            lineCoords = {"x1":xp, "y1":yp, "x2":xc, "y2":yc};

                            line = surface.createLine(lineCoords).setStroke(ShapeConstants.lineStyle);

                            line.getEventSource().setAttribute("id", parentNode.id);

                            line.moveToBack();
                        }

                        // draw from (xp, yp) to (xp, yp + x) && draw from (xp, yp + x) to (xc, yp + x) && draw from (xc, yp + x) to (xc, yc)
                        else {

                            // line 1
                            lineCoords = {"x1":xp, "y1":yp, "x2":xp, "y2":yp + 30};

                            line = surface.createLine(lineCoords).setStroke(ShapeConstants.lineStyle);

                            line.getEventSource().setAttribute("id", childNode.id + "0");

                            line.moveToBack();

                            // line 2
                            lineCoords = {"x1":xp, "y1":yp + 30, "x2":xc, "y2":yp + 30};

                            line = surface.createLine(lineCoords).setStroke(ShapeConstants.lineStyle);

                            line.getEventSource().setAttribute("id", childNode.id + "1");

                            line.moveToBack();

                            // line 3
                            lineCoords = {"x1":xc, "y1":yp + 30, "x2":xc, "y2":yc};

                            line = surface.createLine(lineCoords).setStroke(ShapeConstants.lineStyle);

                            line.getEventSource().setAttribute("id", childNode.id + "2");

                            line.moveToBack();
                        }

                        break;

            case 'horizontal':

                        // draw straight down
                        if (yp == yc) {

                            lineCoords = {"x1":xp, "y1":yp, "x2":xc, "y2":yc};

                            line = surface.createLine(lineCoords).setStroke(ShapeConstants.lineStyle);

                            line.getEventSource().setAttribute("id", parentNode.id);

                            line.moveToBack();
                        }

                        // draw from (xp, yp) to (xp + x, yp) && draw from (xp + x, yp) to (xp + x, yc) && draw from (xp + x, yc) to (xc, yc)
                        else {

                            // line 1
                            lineCoords = {"x1":xp, "y1":yp, "x2":xp + 50, "y2":yp};

                            line = surface.createLine(lineCoords).setStroke(ShapeConstants.lineStyle);

                            line.getEventSource().setAttribute("id", childNode.id + "0");

                            line.moveToBack();

                            // line 2
                            lineCoords = {"x1":xp + 50, "y1":yp, "x2":xp + 50, "y2":yc};

                            line = surface.createLine(lineCoords).setStroke(ShapeConstants.lineStyle);

                            line.getEventSource().setAttribute("id", childNode.id + "1");

                            line.moveToBack();

                            // line 3
                            lineCoords = {"x1":xp + 50, "y1":yc, "x2":xc, "y2":yc};

                            line = surface.createLine(lineCoords).setStroke(ShapeConstants.lineStyle);

                            line.getEventSource().setAttribute("id", childNode.id + "2");

                            line.moveToBack();
                        }

                        break;
        }
        //renderRelations (childNode);
    }
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
