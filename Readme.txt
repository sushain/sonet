//*******************************************************
// Sonet and Layout v1.0
// @author Sushain Pandit (sushain.pandit@gmail.com)
//*******************************************************
// Share or Remix it but please attribute the author
// Distributed as is; no liabilities whatsoever
//*******************************************************
// Last Modified: 17-04-2006
//*******************************************************

Web: http://sushain.com/sonet/index.html


Using the SoNet service



This service consumes GraphML of the form: -

{"graphml":
 {"graph":
   {"edgedefault":"undirected",
     "edge":[{"id":"n1","uri":"file:///C:/work/dojo/n1.php","classification":"","relationship":""},{"id":"n2","uri":"file:///C:/work/dojo/n2.php","classification":"","relationship":""}],
     "node":{"id":"n0","uri":"file:///C:/work/dojo/n0.php"}
   }
  }
}


Above illustrated GraphML represents a node and all its connected edges. The service then builds a dojo-widget based relationship graph and provides out-of-the-box functionality for adding extra features and extensions.

Using the Layout class



Layout.js is an auxiliary service that can be used to set a vertical or horizontal hierarchical layout. These layouts are provided out of the box and all one requires is a nodelist (supporting composite pattern), which will then be consumed to draw the actual hierarchy. Such hierarchies can be utilized for a particular filtered view within a social networking graph.

The node definition should comply to the following generic template: -

var Node = function(id) {
this.id = id;
this.coords;
this.shape;
this.text;
this.group;
this.childList = new dojox.collections.ArrayList();
}
Usage Illustrated


1.) Get a hierarchy object (pass the ultimate parent of the node hierarchy and specify the alignment [horizontal / vertical]: -

HierarchyLayout newLayout = new HierarchyLayout (document, ultimateParent, alignment);

2.) Invoke addNodeHierarchy: -

newLayout.addNodeHierarchy (ultimateParent, ""); // 2nd argument is yet to be utilized

This invocation would assign a value to the node coordinates (node.coords.x, node.coords.y) for each node in the hierarchy according to the passed alignment.

3.) Invoke renderHierarchy on a node: -

node.renderHierarchy ();

This invocation would render the immediate child nodes considering "node" as the parent. 