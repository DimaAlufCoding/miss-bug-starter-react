

const STORAGE_KEY = 'bugs'
const BASE_URL = '/api/bug/'



export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy, sortBy) {
    const filterSortBy = { ...filterBy, ...sortBy }
    return axios.get(BASE_URL, { params: filterSortBy }).then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
}


function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + bug._id, bug)
            .then(res => res.data)
            .catch(err => {
                console.log('err:', err)
                throw err
            })
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
            .catch(err => {
                console.log('err:', err)
                throw err
            })
    }
}




function getDefaultFilter() {
    return { txt: '', minSeverity: 0 ,pageIdx: undefined}
}