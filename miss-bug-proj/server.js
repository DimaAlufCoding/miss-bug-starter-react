import express from 'express'
const app = express()
app.get('/', (req, res) => res.send('Hello there'))

app.listen(3036, () => console.log('1Server ready at port 3036'))