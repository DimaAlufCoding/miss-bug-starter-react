const { useState, useEffect } = React;

import { bugService } from "../services/bug.service.remote.js";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";

import { BugFilter } from "../cmps/BugFilter.jsx";
import { BugList } from "../cmps/BugList.jsx";
import { authService } from "../services/auth.service.js";


export function BugIndex() {
  const [bugs, setBugs] = useState(null);
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter());
  const loggedinUser = authService.getLoggedinUser()


  useEffect(loadBugs, [filterBy]);

  function loadBugs() {
    bugService
      .query(filterBy)
      .then(setBugs)
      .catch((err) => showErrorMsg(`Couldn't load bugs - ${err}`));
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId);
        setBugs(bugsToUpdate);
        showSuccessMsg("Bug removed");
      })
      .catch((err) => showErrorMsg(`Cannot remove bug`, err));
  }

  function onAddBug() {
    const bug = {
      title: prompt("Bug title?", "Bug " + Date.now()),
      severity: +prompt("Bug severity?", 3),
    };

    bugService
      .save(bug)
      .then((savedBug) => {
        setBugs([...bugs, savedBug]);
        showSuccessMsg("Bug added");
      })
      .catch((err) => showErrorMsg(`Cannot add bug`, err));
  }

  function onEditBug(bug) {
    const severity = +prompt("New severity?", bug.severity);
    const bugToSave = { ...bug, severity };

    bugService
      .save(bugToSave)
      .then((savedBug) => {
        const bugsToUpdate = bugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        );

        setBugs(bugsToUpdate);
        showSuccessMsg("Bug updated");
      })
      .catch((err) => showErrorMsg("Cannot update bug", err));
  }

  function onSetFilterBy(filterBy) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }));
  }

  function onSetPage(diff) {
    setFilterBy((prevFilter) => ({
      ...prevFilter,
      pageIdx: prevFilter.pageIdx + diff,
    }));
  }

  return (
    <section className="bug-index main-content">
      <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
      <header>
        <h3>Bug List</h3>
        {loggedinUser ? (
          <button onClick={onAddBug}>Add New Bug</button>
        ) : (
          <p>Please log in to add bugs.</p>
        )}
      </header>

      <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />

      <label>
        Use Paging
        <input
          type="checkbox"
          onChange={(ev) => {
            setFilterBy((prevFilter) => ({
              ...prevFilter,
              pageIdx: ev.target.checked ? 0 : undefined,
            }));
          }}
        />
      </label>

      <div hidden={filterBy.pageIdx === undefined}>
        <button
          disabled={filterBy.pageIdx === 0}
          onClick={() => {
            onSetPage(-1);
          }}
        >
          Prev Page
        </button>
        <span>Page: {filterBy.pageIdx + 1}</span>
        <button
          onClick={() => {
            onSetPage(1);
          }}
        >
          Next Page
        </button>
      </div>

      <label>
        Sorting
        <select
          onChange={(ev) => {
            setFilterBy((prevFilter) => ({
              ...prevFilter,
              sortBy: ev.target.value,
            }));
          }}
        >
          <option value="title">Title</option>
          <option value="severity">Severity</option>
          <option value="createdAt">Created At</option>
        </select>
      </label>
    </section>
  );
}
