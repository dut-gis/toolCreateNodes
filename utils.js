// stairIDChecking = [];
// stairIDChecking[0]=1;

function extracData(listNode) {
    nodedata = [];
    listNode.forEach(node => {
        if (node.floor_number == 1) {
            nodedata.push(node);
        } else {
            pushNodeToFloor(node.id_building, node.floor_number, node);
        }
    });
    nodesFloor.forEach(building => {
        building.floors.forEach(floor => {
            formatFloor(floor.nodes, floor.number);
        })
    });
    formatFloor(nodedata, 1);
    console.log(nodedata);
    this.nodes = nodedata;
}

function formatFloor(listNode, floorNumber, currentStairID) {
    mapNode = {};
    startID = 0;
    listNode.forEach(floorNode => {
        mapNode[floorNode.id] = startID;
        floorNode.id = startID;
        floorNode.floor_number = floorNumber;
        startID += 1;
    });
    listNode.forEach(floorNode => {
        nearNodes = [];
        floorNode.nearNodes.forEach(nearNode => {
            if (mapNode[nearNode.id] != null) {
                nearNodes.push({
                    "id": mapNode[nearNode.id],
                    "distance": 0
                });
            }
        })
        floorNode.nearNodes = nearNodes;
    });
    check = {};
}

function convertToLatLng(data) {
    // LatLng(16.078686888467125, 108.14973592758179), LatLng(16.07297038367645, 108.15529346466064)
    var topStartLat = 16.078686888467125;
    var topStartlng = 108.14973592758179;
    var bottomEndLat = 16.07297038367645;
    var bottomEndLng = 108.15529346466064;
    var latDistance = topStartLat - bottomEndLat;
    var lngDistance = bottomEndLng - topStartlng;
    // mapNodes = [];
    let nodes = [];
    // stairID = 1;
    nodes = JSON.parse(JSON.stringify(data));
    nodes.forEach((node) => {
        node.id = node.id + 1;
        // if(node.id_stair!=null){
        //     node.id_stair = stairID;
        //     stairID+=1;
        // }
        node.longitude = node.longitude / width * lngDistance + topStartlng + 0.00004;
        node.latitude = (height - node.latitude) / height * latDistance + bottomEndLat + 0.000002;
        node.schoolId = 1;
        node.nearNodes.forEach((nearNode) => {
            nearNode.id += 1;
        });
    });
    nodes.forEach((node) => {
        node.nearNodes.forEach((nearNode) => {
            nearNode.distance = getNodeDistance(nodes[node.id - 1], nodes[nearNode.id - 1]) / width
        });
    })
    console.log(JSON.stringify(nodes));
    return nodes;
}

function mergeListNodes(dataMapNodes) {
    mapNodes = [];
    startID = 0;
    dataMapNodes.forEach((dataMapNode) => {
        dataMapNode.forEach((node) => {
            mapNode = JSON.parse(JSON.stringify(node));
            mapNode.id = startID + node.id;
            mapNode.longitude = node.longitude;
            mapNode.latitude = node.latitude;
            mapNode.nearNodes = [];
            node.nearNodes.forEach((near) => {
                mapNode.nearNodes.push({
                    'id': near.id + startID,
                    'distance': 0
                });
            });
            mapNodes.push(mapNode);
        });
        // mapNodes.forEach((mapNode) => {
        //     mapNode.nearNodes.forEach((near) => {
        //         near.id += startID
        //     });
        // });
        startID = dataMapNode.length;
    });
    console.log(mapNodes);
    extracData(mapNodes);
}

function drawDetail(e, isNodeSelected){
    if(isNodeSelected){
        if (e.id_stair != null) {
            // draw all stair_variables
            text(buildingNames[e.id_building], e.longitude, e.latitude - 12);
            text(stairs[e.id_stair-1].name, e.longitude, e.latitude);
            text(e.stair_sequence, e.longitude, e.latitude + 12);
        } else if (e.id_class != null) {
            // draw all class_variables
            text(buildingNames[e.id_building], e.longitude, e.latitude - 12);
            text("Main: " + e.isMainEntrance, e.longitude, e.latitude);
            text(classNames[e.id_class], e.longitude, e.latitude + 12);
        }else if (e.mode == "building") {
            // draw all building_variables
            text(buildingNames[e.id_building], e.longitude, e.latitude - 12);
            text("Building", e.longitude, e.latitude);
        }else if (e.mode == "entranceBuilding") {
            // draw all building_variables
            text(buildingNames[e.id_building], e.longitude, e.latitude - 12);
            text("E_B", e.longitude, e.latitude);
        }else if (e.mode == "place") {
            // draw all place_variables
            text(placeOption[e.category-1].option, e.longitude, e.latitude - 12);
            text(placeNames[e.id_place], e.longitude, e.latitude);
        }
    }
    if ((select_drawDetailMode.value == "all" || select_drawDetailMode.value == "stair") && e.mode == "stair") {
        // draw all stair_variables
        text(buildingNames[e.id_building], e.longitude, e.latitude - 12);
        text(stairs[e.id_stair-1].name, e.longitude, e.latitude);
        text(e.stair_sequence, e.longitude, e.latitude + 12);
    } else if ((select_drawDetailMode.value == "all" || select_drawDetailMode.value == "classroom") && e.mode == "classroom") {
        // draw all class_variables
        text(buildingNames[e.id_building], e.longitude, e.latitude - 12);
        text("Main: " + e.isMainEntrance, e.longitude, e.latitude);
        text(classNames[e.id_class], e.longitude, e.latitude + 12);
    }else if ((select_drawDetailMode.value == "all" || select_drawDetailMode.value == "building") && e.mode == "building") {
        // draw all building_variables
        text(buildingNames[e.id_building], e.longitude, e.latitude - 12);
        text("Building", e.longitude, e.latitude);
    }else if ((select_drawDetailMode.value == "all" || select_drawDetailMode.value == "entranceBuilding") && e.mode == "entranceBuilding") {
        // draw all building_variables
        text(buildingNames[e.id_building], e.longitude, e.latitude - 12);
        text("E_B", e.longitude, e.latitude);
    }else if ((select_drawDetailMode.value == "all" || select_drawDetailMode.value == "place") && e.mode == "place") {
        // draw all place_variables
        text(placeOption[e.category-1].option, e.longitude, e.latitude - 12);
        text(placeNames[e.id_place], e.longitude, e.latitude);
    }
}