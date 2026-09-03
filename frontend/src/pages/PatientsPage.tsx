import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axiosClient from "../api/axiosClient";
import { PatientResponse, AppointmentResponse } from "../types";

const PatientsPage = () => {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [filtered, setFiltered] = useState<PatientResponse[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PatientResponse | null>(null);
  const [history, setHistory] = useState<AppointmentResponse[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", address: "", contactNumber: "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    axiosClient.get<PatientResponse[]>("/patients")
      .then(r => { setPatients(r.data); setFiltered(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(patients.filter(p =>
      p.name.toLowerCase().includes(q) || p.contactNumber.includes(q)
    ));
  }, [query, patients]);

  const openHistory = (p: PatientResponse) => {
    setSelected(p);
    setEditMode(false);
    setSaveMsg("");
    setEditForm({ name: p.name, address: p.address, contactNumber: p.contactNumber });
    setHistoryLoading(true);
    axiosClient.get<AppointmentResponse[]>(`/patients/${p.id}/appointments`)
      .then(r => setHistory(r.data))
      .finally(() => setHistoryLoading(false));
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true); setSaveMsg("");
    try {
      const updated = await axiosClient.put<PatientResponse>(`/patients/${selected.id}`, editForm);
      setPatients(prev => prev.map(p => p.id === selected.id ? updated.data : p));
      setSelected(updated.data);
      setEditMode(false);
      setSaveMsg("Saved successfully!");
    } catch {
      setSaveMsg("Failed to save.");
    } finally {
      setSaving(false);
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
          <h2>👥 Patient Records</h2>
          <p>View and manage all registered patients and their appointment history.</p>
        </div>

        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <input
            id="patient-search-input"
            type="text"
            placeholder="Search by name or contact number..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: "var(--space-6)" }}>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="card-title" style={{ padding: "var(--space-4) var(--space-5)" }}>
              All Patients ({filtered.length})
            </div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-text-muted)" }}>
                <div className="spinner" style={{ margin: "0 auto" }} /> Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-text-muted)" }}>
                <div style={{ fontSize: 48 }}>👥</div>
                <p>No patients found.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Appointments</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr
                        key={p.id}
                        style={{ cursor: "pointer", background: selected?.id === p.id ? "var(--color-bg-hover)" : undefined }}
                        onClick={() => openHistory(p)}
                      >
                        <td><strong>{p.name}</strong></td>
                        <td style={{ fontFamily: "monospace", fontSize: 13 }}>{p.contactNumber}</td>
                        <td>
                          <span className="badge badge-scheduled">{p.totalAppointments}</span>
                        </td>
                        <td>
                          <button
                            id={`view-patient-${p.id}`}
                            className="btn btn-secondary"
                            style={{ padding: "4px 10px", fontSize: 12 }}
                            onClick={e => { e.stopPropagation(); openHistory(p); }}
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selected && (
            <div className="card">
              <div className="card-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>📄 {selected.name}</span>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  {!editMode && (
                    <button
                      id="edit-patient-btn"
                      className="btn btn-primary"
                      style={{ padding: "4px 12px", fontSize: 13 }}
                      onClick={() => setEditMode(true)}
                    >
                      ✏️ Edit
                    </button>
                  )}
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "4px 12px", fontSize: 13 }}
                    onClick={() => setSelected(null)}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {editMode ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--color-text-muted)", display: "block", marginBottom: 4 }}>Full Name</label>
                    <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--color-text-muted)", display: "block", marginBottom: 4 }}>Address</label>
                    <input value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--color-text-muted)", display: "block", marginBottom: 4 }}>Contact Number</label>
                    <input value={editForm.contactNumber} onChange={e => setEditForm(f => ({ ...f, contactNumber: e.target.value }))} />
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    <button id="save-patient-btn" className="btn btn-primary" onClick={handleSave} disabled={saving}>
                      {saving ? <span className="spinner" /> : "💾 Save"}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                  {saveMsg && <div className={`alert ${saveMsg.includes("success") ? "alert-success" : "alert-error"}`}>{saveMsg}</div>}
                </div>
              ) : (
                <div className="detail-grid" style={{ marginBottom: "var(--space-4)" }}>
                  <div className="detail-item">
                    <div className="detail-label">Contact</div>
                    <div className="detail-value" style={{ fontFamily: "monospace" }}>{selected.contactNumber}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Total Appointments</div>
                    <div className="detail-value">{selected.totalAppointments}</div>
                  </div>
                  <div className="detail-item full-width">
                    <div className="detail-label">Address</div>
                    <div className="detail-value">{selected.address}</div>
                  </div>
                </div>
              )}

              <hr className="divider" />
              <div className="card-title" style={{ fontSize: 14, marginBottom: "var(--space-3)" }}>Appointment History</div>

              {historyLoading ? (
                <div style={{ textAlign: "center", padding: "var(--space-4)", color: "var(--color-text-muted)" }}>
                  <span className="spinner" style={{ margin: "0 auto" }} />
                </div>
              ) : history.length === 0 ? (
                <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>No appointments found.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                  {history.slice(0, 5).map(a => (
                    <div key={a.id} style={{
                      background: "var(--color-bg-hover)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--space-3)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 13
                    }}>
                      <div>
                        <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--color-text-muted)" }}>{a.appointmentNumber}</div>
                        <div style={{ fontWeight: 600 }}>{a.treatmentType.replace(/_/g, " ")}</div>
                        <div style={{ color: "var(--color-text-muted)", fontSize: 12 }}>{a.appointmentDate} · {a.dentistName}</div>
                      </div>
                      {statusBadge(a.status)}
                    </div>
                  ))}
                  {history.length > 5 && (
                    <p style={{ fontSize: 12, color: "var(--color-text-muted)", textAlign: "center" }}>
                      +{history.length - 5} more appointments
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientsPage;
