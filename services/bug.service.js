import { utilService } from './util.service.js'
const PAGE_SIZE = 5

export const bugService = {
    query,
    getById,
    remove,
    save

}

const bugs = utilService.readJsonFile('./data/bug.json')

function query(filterBy, sortBy) {
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


            if (sortBy === 'title') {
                bugs = bugs.sort((a, b) => a.title.localeCompare(b.title))
            }

            if (sortBy === 'severity') {
                bugs = bugs.sort((a, b) => a.severity - b.severity)
            }

            if(sortBy === 'createdAt'){
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













