import express from 'express'
import { bugService } from '../services/bug.service.js'

const app = express()
app.listen(3036, () => console.log('Server ready at port 3036'))


app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.json(bugs))
})

app.get('/api/bug/save', (req, res) => { })

app.get('/api/bug/:bugId', (req, res) => { })

app.get('/api/bug/:bugId/remove', (req, res) => { })

app.get('/', (req, res) => res.send('Hello there'))




