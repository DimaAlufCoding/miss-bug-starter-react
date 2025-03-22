import express from 'express'
import { bugService } from '../services/bug.service.js'

const app = express()
app.listen(3036, () => console.log('Server ready at port 3036'))


// Read all the bugs
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.log('err', err)
            res.status(500).send('Could not get bugs')
        })
})

// Create a bug
app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        severity: +req.query.severity,
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            console.log('err', err)
            res.status(500).send('Could not save bug')
        })
})

// Read a single bug
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            console.log('err', err)
            res.status(500).send('Could not get bug')
        })
})

// Delete a bug
app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('Bug removed'))
        .catch(err => {
            console.log('err', err)
            res.status(500).send('Could not remove bug')
        })
})