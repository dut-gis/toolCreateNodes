
var normalColor = document.getElementById("normal");
var placeColor = document.getElementById("place");
var enterColor = document.getElementById("enter");
var buildingColor = document.getElementById("building");
var classroomColor = document.getElementById("classroom");
var stairColor = document.getElementById("stair");

var a_old = document.getElementById("a_old");
var input = document.getElementById("input");
var rangeNodeSize = document.getElementById("nodeSize");
var nodeAddPathColor = document.getElementById("nodeAddPathColor");
var lineColor = document.getElementById("lineColor");
let img;
nodes = [];
temporaryNode = null;
stackHistory = [];
nodeBegin = null;

isModeNode = true;

function hoverNavBar() {
    isModeNode = false;
}
function leaveNavBar() {
    isModeNode = true;
}

function getListNodeFloor(buildingId, floorNumber) {
    listNode = [];
    nodesFloor.forEach(building => {
        if (building.id == buildingId) {
            building.floors.forEach(floor => {
                if (floor.number == floorNumber) {
                    listNode = floor.nodes;
                }
            })
        }
    });
    return listNode;
}

function setListNodeFloor(buildingId, floorNumber, listNode) {
    nodesFloor.forEach(building => {
        if (building.id == buildingId) {
            building.floors.forEach(floor => {
                if (floor.number == floorNumber) {
                    floor.nodes = listNode;
                }
            })
        }
    });
}


function loadImageURL() {
    console.log("loadImageURL");
    img = loadImage(input.value, result => {
        print("oke");
        resizeCanvas(img.width, img.height);
    });
}

function logJson() {
    convertMapNode();
}

function logJson2() {
    console.log(JSON.stringify(nodes));
}

function download(name, type) {
    var file = new Blob([JSON.stringify(convertMapNode())], {
        type: type
    });
    a_new.href = URL.createObjectURL(file);
    a_new.download = name;
    a_new.text = "DOWNLOAD";
}

function download2(name, type) {
    var file = new Blob([JSON.stringify(nodes)], {
        type: type
    });
    a_old.href = URL.createObjectURL(file);
    a_old.download = name;
    a_old.text = "DOWNLOAD";
}
//#endregion

//#region ALGORITHM
function preload() {
    img = loadImage('logo.jpg');
}

function setup() {
    let cnv = createCanvas(img.width, img.height);
    cnv.parent('myMap');
    print(img.width)
    print(img.height)
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'z') {
            if (stackHistory.length > 0) {
                h = stackHistory.pop();
                if (h.type == "NODE") {
                    nodes.pop();
                } else
                    if (h.type == "PATHBEGIN") {
                        nodeBegin = null;
                    } else
                        if (h.type == "PATH") {
                            nodes[h.nodeIds[0]].nearNodes.pop();
                            nodes[h.nodeIds[1]].nearNodes.pop();
                        } else
                            if (h.type == "DELETENODE") {
                                unDeleteNode(h.node);
                            }
            } else {
                alert("STUPID");
            }

        }
        if (event.shiftKey) {
            nodeBegin = null;
        }
        if (event.ctrlKey && event.key === 'x') {
            id = nodeBegin;
            nodeBegin = null;
            deleteNode(nodes[id]);
        }
    });
}

function draw() {
    nodeSize = rangeNodeSize.value;
    image(img, 0, 0, img.width, img.height);

    strokeWeight(1);
    stroke(lineColor.value);

    //draw nearNodes
    try {
        nodes.forEach((e, index) => {
            e.nearNodes.forEach(e2 => {
                line(e.x, e.y, nodes[e2].x, nodes[e2].y);
            });
        });
    } catch (e) { }

    //draw line if function is add_path
    if (nodeBegin != null) {
        line(nodes[nodeBegin].x, nodes[nodeBegin].y, mouseX, mouseY);
    }

    //draw nodes
    stroke(color(0));
    nodes.forEach((e, index) => {
        if (nodeBegin != null && e.id == nodeBegin) {
            fill(nodeAddPathColor.value);
            ellipse(e.x, e.y, nodeSize, nodeSize);
        } else {
            var nodeColor = getModeColor(e.mode);
            fill(nodeColor);
            ellipse(e.x, e.y, nodeSize, nodeSize);
            fill(255, 26, 26);
            text(e.id, e.x, e.y);
        }
    });
    ellipse(mouseX, mouseY, nodeSize, nodeSize);

    noFill();
    strokeWeight(4);
    rect(2, 2, width - 5, height - 5);
}

