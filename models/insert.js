const { Role } = require('./role');
const { Gender } = require('./gender');
const { User } = require('./user');
const { Status } = require('./status');

insertRoles = async() => {
    console.log('insert roles...');
    await Role.insertMany([
        {
            name: "Admin"
        }
    ]);
    console.log('insert roles successfully...');
    console.log(updateInfo);
};

function main() {
    insertRoles();
}

main();