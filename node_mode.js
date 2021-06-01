
var table = document.getElementById("table");
var nodeMode = document.getElementById("nodeMode");
// generate Mode
var select_generate_floor_building = document.getElementById("generate_buildingId");
var generate_floor_floorId = document.getElementById("generate_toId");
// mode place

var select_placeCategory;
var select_drawDetailMode;

// var checkbox_shouldDrawDetails = document.getElementById("cb_details");
var select_drawDetailMode = document.getElementById("draw_detail_mode");

// mode entranceBuilding
var select_buildingId;
var select_classId;
var select_stairId;
var select_floor;
var stair_sequence;
var checkbox_isEntrance;
var select_placeNameTag;
var classOptions;
var stairID = 0;

// storing state
var floorNumber = 1;
var buildingId = 4;

var buildingOption = [];
var buildingNames = {};
var classNames = {};
var placeNames = {};
var nodesFloor = [];


initAllData();
function initAllData() {
    // setUp building name and class name
    buildings.forEach((building) => {
        buildingNames[building.id] = building.name;
        building.floors.forEach(floor => {
            floor.rooms.forEach(room => {
                classNames[room.id] = room.name;
            })
        })
    });
    // init place name
    places.forEach(place => {
        placeNames[place.id]=place.nameTag;
    })
    // init building options
    buildings.forEach((building) => {
        buildingOption.push({
            "option": building.name,
            "id": building.id
        })
    });
    // init nodesFloor: lưu trữ node của mỗi tầng trong mỗi khu
    buildings.forEach((building) => {
        floors = [];
        building.floors.forEach(floor => {
            if (floor.number != 1) {
                floors.push({
                    "number": floor.number,
                    "nodes": []
                })
            }
        });
        nodesFloor.push({
            "id": building.id,
            "maxFloor": building.floors.length,
            "floors": floors
        })
    });
    // init buildingOption for generate floor feature
    addSelectOption(select_generate_floor_building, buildingOption);
    select_generate_floor_building.onchange = () => {
        options = createFloorOption(getMaxFloor(select_generate_floor_building.value), 2)
        addSelectOption(generate_floor_floorId, options);
    }

    options = createFloorOption(getMaxFloor(select_generate_floor_building.value), 2)

    // addSelectOption(create_floor_floorId, options);
    addSelectOption(generate_floor_floorId, options);
}

function resetValue() {
    select_buildingId = null;
    select_classId = null;
    select_stairId = null;
    stair_sequence = null;
    select_floor = null;
    select_placeCategory = null;
    checkbox_isEntrance = null;
    select_placeNameTag = null;
    classOptions = null;
}

nodeMode.onchange = () => {
    print("change mode");
    switch (nodeMode.value) {
        case "normal": {
            resetValue();
            table.innerHTML = nodeNormal;
            break;
        }
        case "place": {
            table.innerHTML = nodePlace;
            resetValue();
            select_placeCategory = document.getElementById("category");
            addSelectOption(select_placeCategory, placeOption);
            select_placeNameTag = document.getElementById("placeName");
            addSelectOption(select_placeNameTag, getListPlaceOptions(select_placeCategory.value));
            select_placeCategory.onchange = ()=>{
                addSelectOption(select_placeNameTag, getListPlaceOptions(select_placeCategory.value));
            }
            break;
        }
        case "entranceBuilding": {
            table.innerHTML = nodeEnterBuilding;
            resetValue();
            initBuilding();
            initNodeFloor();
            break;
        }
        case "building": {
            table.innerHTML = nodeBuilding;
            resetValue();
            initBuilding();
            initNodeFloor();
            break;
        }
        case "classroom": {
            table.innerHTML = nodeClassroom;
            resetValue();
            initBuilding();
            initNodeFloor();

            checkbox_isEntrance = document.querySelector("#entrance");

            select_classId = document.getElementById("classId");
            classOptions = getListClassOptions(select_buildingId.value, floorNumber);
            addSelectOption(select_classId, classOptions);
            break;
        }
        case "stair": {
            table.innerHTML = nodeStair;
            resetValue();
            stair_sequence = document.getElementById("stairSequence");
            stair_sequence.value = 0;

            select_stairId = document.getElementById("stairID");

            initBuilding();
            initNodeFloor();
            
            stairOptions = getListStairOptions(select_buildingId.value);
            addSelectOption(select_stairId, stairOptions);

            select_stairId.onchange=()=>{
                stair_sequence.value = 0;
            }
            break;
        }
        default: {
            console.log("BUG BUG");
        }
    }
};

function initBuilding() {
    select_buildingId = document.getElementById("buildingId");
    addSelectOption(select_buildingId, buildingOption);
    select_buildingId.value = buildingId;
}

