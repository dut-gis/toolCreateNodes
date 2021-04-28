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
    // + '<tr><td>floorId</td><td id="floorId">1</td></tr>'
    + ' <tr><td>name</td><td><input type="text" id="placeName"></td></tr>'
    + '    </table>';
nodeEnterBuilding =
    '        <table >'
    + '    <tr><th>Key</th><th>Value</th>'
    + '  </tr><tr><td>Mode</td><td>nodeEnterBuilding</td>'
    + '   </tr><tr><td>nodeID</td><td></td>'
    + '  </tr><tr><td>nearNodes</td><td>[]</td></tr>'
    + '   </tr><tr><td>buildingId</td><td>'
    + '  <select id="buildingId"></select></td></tr>'
    + '<tr><td>floorNumber</td><td> <select id="floorId"></select></td></tr>'
    + ' </table>';
nodeBuilding =
    '<table >'
    + ' <tr><th>Key</th><th>Value</th>'
    + ' </tr><tr><td>Mode</td><td>nodeBuilding</td>'
    + '  </tr><tr><td>nodeID</td><td></td>'
    + '  </tr><tr><td>nearNodes</td><td>[]</td></tr>'
    + '  </tr><tr><td>buildingId</td><td>'
    + '  <select id="buildingId"></select></td></tr>'
    + '<tr><td>floorNumber</td><td> <select id="floorId"></select></td></tr>'
    + '  </table>';
nodeClassroom =
    '       <table >'
    + ' <tr><th>Key</th><th>Value</th>'
    + ' </tr><tr><td>Mode</td><td>nodeClassroom</td>'
    + '  </tr><tr><td>nodeID</td><td></td>'
    + '  </tr><tr><td>nearNodes</td><td>[]</td></tr>'
    + '  </tr><tr><td>buildingId</td><td>'
    + '  <select id="buildingId"></select></td></tr>'
    + '<tr><td>floorNumber</td><td> <select id="floorId"></select></td></tr>'
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
    + '   </tr><tr><td>buildingId</td><td>'
    + ' <select id="buildingId"></select>'
    + '</td></tr>'
    + '<tr><td>floorNumber</td><td> <select id="floorId"></select></td></tr>'
    + '<tr><td>stairID</td><td>'
    + '    <select id="stairID"> <option>1</option><option>2</option><option>3</option><option>4</option></select>'
    + '          </td>'
    + '<tr><td>stairSequence</td><td><select id="stairSequence"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></td></tr>'
    // + '  </tr><tr><td>stairSequence</td><td>'
    // + '        <select id="stairSequence"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select>'
    // + ' </td>'
    + '  </table>';



    // + ' <tr><td>floor</td><td>'
    // + '  <select id="floor"> <option>1</option><option>2</option><option>3</option><option>4</option></select>'
    // + ' </td></tr>'