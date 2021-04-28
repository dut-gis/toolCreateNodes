
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
    console.log(nodedata);
    this.nodes = nodedata;
}

function formatFloor(listNode, floorNumber) {
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
            if (mapNode[nearNode.id]!=null) {
                nearNodes.push({
                    "id": mapNode[nearNode.id],
                    "distance": 0
                });
            }
        })
        floorNode.nearNodes = nearNodes;
    });
}

function convertToLatLng(data) {
    // LatLng(16.078686888467125, 108.14973592758179), LatLng(16.07297038367645, 108.15529346466064)
    var topStartLat = 16.078686888467125;
    var topStartlng = 108.14973592758179;
    var bottomEndLat = 16.07297038367645;
    var bottomEndLng = 108.15529346466064;
    var latDistance = topStartLat - bottomEndLat;
    var lngDistance = bottomEndLng - topStartlng;
    console.log(latDistance);
    console.log(lngDistance);
    mapNodes = [];
    let nodes = [];
    nodes = JSON.parse(JSON.stringify(data));
    nodes.forEach((node) => {
        mapNode = node;
        mapNode.id = node.id + 1;
        mapNode.longitude = node.longitude / width * lngDistance + topStartlng + 0.00004;
        mapNode.latitude = (height - node.latitude) / height * latDistance + bottomEndLat + 0.000002;
        mapNode.schoolId = 1;
        mapNode.nearNodes = [];
        node.nearNodes.forEach((near) => {
            nearNode = {
                'id': near.id + 1,
                'distance': getNodeDistance(nodes[node.id], nodes[near.id]) / width
            };
            mapNode.nearNodes.push(nearNode);
        });
        mapNodes.push(mapNode);
    });
    console.log(JSON.stringify(mapNodes));
    return mapNodes;
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