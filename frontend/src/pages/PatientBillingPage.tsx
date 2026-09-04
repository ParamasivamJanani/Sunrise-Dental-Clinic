import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';

interface BillResponse {
  billId: number;
  appointmentNumber: string;
  dentistName: string;
  treatmentType: string;
  appointmentDate: string;
  treatmentCost: number;
  consultationFee: number;
  discount: number;
  totalAmount: number;
  generatedAt: string;
  paid: boolean;
}

const PatientBillingPage = () => {
  const [bills, setBills] = useState<BillResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    axiosClient.get<BillResponse[]>('/bills/me')
      .then(res => setBills(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: number) => setExpanded(prev => (prev === id ? null : id));

  const fmt = (n: number) => `LKR ${n.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>🧾 My Bills</h2>
          <p>View all invoices and payment history for your treatments.</p>
        </div>

        <div className="card">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
          ) : bills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
              You have no bills yet.
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Treatment</th>
                    <th>Dentist</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => (
                    <>
                      <tr key={bill.billId}>
                        <td>{bill.appointmentDate}</td>
                        <td>{bill.treatmentType.replace(/_/g, ' ')}</td>
                        <td>{bill.dentistName}</td>
                        <td style={{ fontWeight: 600 }}>{fmt(bill.totalAmount)}</td>
                        <td>
                          <span className={`badge ${bill.paid ? 'badge-completed' : 'badge-scheduled'}`}>
                            {bill.paid ? 'PAID' : 'UNPAID'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 12px', fontSize: '0.82rem' }}
                            onClick={() => toggle(bill.billId)}
                          >
                            {expanded === bill.billId ? 'Hide' : 'View Receipt'}
                          </button>
                        </td>
                      </tr>
                      {expanded === bill.billId && (
                        <tr key={`${bill.billId}-detail`}>
                          <td colSpan={6} style={{ padding: 0 }}>
                            <div style={{
                              background: 'var(--color-surface-2)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-md)',
                              padding: 'var(--space-5)',
                              margin: 'var(--space-2) var(--space-4)',
                            }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', maxWidth: '480px' }}>
                                <div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Invoice #</div>
                                  <div style={{ fontWeight: 600 }}>{bill.appointmentNumber}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Generated</div>
                                  <div>{new Date(bill.generatedAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                              <hr style={{ margin: 'var(--space-4) 0', borderColor: 'var(--color-border)' }} />
                              <div style={{ maxWidth: '360px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                                  <span style={{ color: 'var(--color-text-secondary)' }}>Treatment Cost</span>
                                  <span>{fmt(bill.treatmentCost)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                                  <span style={{ color: 'var(--color-text-secondary)' }}>Consultation Fee</span>
                                  <span>{fmt(bill.consultationFee)}</span>
                                </div>
                                {bill.discount > 0 && (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: 'var(--color-success)' }}>
                                    <span>Discount</span>
                                    <span>− {fmt(bill.discount)}</span>
                                  </div>
                                )}
                                <hr style={{ margin: 'var(--space-2) 0', borderColor: 'var(--color-border)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontWeight: 700, fontSize: '1.05rem' }}>
                                  <span>Total</span>
                                  <span>{fmt(bill.totalAmount)}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientBillingPage;
