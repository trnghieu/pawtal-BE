const { nanoid } = require("nanoid");

exports.generatePetCode = () => `PAW-${nanoid(6).toUpperCase()}`; // dễ in tag
