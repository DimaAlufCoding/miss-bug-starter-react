import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'



export const bugService = {
    query,
    getById,
    remove,

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

    if (!bugIdx) return Promise.reject('Cannot remove bug' + bugId)
    bugs.splice(bugIdx, 1)
    return utilService._saveToFile('./data/bug.json', bugs)
}













