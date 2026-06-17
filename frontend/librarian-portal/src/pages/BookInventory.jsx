import { useEffect, useState, useCallback } from "react";

import BookForm from "../components/BookForm";
import libraryService from "../services/libraryService";

/**
 * Librarian inventory management (Task 12.27). Add / update / remove books.
 */
export default function BookInventory() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 20, includeInactive: "true" };
      if (search) params.search = search;
      const res = await libraryService.getBooks(params);
      setBooks(res.data || []);
      setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(payload) {
    await libraryService.createBook(payload);
    setCreating(false);
    load();
  }

  async function handleUpdate(payload) {
    const { isbn, _id, availableCopies, status, ...rest } = payload;
    await libraryService.updateBook(editing._id, rest);
    setEditing(null);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Deactivate this book?")) return;
    await libraryService.deleteBook(id);
    load();
  }

  return (
    <div className="page">
      <div className="page-head">
        <h2>Book Inventory ({pagination.total})</h2>
        <button className="btn" onClick={() => setCreating((c) => !c)}>
          {creating ? "Close" : "+ Add Book"}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {creating && <BookForm onSubmit={handleCreate} submitLabel="Add Book" />}

      {editing && (
        <div className="edit-block">
          <h3>Edit — {editing.title}</h3>
          <BookForm
            initial={editing}
            onSubmit={handleUpdate}
            submitLabel="Update Book"
            isbnReadOnly
          />
          <button className="ghost" onClick={() => setEditing(null)}>
            Cancel edit
          </button>
        </div>
      )}

      <form
        className="student-search"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
        }}
      >
        <input
          type="search"
          placeholder="Search title/author/ISBN/category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Avail/Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr
                key={b._id}
                style={{ opacity: b.status === "ACTIVE" ? 1 : 0.5 }}
              >
                <td>{b.isbn}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category}</td>
                <td>
                  {b.availableCopies}/{b.totalCopies}
                </td>
                <td>{b.status}</td>
                <td className="actions">
                  <button onClick={() => setEditing(b)}>Edit</button>
                  <button onClick={() => handleDelete(b._id)}>Remove</button>
                </td>
              </tr>
            ))}
            {!books.length && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No books.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
