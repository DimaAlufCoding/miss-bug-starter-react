const { Link } = ReactRouterDOM;

import { BugPreview } from "./BugPreview.jsx";
import { authService } from "../services/auth.service.js";

export function BugList({ bugs, onRemoveBug, onEditBug }) {
  if (!bugs) return <div>Loading...</div>;
  const loggedinUser = authService.getLoggedinUser();

  function isAllowed(bug) {
    if (!loggedinUser) return false;

    if (loggedinUser.isAdmin || loggedinUser._id === bug.creator._id)
      return true;

    return false;
  }

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li key={bug._id}>
          <BugPreview bug={bug} />
          <section className="actions">
            <Link to={`/bug/${bug._id}`}>
              <button>Details</button>
            </Link>
            {isAllowed(bug) && (
              <div>
                <button onClick={() => onEditBug(bug)}>Edit</button>
                <button onClick={() => onRemoveBug(bug._id)}>x</button>
              </div>
            )}
          </section>
        </li>
      ))}
    </ul>
  );
}
