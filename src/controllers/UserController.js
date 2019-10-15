const User = require('../models/User')

class UserController{
    async index(req, res) {
        try {
            const users = await User.find()
            res.status(200).send({ users })
        } catch (error) {
            res.status(400).send(error)
        }
    }

    async store(req, res) {
        try {
            const user = new User(req.body)
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ user, token })
        } catch (error) {
            res.status(422).send(error)
        }
    }

    async update(req, res) {
        try {
            const user = req.user
            await user.update(req.body)
            res.status(201).send({ user })
        } catch (error) {
            res.status(422).send(error)
        }
    }

    async delete(req, res) {
        try {
            await User.deleteOne({ _id: req.params.id });
            res.status(204).send()
        } catch (error) {
            res.status(400).send(error)
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findByCredentials(email, password)
            const token = await user.generateAuthToken()
            res.send({ user, token })
        } catch (error) {
            res.status(401).send({
                error: 'Login failed! Check authentication credentials'
            })
        }
    }

    async me(req, res) {
        res.send(req.user)
    }

    async logout(req, res) {
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token != req.token
            })
            await req.user.save()
            res.send()
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

module.exports = new UserController