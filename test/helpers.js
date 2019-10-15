const User = require('../src/models/User');

module.exports.createUser = async () => {
    let payload = {
        name: 'Test',
        email: 'test@mail.com',
        password: '123456',
    }
    const user = new User(payload)
    await user.save()
    const token = await user.generateAuthToken()
    return { user, token }
}
;