const e = require("express");

function findDirector(data) {
    const crews = data.crew || [];
    for (const crew of crews) {
        if (crew.job === "Director") {
            return crew.name;
        }
    }
    return "N/A";
}

exports.findDirector = findDirector;