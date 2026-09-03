import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

interface MedRow {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const PrescriptionPage = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    patientName: "",
    patientAge: "",
    patientContact: "",
    date: today,
    diagnosis: "",
    notes: "",
    dentistName: user?.fullName ?? "",
  });
  const [meds, setMeds] = useState<MedRow[]>([
    { id: 1, name: "", dosage: "", frequency: "Twice daily", duration: "5 days" }
  ]);
  const [nextId, setNextId] = useState(2);
  const [error, setError] = useState("");

  const addMed = () => {
    setMeds(prev => [...prev, { id: nextId, name: "", dosage: "", frequency: "Twice daily", duration: "5 days" }]);
    setNextId(n => n + 1);
  };
  const removeMed = (id: number) => setMeds(prev => prev.filter(m => m.id !== id));
  const updateMed = (id: number, field: keyof Omit<MedRow, "id">, value: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const validate = () => {
    if (!form.patientName.trim()) {
      setError("Patient Name is required.");
      return false;
    }
    if (!form.date.trim()) {
      setError("Date is required.");
      return false;
    }
    if (!form.dentistName.trim()) {
      setError("Prescribing Dentist Name is required.");
      return false;
    }
    const hasValidMed = meds.some(m => m.name.trim() !== "");
    if (!hasValidMed) {
      setError("At least one medication name is required.");
      return false;
    }
    setError("");
    return true;
  };

  const handlePrint = () => {
    if (validate()) {
      window.print();
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>💊 Prescription Generator</h2>
          <p>Fill in the details and print a prescription for your patient.</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "var(--space-4)" }}>{error}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div className="card">
              <div className="card-title">🧑 Patient Information</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--color-text-muted)", display: "block", marginBottom: 4 }}>Patient Name *</label>
                  <input id="rx-patient-name" placeholder="Full name" value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--color-text-muted)", display: "block", marginBottom: 4 }}>Age</label>
                    <input id="rx-patient-age" placeholder="e.g. 34" value={form.patientAge} onChange={e => setForm(f => ({ ...f, patientAge: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--color-text-muted)", display: "block", marginBottom: 4 }}>Contact</label>
                    <input id="rx-patient-contact" placeholder="Phone number" value={form.patientContact} onChange={e => setForm(f => ({ ...f, patientContact: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--color-text-muted)", display: "block", marginBottom: 4 }}>Date</label>
                  <input id="rx-date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">🦷 Clinical Details</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--color-text-muted)", display: "block", marginBottom: 4 }}>Diagnosis / Condition</label>
                  <input id="rx-diagnosis" placeholder="e.g. Tooth abscess, Gingivitis" value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--color-text-muted)", display: "block", marginBottom: 4 }}>Additional Notes</label>
                  <textarea id="rx-notes" rows={3} placeholder="e.g. Avoid spicy food, Return if symptoms worsen..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: "vertical" }} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                💊 Medications
                <button id="add-med-btn" className="btn btn-primary" style={{ padding: "4px 12px", fontSize: 13 }} onClick={addMed}>+ Add</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {meds.map((m, i) => (
                  <div key={m.id} style={{ background: "var(--color-bg-hover)", borderRadius: "var(--radius-md)", padding: "var(--space-3)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)" }}>Medication {i + 1}</span>
                      {meds.length > 1 && (
                        <button className="btn btn-secondary" style={{ padding: "2px 8px", fontSize: 11 }} onClick={() => removeMed(m.id)}>✕</button>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)" }}>
                      <input placeholder="Drug name" value={m.name} onChange={e => updateMed(m.id, "name", e.target.value)} style={{ fontSize: 13 }} />
                      <input placeholder="Dosage (e.g. 500mg)" value={m.dosage} onChange={e => updateMed(m.id, "dosage", e.target.value)} style={{ fontSize: 13 }} />
                      <input placeholder="Frequency" value={m.frequency} onChange={e => updateMed(m.id, "frequency", e.target.value)} style={{ fontSize: 13 }} />
                      <input placeholder="Duration" value={m.duration} onChange={e => updateMed(m.id, "duration", e.target.value)} style={{ fontSize: 13 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title">🧑‍⚕️ Prescribing Dentist</div>
              <input id="rx-dentist-name" value={form.dentistName} onChange={e => setForm(f => ({ ...f, dentistName: e.target.value }))} placeholder="Dr. Full Name" />
            </div>

            <button id="print-prescription-btn" className="btn btn-primary" style={{ width: "100%", padding: "var(--space-3)" }} onClick={handlePrint}>
              🖨️ Print Prescription
            </button>
          </div>

          {/* Live Preview */}
          <div>
            <div className="card" id="prescription-preview" style={{
              background: "white",
              color: "#1a1a1a",
              padding: "var(--space-8)",
              fontFamily: "Georgia, serif",
              minHeight: 600,
              border: "1px solid #ddd"
            }}>
              <div style={{ borderBottom: "2px solid #2563eb", paddingBottom: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#1e40af" }}>🦷 Sunrise Dental Clinic</div>
                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Professional Dental Care</div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 13, color: "#64748b" }}>
                    <div>Date: <strong>{form.date || today}</strong></div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>Patient Information</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 14 }}>
                  <div><span style={{ color: "#94a3b8" }}>Name:</span> <strong>{form.patientName || "—"}</strong></div>
                  <div><span style={{ color: "#94a3b8" }}>Age:</span> {form.patientAge || "—"}</div>
                  <div><span style={{ color: "#94a3b8" }}>Contact:</span> {form.patientContact || "—"}</div>
                </div>
              </div>

              {form.diagnosis && (
                <div style={{ marginBottom: 20, padding: "10px 14px", background: "#f1f5f9", borderRadius: 6, fontSize: 14 }}>
                  <span style={{ color: "#64748b", fontSize: 12 }}>Diagnosis:</span>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{form.diagnosis}</div>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 22, color: "#2563eb", marginBottom: 12 }}>℞</div>
                {meds.filter(m => m.name).map((m, i) => (
                  <div key={m.id} style={{ marginBottom: 14, paddingLeft: 16, borderLeft: "3px solid #2563eb" }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{i + 1}. {m.name} {m.dosage && `(${m.dosage})`}</div>
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>
                      {m.frequency && <span>{m.frequency}</span>}
                      {m.frequency && m.duration && <span> — </span>}
                      {m.duration && <span>for {m.duration}</span>}
                    </div>
                  </div>
                ))}
                {meds.every(m => !m.name) && (
                  <div style={{ color: "#94a3b8", fontSize: 14 }}>No medications added.</div>
                )}
              </div>

              {form.notes && (
                <div style={{ marginBottom: 20, padding: "10px 14px", background: "#fffbeb", borderRadius: 6, fontSize: 13 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Notes:</div>
                  <div>{form.notes}</div>
                </div>
              )}

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 20, marginTop: 20 }}>
                <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Signature</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Dr. {form.dentistName || "—"}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Sunrise Dental Clinic</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media print {
          .sidebar, .page-header, .btn, button, .main-content > div:first-child { display: none !important; }
          .main-content { padding: 0 !important; }
          #prescription-preview { border: none !important; box-shadow: none !important; page-break-inside: avoid; }
          .page-wrapper { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default PrescriptionPage;
