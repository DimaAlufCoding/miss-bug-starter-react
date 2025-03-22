import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'



export const bugService = {
    query,
    getById,
    save,
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
    return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        return storageService.post(STORAGE_KEY, bug)
    }
}



function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}