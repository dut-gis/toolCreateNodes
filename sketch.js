var topStartLat = 16.078686888467125;
var topStartlng = 108.14973592758179;
var bottomEndLat = 16.07297038367645;
var bottomEndLng = 108.15529346466064;
var latDistance = topStartLat - bottomEndLat;
var lngDistance = bottomEndLng - topStartlng;
var normalColor = document.getElementById("normal");
var placeColor = document.getElementById("place");
var enterColor = document.getElementById("enter");
var buildingColor = document.getElementById("building");
var classroomColor = document.getElementById("classroom");
var stairColor = document.getElementById("stair");

var a_old = document.getElementById("a_old");
var a_latlng = document.getElementById("a_latlng");
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
    convertToLatLng(nodes);
}

function logJson2() {
    console.log(JSON.stringify(nodes));
}

function downloadNodeLatLng(name, type) {
    var file = new Blob([JSON.stringify(convertToLatLng(mergeAllFloor()))], {
        type: type
    });
    a_latlng.href = URL.createObjectURL(file);
    a_latlng.download = name;
    a_latlng.text = "DOWNLOAD";
}

function download2(name, type) {
    var file = new Blob([JSON.stringify(mergeAllFloor())], {
        type: type
    });
    a_old.href = URL.createObjectURL(file);
    a_old.download = name;
    a_old.text = "DOWNLOAD";
}
//#endregion

//#region ALGORITHM
function preload() {
    // img = loadImage('map/floor1.jpg');
    loadMap(1);
    // img = loadImage('map.jpg');
}

function loadMap(floorNumber) {
    // img = loadImage('map.jpg');
    path = "map/floor" + floorNumber + ".jpg";
    img = loadImage(path);
}

function setup() {
    let cnv = createCanvas(img.width, img.height);
    cnv.parent('myMap');
    frameRate(10);
    print(img.width);
    print(img.height);
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
        // quick log
        if (event.key == 'l') {
            //if (nodeMode.value == "classroom") {
            console.log(nodes[nodeBegin]);
            // }
        }
        // shortcut key for classroom
        // arrow up
        if (event.key == 'w') {
            if (nodeMode.value == "classroom") {
                console.log("key up");
                select_classId.selectedIndex += 1;
            }
        }
        // arrow down
        if (event.key == 's') {
            if (nodeMode.value == "classroom") {
                console.log("key down");
                select_classId.selectedIndex -= 1;
            }
        }
        if (event.key === 'c') {
            if (nodeMode.value == "classroom") {
                checkbox_isEntrance.checked = !checkbox_isEntrance.checked;
            }
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
                line(e.longitude, e.latitude, nodes[e2.id].longitude, nodes[e2.id].latitude);
            });
        });
    } catch (e) { }

    //draw line if function is add_path
    if (nodeBegin != null) {
        line(nodes[nodeBegin].longitude, nodes[nodeBegin].latitude, mouseX, mouseY);
    }

    //draw nodes
    stroke(color(0));
    nodes.forEach((e, index) => {
        if (nodeBegin != null && e.id == nodeBegin) {
            fill(nodeAddPathColor.value);
            ellipse(e.longitude, e.latitude, nodeSize, nodeSize);
            fill(255, 26, 26);
            if (e.id_stair != null) {
                // draw all stair_variables
                text(e.id_building, e.longitude, e.latitude-12);
                text(stairs[e.id_stair].name, e.longitude, e.latitude);
                text(e.stair_sequence, e.longitude, e.latitude+12);
            } else if (e.id_class != null) {
                // draw all class_variables
                text(buildingNames[e.id_building], e.longitude, e.latitude-12);
                text(e.className, e.longitude, e.latitude);
            }
        } else {
            var nodeColor = getModeColor(e.mode);
            fill(nodeColor);
            ellipse(e.longitude, e.latitude, nodeSize, nodeSize);
            fill(255, 26, 26);
            text(e.id, e.longitude, e.latitude + 12);
            // if (e.id_stair != null) {
            //     fill(255, 26, 26);
            //     text(e.stair_sequence+' '+stairs[e.id_stair].name, e.longitude, e.latitude);
            // } else if (node.id_class != null) {
            //     fill(255, 26, 26);
            //     text(node.className, node.longitude, node.latitude);
            // }
        }
    });
    ellipse(mouseX, mouseY, nodeSize, nodeSize);

    // if (select_floor != null && parseInt(select_floor.value) > 1) {
    //     nodes.forEach((node) => {
    //         if(node.id_class!=null){
    //             fill(255, 26, 26);
    //             text(node.className, node.longitude, node.latitude);
    //         }
    //     });
    // }

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

