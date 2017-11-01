let Dto = require("./Dto");
class UserDto extends Dto {

    constructor(objProperties) {
        super();
        this.id = objProperties.id || null;
        this.username = objProperties.username || '';
        this.password = objProperties.password || '';
        this.accessLevel = objProperties.accessLevel || 'any';
        this.screenName = objProperties.screenName || '';
    }

}
module.exports = UserDto;