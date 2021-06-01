stairIDChecking = [];
stairIDChecking[0]=1;

function getStairID(){
    
}

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
    stairCheck = {};
    numberOfStair = 0;
    listNode.forEach(node => {
        if(node.id_stair!=null){
            if(stairCheck[node.id_stair]==null){
                numberOfStair += 1;
                stairIDChecking[id_stair] = 1;
                stairCheck[node.id_stair] = 1;
            }
        }
    });
    stairID = numberOfStair-1;
    console.log(numberOfStair);
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
    // listNode.forEach(floorNode => {
    //     if(floorNode.id_stair!=null){
    //         if(check[floorNode.id_stair]==null){
    //             currentStairID+=1;
    //             check[floorNode.id_stair]=currentStairID;
    //             floorNode.id_stair = check[floorNode.id_stair];
    //         }else{
    //             floorNode.id_stair = check[floorNode.id_stair];
    //         }
    //     }
    // });
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
    stairID = 1;
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
        startID = dataMapNode.length;
    });
    console.log(mapNodes);
    extracData(mapNodes);
}