table = document.getElementById("table");
nodeMode = document.getElementById("nodeMode");
select_generate_floor_building = document.getElementById("generate_buildingId");
select_create_floor_building = document.getElementById("create_buildingId");
// todo: them floor vo mode class , building enter, building

// mode place
placeOption = [
    {
        "option": "building",
        "id": 1
    },
    {
        "option": "FunctionalDepartments",
        "id": 2
    },
    {
        "option": "FacultyAndResearchCentres",
        "id": 3
    },
    {
        "option": "selfStudy",
        "id": 4
    },
    {
        "option": "parkingLot",
        "id": 5
    },
    {
        "option": "cafeteria",
        "id": 6
    },
    {
        "option": "Others",
        "id": 7
    }
]

var select_placeCategory;

// mode entranceBuilding
var select_buildingId;
var select_classId;
var select_stairId;
var stair_sequence;
var checkbox_isEntrance;
var floorNumber;
var placeName;
var classOptions;
var buildingOption = [];
buildings.forEach((building) => {
    buildingOption.push({
        "option": building.name,
        "id": building.id
    })
});

addSelectOption(select_generate_floor_building,buildingOption);
addSelectOption(select_create_floor_building,buildingOption);

function resetValue() {
    select_buildingId = null;
    select_classId = null;
    select_stairId = null;
    stair_sequence = null;
    checkbox_isEntrance = null;
    floorNumber = null;
    placeName = null;
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
            placeName = document.getElementById("placeName");
            break;
        }
        case "entranceBuilding": {
            table.innerHTML = nodeEnterBuilding;
            resetValue();
            select_buildingId = document.getElementById("buildingId");
            addSelectOption(select_buildingId, buildingOption);
            select_floor = document.getElementById("floorId");
            floorNumber = 1;
            select_floor.value = floorNumber;
            break;
        }
        case "building": {
            table.innerHTML = nodeBuilding;
            resetValue();
            select_buildingId = document.getElementById("buildingId");
            addSelectOption(select_buildingId, buildingOption);

            select_floor = document.getElementById("floorId");
            floorNumber = 1;
            select_floor.value = floorNumber;
            break;
        }
        case "classroom": {
            table.innerHTML = nodeClassroom;
            resetValue();
            select_buildingId = document.getElementById("buildingId");
            addSelectOption(select_buildingId, buildingOption);
            select_classId = document.getElementById("classId");

            select_floor = document.getElementById("floorId");
            floorNumber = 1;
            select_floor.value = floorNumber;
            classOptions = getListClassOptions(select_buildingId.value, floorNumber);
            addSelectOption(select_classId, classOptions);
            select_buildingId.onchange = () => {
                classOptions = getListClassOptions(select_buildingId.value, floorNumber);
                addSelectOption(select_classId, classOptions);
            }

            checkbox_isEntrance = document.querySelector("#entrance");
            break;
        }
        case "stair": {
            table.innerHTML = nodeStair;
            resetValue();
            floorNumber = null;
            select_stairId = document.getElementById("stairID");
            stair_sequence = document.getElementById("stairSequence");
            stairSequence.innerHTML = 0;
            stairSequence.value = 0;
            select_buildingId = document.getElementById("buildingId");
            select_buildingId.onchange = ()=>{
                stairSequence.innerHTML = 0;
                stairSequence.value = 0;
            }
            select_stairId.onchange = ()=> {
                stairSequence.innerHTML = 0;
                stairSequence.value = 0;
            }
            addSelectOption(select_buildingId, buildingOption);
            break;
        }
        default: {
            floorNumber = null;
            resetValue();
            table.innerHTML = nodeNormal;
        }
    }
};

function testing() {
    var rooms = data.filter(room => {
        return room.id_sector == 2;
    })
    console.log(rooms);
}

function getListClassOptions(buildingId, floorId) {
    classOptions = [];
    buildings.forEach(building => {
        if (building.id == buildingId) {
            building.floors.forEach(floor => {
                if (floor.name == floorId) {
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

function addSelectOption(select, listOption) {
    htmlOption = "";
    listOption.forEach(option => {
        htmlOption += '<option value="' + option['id'] + '">' + option['option'] + '</option>';
    });
    select.innerHTML = htmlOption;
}