nodeDrag = null;
isCanDrag = null;

function mouseDragged() {
    if (!isModeNode) return;

    if (nodeDrag == null && nodeDrag == null) {
        nodeBegin = null;
        for (let e of nodes) {
            node = {
                longitude: mouseX,
                latitude: mouseY,
            };
            if (getNodeDistance(e, node) <= nodeSize * 1) {
                console.log(e);
                nodeDrag = e;
                isCanDrag = true;
            }
        }
        if (isCanDrag == null) isCanDrag = false;
    }
    if (isCanDrag == true) {
        nodeDrag.longitude = mouseX;
        nodeDrag.latitude = mouseY;
    }

    print("mouse drag");
}

function mouseClicked() {
    print("mouse clicked");
    if (!isModeNode) return;

    if (nodeDrag != null || isCanDrag == false) {
        nodeDrag = null;
        isCanDrag = null;
        return;
    }
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
        longitude: mouseX,
        latitude: mouseY,
        "mode": nodeMode.value,
        "id_building": select_buildingId == null ? null : select_buildingId.value,
        "category": select_placeCategory == null ? null : select_placeCategory.value,
        "id_place": select_placeNameTag == null ? null : select_placeNameTag.value,
        "id_class": select_classId == null ? null : select_classId.value,
        "className": select_classId == null ? null : select_classId.options[select_classId.selectedIndex].text,
        "id_stair": select_stairId == null ? null : select_stairId.value,
        "stair_sequence": stair_sequence == null ? null : stair_sequence.value,
        "floor_number": floorNumber,
        "isMainEntrance": checkbox_isEntrance == null ? null : checkbox_isEntrance.checked,
        nearNodes: []
    };

    // a_new.text = "";
    a_old.text = "";

    //Check function is add path
    if (nodeBegin == null) {
        // if (nodeMode.value != null && nodeMode.value == "place") {
        //     if (select_placeNameTag.value == "") {
        //         alert("Chưa điền placeName kìa bitch");
        //         return;
        //     }
        // }
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
                            return v.id != nodeBegin;
                        });
                        nodes[nodeBegin].nearNodes = nodes[nodeBegin].nearNodes.filter(v => {
                            return v.id != e.id;
                        });
                    } else {
                        print("Add path")
                        // e.nearNodes.push(nodeBegin);
                        // nodes[nodeBegin].nearNodes.push(e.id);
                        e.nearNodes.push({
                            "id": nodeBegin,
                            "distance": 0
                            // "distance":getNodeDistance(e,nodes[nodeBegin])
                        });
                        nodes[nodeBegin].nearNodes.push({
                            "id": e.id,
                            "distance": 0
                            // "distance":getNodeDistance(e,nodes[nodeBegin])
                        });
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
    if (nodeMode.value == "stair") {
        stair_sequence.value = 1 + eval(stair_sequence.value);
    }
    stackHistory.push({
        type: "NODE",
        nodeIds: [node.id]
    })
    return;
}

