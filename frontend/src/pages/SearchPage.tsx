import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axiosClient from "../api/axiosClient";
import { AppointmentResponse } from "../types";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AppointmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [saveNoteLoading, setSaveNoteLoading] = useState(false);
  const [noteMsg, setNoteMsg] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) { setError("Please enter an appointment number."); return; }
    setLoading(true); setError(""); setResult(null); setNoteMsg("");
    try {
      const res = await axiosClient.get<AppointmentResponse>(`/appointments/${query.trim()}`);
      setResult(res.data);
      setNotes(res.data.notes ?? "");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Appointment not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!result) return;
    setSaveNoteLoading(true); setNoteMsg("");
    try {
      const updated = await axiosClient.patch<AppointmentResponse>(
        `/appointments/${result.appointmentNumber}/notes`,
        { notes }
      );
      setResult(updated.data);
      setNoteMsg("Notes saved!");
    } catch {
      setNoteMsg("Failed to save notes.");
    } finally {
      setSaveNoteLoading(false);
    }
  };

  const handleStatus = async (status: string) => {
    if (!result) return;
    setStatusLoading(true);
    try {
      const updated = await axiosClient.patch<AppointmentResponse>(
        `/appointments/${result.appointmentNumber}/status`,
        { status }
      );
      setResult(updated.data);
    } catch {
      setError("Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const statusBadge = (status: string) => (
    <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>Search Appointment</h2>
          <p>Enter the appointment number to view full details.</p>
        </div>

        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <form id="search-form" onSubmit={handleSearch} style={{ display: "flex", gap: "var(--space-3)" }}>
            <input
              id="search-input"
              type="text"
              placeholder="e.g. SDC-20260903-0001"
              value={query}
              onChange={e => { setQuery(e.target.value); setError(""); }}
              style={{ flex: 1, fontFamily: "monospace" }}
            />
            <button id="search-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : "Search"}
            </button>
          </form>
          {error && <div className="alert alert-error" style={{ marginTop: "var(--space-4)", marginBottom: 0 }}>Warning: {error}</div>}
        </div>

        {result && (
          <div className="card">
            <div className="card-title">
              Appointment Details
              <span style={{ marginLeft: "auto" }}>{statusBadge(result.status)}</span>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Appointment Number</div>
                <div className="detail-value" style={{ fontFamily: "monospace", color: "var(--color-primary-light)" }}>
                  {result.appointmentNumber}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Status</div>
                <div className="detail-value">{statusBadge(result.status)}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Patient Name</div>
                <div className="detail-value">{result.patientName}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Contact Number</div>
                <div className="detail-value">{result.contactNumber}</div>
              </div>
              <div className="detail-item full-width">
                <div className="detail-label">Address</div>
                <div className="detail-value">{result.address}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Dentist</div>
                <div className="detail-value">{result.dentistName}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Specialization</div>
                <div className="detail-value">{result.dentistSpecialization}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Treatment Type</div>
                <div className="detail-value">{result.treatmentType.replace(/_/g, " ")}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Appointment Date</div>
                <div className="detail-value">{result.appointmentDate}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Appointment Time</div>
                <div className="detail-value">{result.appointmentTime}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Registered At</div>
                <div className="detail-value" style={{ fontSize: 13 }}>
                  {new Date(result.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <hr className="divider" />

            <div style={{ marginBottom: "var(--space-4)" }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>
                Treatment Notes
              </div>
              <textarea
                id="treatment-notes"
                rows={3}
                placeholder="Add treatment notes, observations, or follow-up instructions..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ width: "100%", resize: "vertical", marginBottom: "var(--space-2)" }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <button
                  id="save-notes-btn"
                  className="btn btn-primary"
                  onClick={handleSaveNotes}
                  disabled={saveNoteLoading}
                  style={{ padding: "6px 16px" }}
                >
                  {saveNoteLoading ? <span className="spinner" /> : "Save Notes"}
                </button>
                {noteMsg && (
                  <span style={{ fontSize: 13, color: noteMsg.includes("saved") ? "var(--color-success)" : "var(--color-danger)" }}>
                    {noteMsg}
                  </span>
                )}
              </div>
            </div>

            <hr className="divider" />

            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <button
                id="goto-bill-btn"
                className="btn btn-accent"
                onClick={() => navigate(`/bill?apptNum=${result.appointmentNumber}`)}
              >
                Generate Bill
              </button>

              {result.status === "SCHEDULED" && (
                <>
                  <button
                    id="complete-btn"
                    className="btn btn-primary"
                    disabled={statusLoading}
                    onClick={() => handleStatus("COMPLETED")}
                    style={{ background: "var(--color-success)", borderColor: "var(--color-success)" }}
                  >
                    {statusLoading ? <span className="spinner" /> : "Mark Complete"}
                  </button>
                  <button
                    id="cancel-btn"
                    className="btn btn-secondary"
                    disabled={statusLoading}
                    onClick={() => handleStatus("CANCELLED")}
                    style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)" }}
                  >
                    Cancel Appointment
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
