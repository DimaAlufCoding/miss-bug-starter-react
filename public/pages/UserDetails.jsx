const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

import { userService } from "../services/user.service.js"
import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.remote.js"

export function UserDetails() {
  const [user, setUser] = useState(null)
  const params = useParams()
  const navigate = useNavigate()
  const [bugs, setBugs] = useState([])

  const userId = params.userId
  useEffect(() => {
    loadUser()
  }, [userId])

  useEffect(() => {
    if (user && user._id) {
      loadUserBugs()
    }
  }, [user])

  function loadUser() {
    userService
      .getById(userId)
      .then((userData) => {
        if (!userData) throw new Error("User not found")
        setUser(userData)
      })
      .catch((err) => {
        console.log("Error loading user:", err)
        navigate("/")
      })
  }

  function loadUserBugs() {
    if (!user || !user._id) return
    bugService
      .query({ userId: user._id })
      .then((res) => {
        setBugs(res || [])
      })
      .catch((err) => {
        console.log("Error loading bugs:", err)
      })
  }
  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log("Deleted Succesfully!")
        setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId))
        showSuccessMsg("Bug removed")
      })
      .catch((err) => {
        console.log("from remove bug", err)
        showErrorMsg("Cannot remove bug")
      })
  }

  function onEditBug(bug) {
    const severity = +prompt("New severity?")
    if (!severity) return alert("Please enter a severity")
    const bugToSave = { ...bug, severity }
    bugService
      .save(bugToSave)
      .then((savedBug) => {
        console.log("Updated Bug:", savedBug)
        setBugs((prevBugs) =>
          prevBugs.map((currBug) =>
            currBug._id === savedBug._id ? savedBug : currBug
          )
        )
        showSuccessMsg("Bug updated")
      })
      .catch((err) => {
        console.log("from edit bug", err)
        showErrorMsg("Cannot update bug")
      })
  }

  function onBack() {}

  if (!user) return <div>Loading...</div>

  return (
    <section className="user-details">
      <h1>User {user.fullname}</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      {bugs.length > 0 ? (
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      ) : (
        <p>No bugs available for this user.</p>
      )}
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem
        accusantium, itaque ut voluptates quo? Vitae animi maiores nisi,
        assumenda molestias odit provident quaerat accusamus, reprehenderit
        impedit, possimus est ad?
      </p>
      <button>
        <Link to="/bug" style={{ textDecoration: "none", color: "inherit" }}>
          Back to List
        </Link>
      </button>{" "}
    </section>
  )
}
