import { utilService } from './util.service.js'
const PAGE_SIZE = 5

export const bugService = {
    query,
    getById,
    remove,
    save

}

const bugs = utilService.readJsonFile('./data/bug.json')

function query(filterBy ={}, sortBy) {
    return Promise.resolve(bugs)
        .then(bugs => {
            if (filterBy.txt) {
                const regex = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regex.test(bug.title))
            }
            if (filterBy.minSeverity) {
                console.log('filterBy.minSeverity:', filterBy.minSeverity)
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }
            if (filterBy.labels && filterBy.labels.length) {
                console.log('filterBy.labels:', filterBy.labels)
                bugs = bugs.filter(bug => filterBy.labels.every(label => bug.labels.includes(label)))
            }

            if (filterBy.pageIdx !== undefined && filterBy.pageIdx !== null && filterBy.pageIdx !== '') {
                console.log('filterBy.pageIdx:', filterBy.pageIdx)
                const startIdx = (filterBy.pageIdx) * PAGE_SIZE
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }
            if (filterBy.userId) {
                bugs = bugs.filter(bug => bug.creator._id === filterBy.userId)
            }


            if (sortBy === 'title') {
                bugs = bugs.sort((a, b) => a.title.localeCompare(b.title))
            }

            if (sortBy === 'severity') {
                bugs = bugs.sort((a, b) => a.severity - b.severity)
            }

            if (sortBy === 'createdAt') {
                bugs = bugs.sort((a, b) => a.createdAt - b.createdAt)
            }
            return bugs
        })

}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)

    if (!bug) return Promise.reject('No bug found')
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)

    if (bugIdx === -1) return Promise.reject('Cannot remove bug' + bugId)

    if (!loggedinUser.isAdmin &&
        bugs[bugIdx].creator._id !== loggedinUser._id) {
        return Promise.reject(`Not your bug`)
    }

    bugs.splice(bugIdx, 1)
    return utilService._saveToFile('./data/bug.json', bugs)
}

function save(bugToSave, loggedinUser) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)

        if (!loggedinUser.isAdmin &&
            bugs[bugIdx].creator._id !== loggedinUser._id) {
            return Promise.reject(`Not your bug`)
        }

        bugs[bugIdx].title = bugToSave.title
        bugs[bugIdx].severity = bugToSave.severity
    } else {

        bugToSave._id = utilService.makeId()
        bugToSave.creator = { _id: loggedinUser._id, fullname: loggedinUser.fullname }
        bugs.unshift(bugToSave)
    }
    return utilService._saveToFile('./data/bug.json', bugs).then(() => bugToSave)
}