function getModeColor(mode) {
    switch (mode) {
        case "normal": {
            return normalColor.value;
        }
        case "place": {
            return placeColor.value;
        }
        case "entranceBuilding": {
            return enterColor.value;
        }
        case "building": {
            return buildingColor.value;
        }
        case "classroom": {
            return classroomColor.value;
        }
        case "stair": {
            return stairColor.value;
        }
        default: {
            return normalColor.value;
        }
    }
}

function mouseClicked() {
    if (!isModeNode) return;
    if (floorNumber != 1) {
        if (nodeMode.value == "normal") {
            alert("Chấm theo từng thì méo có mode normal NHÉ !!!!\nĐọc kĩ hướng đẫn trước khi dùng");
            return;
        }
        if (nodeMode.value == "place") {
            alert("Chấm theo từng thì méo có mode place NHÉ !!!!\nĐọc kĩ hướng đẫn trước khi dùng");
            return;
        }
    }

    nodeSize = rangeNodeSize.value;
    //Check node inside canvas
    if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) return;
    //Init node
    node = {
        id: nodes.length,
        x: mouseX,
        y: mouseY,
        "mode": nodeMode.value,
        "id_building": select_buildingId == null ? null : select_buildingId.value,
        "category": select_placeCategory == null ? null : select_placeCategory.value,
        "placeName": placeName == null ? null : placeName.value,
        "id_class": select_classId == null ? null : select_classId.value,
        "id_stair": select_stairId == null ? null : select_stairId.value,
        "stair_sequence": stair_sequence == null ? null : stair_sequence.value,
        "floor_number": floorNumber,
        "isMainEntrance": checkbox_isEntrance == null ? null : checkbox_isEntrance.checked,
        nearNodes: []
    };

    if (nodeMode.value == "stair") {
        stair_sequence.value = 1 + eval(stair_sequence.value);
    }

    // a_new.text = "";
    a_old.text = "";

    //Check function is add path
    if (nodeBegin == null) {
        if (nodeMode.value != null && nodeMode.value == "place") {
            if (placeName.value == "") {
                alert("Chưa điền placeName kìa bitch");
                return;
            }
        }
        for (let e of nodes) {
            if (getNodeDistance(e, node) <= nodeSize * 1) {
                print("Switch to add path function");
                nodeBegin = e.id;
                stackHistory.push({
                    type: "PATHBEGIN",
                    nodeIds: []
                })
                return;
            }
        }
    } else {
        for (let e of nodes) {
            if (getNodeDistance(e, node) <= nodeSize * 1) {
                if (e.id == nodeBegin) {
                    print("Switch to add node function");
                    nodeBegin = null;
                } else {
                    if (checkIsHasPath(e, nodeBegin)) {
                        print("remove path");
                        e.nearNodes = e.nearNodes.filter(v => {
                            return v != nodeBegin;
                        });
                        nodes[nodeBegin].nearNodes = nodes[nodeBegin].nearNodes.filter(v => {
                            return v != e.id;
                        });
                    } else {
                        print("Add path")
                        e.nearNodes.push(nodeBegin);
                        nodes[nodeBegin].nearNodes.push(e.id);
                        stackHistory.push({
                            type: "PATH",
                            nodeIds: [e.id, nodes[nodeBegin].id]
                        })
                    }
                }
                return;
            }
        }
    }
    console.log(node);
    printLatLng(node);
    nodes.push(node);
    stackHistory.push({
        type: "NODE",
        nodeIds: [node.id]
    })
    return;
}

function generateFloor() {
    floor1 = [];
    nodes.forEach(node => {
        if (node.floor_number != null
            && node.id_building == select_generate_floor_building.value
            && node.floor_number == 1
            || (node.id_stair != null && node.id_building == select_generate_floor_building.value && (node.stair_sequence == 0 || node.stair_sequence == 1))) {
            floor1.push(node);
        }
    });
    console.log(floor1);
    maxFloor = generate_floor_floorId.value;
    minFloor = 2;
    console.log("format");
    for (let i = 2; i <= maxFloor; i++) {
        floorGenerate = JSON.parse(JSON.stringify(floor1));
        formatFloor(floorGenerate, i);
        console.log(floorGenerate);
        setListNodeFloor(select_generate_floor_building.value, i, floorGenerate);
    }
}