function generateFloor() {
    floor1 = [];
    numberOfStair = 0;
    stairCheck = {};

    mapNodes = [];
    if (floorNumber != 1) {
        // merge floor.nodes to temporaryNodes
        mapNodes = temporaryNode;
    } else {
        // merge floor.nodes to node
        mapNodes = nodes;
    }

    mapNodes.forEach(node => {
        if (node.floor_number != null
            && node.id_building == select_generate_floor_building.value
            && node.floor_number == 1
            && node.id_stair == null) {
            // node thuộc tầng 1 của building được chọn để generate
            floor1.push(node);
        } else {
            if (node.id_stair != null && node.id_building == select_generate_floor_building.value) {
                // node là cầu thang
                floor1.push(node);
                if (stairCheck[node.id_stair] == null) {
                    numberOfStair += 1;
                    stairCheck[node.id_stair] = 1;
                }
            }
        }
    });
    //console.log(floor1);
    console.log(numberOfStair);
    maxFloor = generate_floor_floorId.value;
    minFloor = 2;
    console.log("format");
    for (let i = 2; i <= maxFloor; i++) {
        floorGenerate = JSON.parse(JSON.stringify(floor1));
        // format 
        formatFloor(floorGenerate, i, stairID);
        // generate class
        classIds = getListClassOptions(select_generate_floor_building.value, i);
        classIndex = 0;
        for (let i = 0; i < floorGenerate.length; i++) {
            if (floorGenerate[i].id_class != null && classIds.length > i) {
                floorGenerate[i].id_class = classIds[classIndex].id;
                classIndex += 1;
            }
        }
        // generate stair
        stairID += numberOfStair;
        console.log(floorGenerate);
        setListNodeFloor(select_generate_floor_building.value, i, floorGenerate);
    }
    alert("Generate successful!!!");
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

function mergeAllFloor() {
    mapNodes = [];
    if (floorNumber != 1) {
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
                    // nearNodes.push(nearNode + startID);
                    nearNodes.push({
                        "id": nearNode.id + startID,
                        "distance": 0
                    });
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
    distance = Math.sqrt(Math.abs(Math.pow(b.longitude - a.longitude, 2) + Math.pow(b.latitude - a.latitude, 2)));
    return distance;
}

function checkIsHasPath(nodeA, nodeB_ID) {
    // return nodeA.nearNodes.includes(nodeB_ID);
    var isHasPath = false;
    nodeA.nearNodes.forEach(near => {
        if (near.id == nodeB_ID) {
            isHasPath = true;
        }
    });
    return isHasPath;
}

function deleteNode(node) {
    stackHistory.push({
        type: "DELETENODE",
        node: node
    })
    //Delete node and path relative to that node
    node.nearNodes.forEach(e => {
        // nodes[e].nearNodes = nodes[e].nearNodes.filter(v => {
        //     return v != node.id;
        // });
        nears = [];
        nodes[e.id].nearNodes.forEach(near => {
            if (near.id != node.id) {
                nears.push(near);
            }
        });
        nodes[e.id].nearNodes = nears;
    });
    //Update path
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].id > node.id) nodes[i].id -= 1;
        if (i != node.id) {
            for (j = 0; j < nodes[i].nearNodes.length; j++) {
                if (nodes[i].nearNodes[j].id > node.id) nodes[i].nearNodes[j].id -= 1;
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
                if (nodes[i].nearNodes[j].id >= node.id) nodes[i].nearNodes[j].id += 1;
            }
        }
    }

    node.nearNodes.forEach(e => {
        // nodes[e.id].nearNodes.push(node.id);
        nodes[e.id].nearNodes.push({
            "id": node.id,
            "distance": e.distance
        });
    });
}

function printLatLng(node) {
    var topStartLat = 16.078686888467125;
    var topStartlng = 108.14973592758179;
    var bottomEndLat = 16.07297038367645;
    var bottomEndLng = 108.15529346466064;
    var latDistance = topStartLat - bottomEndLat;
    var lngDistance = bottomEndLng - topStartlng;
    var lng = node.longitude / width * lngDistance + topStartlng;
    var lat = (height - node.latitude) / height * latDistance + bottomEndLat;
    console.log(lng + ", " + lat);
}

//#endregion