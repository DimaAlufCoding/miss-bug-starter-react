import fs from 'fs'


export const utilService = {
    makeId,
    readJsonFile,
    _saveToFile

}


function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}


function _saveToFile(path, json) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(json, null, 4)

        fs.writeFile(path, data, err => {
            if (err) reject(err)
            else resolve()
        })
    })
}