function pushNodeToFloor(buildingId, floorNumber, node) {
    nodesFloor.forEach(building => {
        if (building.id == buildingId) {
            building.floors.forEach(floor => {
                if (floor.number == floorNumber) {
                    floor.nodes.push(node);
                }
            })
        }
    });
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
            if (mapNode[nearNode]) {
                nearNodes.push(mapNode[nearNode]);
            }
        })
        floorNode.nearNodes = nearNodes;
    });
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
    console.log(nodedata);
    this.nodes = nodedata;
}

function mergeAllFloor() {
    mapNodes = [];
    if (floorNumber.value == 1) {
        // merge floor.nodes to temporaryNodes
        mapNodes = JSON.parse(JSON.stringify(temporaryNode));
    } else {
        // merge floor.nodes to node
        mapNodes = JSON.parse(JSON.stringify(nodes));
    }
    startID = mapNodes.length;
    nodesFloor.forEach(building => {
        building.floors.forEach(floor => {
            floor.nodes.forEach((floorNode) => {
                node = JSON.parse(JSON.stringify(floorNode));
                node.id += startID;
                nearNodes = [];
                node.nearNodes.forEach(nearNode => {
                    nearNodes.push(nearNode + startID);
                })
                node.nearNodes = nearNodes;
                mapNodes.push(node);
            });
            startID = mapNodes.length;
        })
    });
    console.log(mapNodes);
    return mapNodes;
}

function getNodeDistance(a, b) {
    distance = Math.sqrt(Math.abs(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)));
    return distance;
}

function checkIsHasPath(node, path) {
    return node.nearNodes.includes(path);
}

function deleteNode(node) {
    stackHistory.push({
        type: "DELETENODE",
        node: node
    })
    //Delete node and path relative to that node
    node.nearNodes.forEach(e => {
        nodes[e].nearNodes = nodes[e].nearNodes.filter(v => {
            return v != node.id;
        });
    });
    //Update path
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].id > node.id) nodes[i].id -= 1;
        if (i != node.id) {
            for (j = 0; j < nodes[i].nearNodes.length; j++) {
                if (nodes[i].nearNodes[j] > node.id) nodes[i].nearNodes[j] -= 1;
            }
        }
    }
    nodes.splice(node.id, 1);
}

function unDeleteNode(node) {
    nodes.splice(node.id, 0, node);

    for (i = 0; i < nodes.length; i++) {
        if (i > node.id) nodes[i].id += 1;
        if (i != node.id) {
            for (j = 0; j < nodes[i].nearNodes.length; j++) {
                if (nodes[i].nearNodes[j] >= node.id) nodes[i].nearNodes[j] += 1;
            }
        }
    }

    node.nearNodes.forEach(e => {
        nodes[e].nearNodes.push(node.id);
    });
}

function printLatLng(node) {
    var topStartLat = 16.078686888467125;
    var topStartlng = 108.14973592758179;
    var bottomEndLat = 16.07297038367645;
    var bottomEndLng = 108.15529346466064;
    var latDistance = topStartLat - bottomEndLat;
    var lngDistance = bottomEndLng - topStartlng;
    var lng = node.x / width * lngDistance + topStartlng;
    var lat = (height - node.y) / height * latDistance + bottomEndLat;
    console.log(lng + ", " + lat);
}

function convertMapNode() {
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
    nodes.forEach((node) => {
        mapNode = {};
        mapNode.id = node.id + 1;
        mapNode.longitude = node.x / width * lngDistance + topStartlng + 0.00004;
        mapNode.latitude = (height - node.y) / height * latDistance + bottomEndLat + 0.000002;
        mapNode.schoolId = 1;
        mapNode.nearNodes = [];
        node.nearNodes.forEach((near) => {
            nearNode = {
                'id': near + 1,
                'distance': getNodeDistance(nodes[node.id], nodes[near]) / width
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
            mapNode = {};
            mapNode.id = startID + node.id;
            mapNode.x = node.x;
            mapNode.y = node.y;
            mapNode.nearNodes = [];
            node.nearNodes.forEach((near) => {
                mapNode.nearNodes.push(near + startID);
            });
            mapNodes.push(mapNode);
        });
        startID = dataMapNode.length;
    });
    console.log(mapNodes);
    nodes = mapNodes;
}
//#endregion