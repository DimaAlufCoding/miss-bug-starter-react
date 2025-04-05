import express, { text } from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'


import path from 'path';



const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.listen(3036, () => console.log('Server ready at port 3036'))


// Read all the bugs
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        labels: req.query.labels || [],
        pageIdx: req.query.pageIdx,
        userId: req.query.userId || ''
    }
    const sortBy = req.query.sortBy || ''

    bugService.query(filterBy, sortBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Could not get bugs')
        })
})

// Create a bug
app.post('/api/bug', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send(`Can't add bug`)

    const bugToSave = req.body

    bugService.save(bugToSave, loggedinUser)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot add bug', err)
            res.status(500).send('Could not add bug')
        })
})

// Edit a bug
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send(`Can't update bug`)

    const bugToSave = req.body

    bugService.save(bugToSave, loggedinUser)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot update bug', err)
            res.status(500).send('Could update bug')
        })
})

// Read a single bug
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { visitedBugs = [] } = req.cookies

    if (visitedBugs.length >= 3) return res.status(403).send('Wait for a bit')
    if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

    res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Could not get bug')
        })
})

// Delete a bug
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send(`Can't remove bug`)

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => res.send('Bug removed'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Could not remove bug')
        })
})



// User API 
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

// Auth API
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    authService.checkLogin(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch((err) => {
            console.log('err:', err)
            res.status(404).send('Invalid Credentials')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.add(credentials)
        .then(user => {
            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
        .catch(err => {
            // console.log('err:', err)
            res.status(400).send('Username taken.')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

// Fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)


