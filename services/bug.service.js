import { utilService } from './util.service.js'



export const bugService = {
    query,
    getById,
    remove,
    save

}

const bugs = utilService.readJsonFile
    ('./data/bug.json')

function query() {
    return Promise
        .resolve(bugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)

    if (!bug) return Promise.reject('No bug found')
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)

    if (bugIdx === -1) return Promise.reject('Cannot remove bug' + bugId)
    bugs.splice(bugIdx, 1)
    return utilService._saveToFile('./data/bug.json', bugs)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx].title = bugToSave.title
        bugs[bugIdx].severity = bugToSave.severity
    } else {
        bugToSave._id = utilService.makeId()
        bugs.unshift(bugToSave)
    }
    return utilService._saveToFile('./data/bug.json', bugs).then(() => bugToSave)
}













