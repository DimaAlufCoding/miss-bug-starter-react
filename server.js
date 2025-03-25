import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'



const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.listen(3036, () => console.log('Server ready at port 3036'))


// Read all the bugs
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Could not get bugs')
        })
})

// Create a bug
app.post('/api/bug', (req, res) => {
    const bugToSave = req.body
    
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Could not save bug')
        })
})

// Edit a bug
app.put('/api/bug/:bugId', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        severity: +req.query.severity,
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Could not save bug')
        })
})

// Read a single bug
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { visitedBugs = [] } = req.cookies

    if(visitedBugs.length >=3) return res.status(403).send('Wait for a bit')
    if(!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

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
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('Bug removed'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Could not remove bug')
        })
})