function initNodeFloor() {
    // Tìm kiếm và updata lại floor theo state của nó
    select_floor = document.getElementById("floorId");
    floor_options = createFloorOption(getMaxFloor(select_buildingId.value));
    addSelectOption(select_floor, floor_options);
    if(floor_options.length<floorNumber){
        floorNumber = floor_options.length;
    }
    loadMap(floorNumber);
    select_floor.value = floorNumber;
    // Thêm sự kiện khi building thay đổi
    select_buildingId.onchange = () => {
        buildingId = select_buildingId.value;
        if (select_classId != null) {
            classOptions = getListClassOptions(select_buildingId.value, floorNumber);
            addSelectOption(select_classId, classOptions);
        }
        if (stair_sequence != null) {
            stair_sequence.value = 0;
        }
        if (select_stairId !=null){
            stairOptions = getListStairOptions(select_buildingId.value);
            addSelectOption(select_stairId, stairOptions);
        }
        addSelectOption(select_floor, createFloorOption(getMaxFloor(select_buildingId.value)));
        if(floor_options.length<floorNumber){
            floorNumber = floor_options.length;
        }
        loadMap(floorNumber);
        select_floor.value = floorNumber;
        onFloorNumberChange();
    }
    select_floor.onchange = onFloorNumberChange;
}

function onFloorNumberChange() {
    print("change");
    if (select_floor.value == 1) {
        // floor==1 => chấm node ơ phần dưới
        // => if temporaryNode!=null tức là chuyển từ floor!=1 xuống floor=1 nên cần vẽ lại nodes
        if (temporaryNode != null) {
            if (confirm('Dữ liệu lịch sử thay đổi của bạn sẽ bị mất.\nBạn đã chắc chắn chưa?')) {
                stackHistory = [];
                nodes = temporaryNode;
            } else {
                select_floor.value = floorNumber;
                return;
            }
        }
        temporaryNode = null;
    } else {
        // if temporaryNode==null tức là từ floor 1 chuyển lên floor!= thì ta cần backup dữ liệu của node
        if (confirm('Dữ liệu lịch sử thay đổi của bạn sẽ bị mất.\nBạn đã oke chưa?')) {
            if (temporaryNode == null) temporaryNode = nodes;
            stackHistory = [];
            data = getListNodeFloor(select_buildingId.value, select_floor.value);
            if (data != null) nodes = data;
        } else {
            select_floor.value = floorNumber;
            return;
        }
    }
    if(select_floor.value!=""){
        floorNumber = select_floor.value;
        loadMap(floorNumber);
    }
    // floorNumber = select_floor.value==""?floorNumber:select_floor.value;

    // Dùng trong các mode có buildingId để lắng nghe sự thay đổi của buildingID và thay đổi class
    if (select_classId != null) {
        classOptions = getListClassOptions(select_buildingId.value, floorNumber);
        addSelectOption(select_classId, classOptions);
    }
}

function testing() {
    var rooms = data.filter(room => {
        return room.id_sector == 2;
    })
    console.log(rooms);
}

function getMaxFloor(buildingId) {
    var max;
    nodesFloor.forEach(building => {
        if (building.id == buildingId) {
            max = building.maxFloor;
        }
    });
    return max;
}

function createFloorOption(maxFloor, minFloor) {
    options = [];
    if (!minFloor) minFloor = 1;
    for (i = minFloor; i <= maxFloor; i++) {
        options.push({
            "id": i,
            "option": i
        });
    }
    return options;
}

function getListPlaceOptions(placeCategoryId){
    let placeOption = [];
    places.forEach(place => {
        if(place.categoryId==placeCategoryId&&place.name==null){
            placeOption.push({
                "option": place.nameTag,
                "id":place.id
            })
        }
    })
    return placeOption;
}

function getListClassOptions(buildingId, floorId) {
    classOptions = [];
    buildings.forEach(building => {
        if (building.id == buildingId) {
            console.log('building oke');
            building.floors.forEach(floor => {
                if (floor.number == floorId) {
                    console.log('floor oke');
                    floor.rooms.forEach(room => {
                        classOptions.push({
                            "option": room.name,
                            "id": room.id,
                            "nameTag": room.nameTag
                        })
                    })
                }
            })
        }
    })
    return classOptions;
}

function getListStairOptions(sectorId){
    options = [];
    for(let i=0;i<buildings.length;i++){
        if(buildings[i].id==sectorId){
            buildings[i].stairs[0].forEach(stairId => {
                options.push({
                    "option": stairs[stairId-1].name,
                    "id":stairId
                });
            });
            break;
        }
    }
    return options;
}

function addSelectOption(select, listOption) {
    htmlOption = "";
    listOption.forEach(option => {
        htmlOption += '<option value="' + option['id'] + '">' + option['option'] + '</option>';
    });
    select.innerHTML = htmlOption;
}