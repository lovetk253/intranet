$(function () {
    getOrgUnit();
    // $(document).on('mouseenter', '.list-group-item', function () {
    //     $(this).find(":button").show();
    // }).on('mouseleave', '.list-group-item', function () {
    //     $(this).find(":button").hide();
    // });
});

function getUserData(primaryEmail) {
    //var userKey = document.getElementById("inputUser").value;
    var a = localStorage.getItem("storageAccess");
    var PATH = 'https://www.googleapis.com/admin/directory/v1/users/' + primaryEmail + '?access_token=' + a;
    return $.ajax({
        url: PATH,
        type: "GET",
    });
}
function getAllUserData() {
    //var userKey = document.getElementById("inputUser").value;
    var a = localStorage.getItem("storageAccess");
    var PATH = 'https://www.googleapis.com/admin/directory/v1/users/?domain=devops.net.vn&access_token=' + a;
    return $.ajax({
        url: PATH,
        type: "GET",
    });
}
//localStorage.setItem("storageUserData", userData);
function getOrgUnit() {
    primaryEmail = localStorage.getItem('storageEmail');
    $.when(getUserData(primaryEmail)).done(function (data) {
        if (!data == '') {
            customerId = data["customerId"];
            a = localStorage.getItem("storageAccess");
            let PATH = 'https://www.googleapis.com/admin/directory/v1/customer/' + customerId + '/orgunits?access_token=' + a + '&orgUnitPath=/&type=all';
            $.ajax({
                url: PATH,
                type: "GET",
                success: function (data) {
                    var dataOrgUnit = data["organizationUnits"];
                    var dataOrgUnitSort = dataOrgUnit.sort((a, b) => (a["orgUnitPath"] > b["orgUnitPath"]) ? 1 : -1)
                    console.log(dataOrgUnitSort);
                    dataOrgUnitSort.forEach(organizationUnits => {
                        var orgParentId = organizationUnits["parentOrgUnitId"].replace(/\W/g, '');
                        var orgId = organizationUnits["orgUnitId"].replace(/\W/g, '');
                        if (organizationUnits["parentOrgUnitPath"] == "/") {
                            if (document.getElementById(orgId) == null) {
                                $("#demo").append('<li class="list-group-item"><div class="panel-heading"><div class="panel-title"><span class="arrow-down collapsed" data-toggle="collapse" href="#div' + orgId + '" aria-expanded="false"></span><a class="pointer" onclick="getUserInOrgUnit(this)" data-path="/">' + organizationUnits["name"] + '</a></div></div><div id="div' + orgId + '" class="panel-collapse collapse"><ul class="list-group list-group-flush" id="' + orgId + '"></ul></div></li>');
                            }
                        } else {
                            if (document.getElementById(orgId) == null) {
                                $('#' + orgParentId).append('<li class="list-group-item"><div class="panel-heading"><div class="panel-title"><span class="arrow-down collapsed" data-toggle="collapse" href="#div' + orgId + '" aria-expanded="false"></span><a class="pointer" onclick="getUserInOrgUnit(this)" data-path="' + organizationUnits["orgUnitPath"] + '">' + organizationUnits["name"] + '</a></div></div><div id="div' + orgId + '" class="panel-collapse collapse"><ul class="list-group list-group-flush" id="' + orgId + '"></ul></div></li>')
                            }
                        }
                    });


                },
                error: function (error) {
                    console.log("Something went wrong", error);
                }
            });
        }

    });
}

function getUserInOrgUnit(path) {
    var pathOfUser = path.getAttribute("data-path");
    var userPath = [];
    var table = document.getElementById("userInOrgUnit").getElementsByTagName('tbody')[0];
    $("#userInOrgUnit").find("tbody").empty();
    var numberOfUser = 0;
    $.when(getAllUserData()).done(function (data) {
        if (!data == '') {
            users = data["users"];
            users.forEach(user => {
                if (user["orgUnitPath"] == pathOfUser) {
                    userPath.push(user);
                    var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    cell1.innerHTML = user["name"]["familyName"];
                    cell2.innerHTML = user["name"]["givenName"];
                    cell3.innerHTML = user["primaryEmail"];
                    numberOfUser++;
                }
            });
            document.getElementById("numberOfUser").innerHTML = 'Tổng số nhân viên: '+numberOfUser;
        }
    });
}