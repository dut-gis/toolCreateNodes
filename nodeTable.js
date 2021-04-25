table = document.getElementById("table");
nodeMode = document.getElementById("nodeMode");

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
var checkbox_isEntrance;
var select_floor;
var placeName;

var buildingOption = [];
buildings.forEach((building)=>{
    buildingOption.push({
        "option": building.name,
        "id": building.id
    })
});

nodeMode.onchange = () => {
    print("change mode");
    switch (nodeMode.value) {
        case "normal": {
            table.innerHTML = nodeNormal;
            break;
        }
        case "place": {
            table.innerHTML = nodePlace;
            select_placeCategory = document.getElementById("category");
            addSelectOption(select_placeCategory, placeOption);
            placeName = document.getElementById("placeName");
            break;
        }
        case "entranceBuilding": {
            table.innerHTML = nodeEnterBuilding;
            select_buildingId = document.getElementById("buildingId");
            addSelectOption(select_buildingId, buildingOption);
            break;
        }
        case "building": {
            table.innerHTML = nodeBuilding;
            select_buildingId = document.getElementById("buildingId");
            addSelectOption(select_buildingId, buildingOption);
            break;
        }
        case "classroom": {
            table.innerHTML = nodeClassroom;
            select_buildingId = document.getElementById("buildingId");
            addSelectOption(select_buildingId, buildingOption);
            select_floor = document.querySelector("#floor");
            select_classId = document.getElementById("classId");

            select_buildingId.onchange = ()=>{
                classOptions = getListClassOptions(select_buildingId.value, select_floor.value);
                addSelectOption(select_classId, classOptions);
            }

            select_floor.onchange = ()=>{
                classOptions = getListClassOptions(select_buildingId.value, select_floor.value);
                addSelectOption(select_classId, classOptions);
            }
           
            checkbox_isEntrance = document.querySelector("#entrance");
            break;
        }
        case "stair": {
            table.innerHTML = nodeStair;
            select_stairId = document.getElementById("stairID");
            break;
        }
        default: {
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
    buildings.forEach(building=>{
        if(building.id==buildingId){
            building.floors.forEach(floor=>{
                if(floor.name==floorId){
                    floor.rooms.forEach(room => {
                        classOptions.push({
                            "option": room.name,
                            "id": room.id
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
        htmlOption += '<option value="'+option['id']+'">' + option['option'] + '</option>';
    });
    select.innerHTML = htmlOption;
}

nodeNormal =
    '<table id="nodeTables">'
    + '<tr><th>Key</th><th>Value</th>'
    + '</tr><tr><td>mode</td><td>nodeNormal</td>'
    + ' </tr><tr><td>nodeID</td><td></td>'
    + ' </tr><tr><td>nearNodes</td><td>[]</td></tr>'
    + '</table>';
nodePlace =
    ' <table >'
    + '  <tr><th>Key</th><th>Value</th>'
    + '   </tr><tr><td>Mode</td><td>nodePlace</td>'
    + '  </tr><tr><td>nodeID</td><td></td>'
    + ' </tr><tr><td>nearNodes</td><td>[]</td></tr>'
    + ' </tr><tr><td>category</td><td><select id="category"></select></td></tr>'
    + ' </tr><tr><td>name</td><td><input type="text" id="placeName"></td>'
    + '    </table>';
nodeEnterBuilding =
    '        <table >'
    + '    <tr><th>Key</th><th>Value</th>'
    + '  </tr><tr><td>Mode</td><td>nodeEnterBuilding</td>'
    + '   </tr><tr><td>nodeID</td><td></td>'
    + '  </tr><tr><td>nearNodes</td><td>[]</td></tr>'
    + '   </tr><tr><td>buildingId</td><td>'
    + '  <select id="buildingId"></select>'
    + '</td>'
    + ' </table>';
nodeBuilding =
    '<table >'
    + ' <tr><th>Key</th><th>Value</th>'
    + ' </tr><tr><td>Mode</td><td>nodeBuilding</td>'
    + '  </tr><tr><td>nodeID</td><td></td>'
    + '  </tr><tr><td>nearNodes</td><td>[]</td></tr>'
    + '  </tr><tr><td>buildingId</td><td>'
    + '  <select id="buildingId"></select></td></tr>'
    + '  </table>';
nodeClassroom =
    '       <table >'
    + ' <tr><th>Key</th><th>Value</th>'
    + ' </tr><tr><td>Mode</td><td>nodeClassroom</td>'
    + '  </tr><tr><td>nodeID</td><td></td>'
    + '  </tr><tr><td>nearNodes</td><td>[]</td></tr>'
    + '  </tr><tr><td>buildingId</td><td>'
    + '  <select id="buildingId"></select></td></tr>'
    + ' <tr><td>floor</td><td>'
    + '  <select id="floor"> <option>1</option><option>2</option><option>3</option><option>4</option></select>'
    + ' </td></tr>'
    + '<tr><td>classId</td><td> <select id="classId"></select></td></tr>'
    + '  <tr><td> <label for="entrance">isMainEntrance</label></td>'
    + ' <td><input type="checkbox" id="entrance"></td></tr>'
  
    + '   </table>';
nodeStair =
    '  <table >'
    + ' <tr><th>Key</th><th>Value</th>'
    + '   </tr><tr><td>Mode</td><td>nodeStair</td>'
    + '   </tr><tr><td>nodeID</td><td></td>'
    + ' </tr><tr><td>nearNodes</td><td>[]</td></tr>'
    + '   </tr><tr><td>buildingName</td><td>'
    + ' <select id="buildingName"> <option>A</option><option>B</option><option>C</option><option>D</option></select>'
    + '</td>'
    + '</tr><tr><td>stairID</td><td>'
    + '    <select id="stairID"> <option>1</option><option>2</option><option>3</option><option>4</option></select>'
    + '          </td>'
    + '  </tr><tr><td>index</td><td>'
    + '        <select id="index"> <option>1</option><option>2</option><option>3</option><option>4</option></select>'
    + ' </td>'
    + '  </table>';