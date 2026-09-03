import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import { BillResponse } from '../types';
import { useSearchParams } from 'react-router-dom';

const TREATMENT_LABELS: Record<string, string> = {
  CONSULTATION: 'Consultation',
  TEETH_CLEANING: 'Teeth Cleaning',
  TOOTH_FILLING: 'Tooth Filling',
  TOOTH_EXTRACTION: 'Tooth Extraction',
  ROOT_CANAL: 'Root Canal',
  TEETH_WHITENING: 'Teeth Whitening',
  BRACES_CONSULTATION: 'Braces Consultation',
};

const BillPage = () => {
  const [searchParams] = useSearchParams();
  const [apptNum, setApptNum] = useState(searchParams.get('apptNum') ?? '');
  const [bill, setBill] = useState<BillResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('apptNum')) {
      fetchBill(searchParams.get('apptNum')!);
    }
  }, []);

  const fetchBill = async (num: string) => {
    setLoading(true); setError('');
    try {
      const res = await axiosClient.get<BillResponse>(`/bills/${num}`);
      setBill(res.data);
    } catch {
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  const generateBill = async () => {
    if (!apptNum.trim()) { setError('Enter an appointment number.'); return; }
    setGenerating(true); setError('');
    try {
      const res = await axiosClient.post<BillResponse>(`/bills/generate/${apptNum.trim()}`);
      setBill(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to generate bill.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptNum.trim()) { setError('Enter an appointment number.'); return; }
    fetchBill(apptNum.trim());
  };

  const handlePrint = () => window.print();

  const fmt = (n: number) => `LKR ${n.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>💰 Billing & Receipt</h2>
          <p>Generate and print the treatment bill for a patient.</p>
        </div>

        <div className="card no-print" style={{ marginBottom: 'var(--space-6)' }}>
          <form id="bill-search-form" onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <input
              id="bill-appt-input"
              type="text"
              placeholder="Enter appointment number (e.g. SDC-20260903-0001)"
              value={apptNum}
              onChange={e => { setApptNum(e.target.value); setError(''); }}
              style={{ flex: 1, fontFamily: 'monospace' }}
            />
            <button id="bill-search-btn" type="submit" className="btn btn-secondary" disabled={loading}>
              🔍 Find Bill
            </button>
            <button
              id="bill-generate-btn"
              type="button"
              className="btn btn-primary"
              onClick={generateBill}
              disabled={generating}
            >
              {generating ? <><span className="spinner" /> Generating...</> : '⚡ Generate Bill'}
            </button>
          </form>
          {error && <div className="alert alert-error" style={{ marginTop: 'var(--space-4)', marginBottom: 0 }}>⚠️ {error}</div>}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        )}

        {bill && (
          <>
            <div className="receipt-card" id="print-receipt">
              <div className="receipt-header">
                <div className="receipt-logo">🦷</div>
                <div className="receipt-clinic">Sunrise Dental Clinic</div>
                <div className="receipt-sub">Colombo, Sri Lanka | Tel: +94 11 2345678</div>
                <div className="receipt-sub" style={{ marginTop: 8 }}>
                  PATIENT RECEIPT — {new Date(bill.generatedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="receipt-row">
                <span>Appointment No.</span>
                <span style={{ fontFamily: 'monospace', color: 'var(--color-primary-light)' }}>
                  {bill.appointmentNumber}
                </span>
              </div>
              <div className="receipt-row">
                <span>Patient Name</span>
                <span>{bill.patientName}</span>
              </div>
              <div className="receipt-row">
                <span>Contact</span>
                <span>{bill.contactNumber}</span>
              </div>
              <div className="receipt-row">
                <span>Dentist</span>
                <span>{bill.dentistName}</span>
              </div>
              <div className="receipt-row">
                <span>Treatment</span>
                <span>{TREATMENT_LABELS[bill.treatmentType] ?? bill.treatmentType}</span>
              </div>
              <div className="receipt-row">
                <span>Date & Time</span>
                <span>{bill.appointmentDate} at {bill.appointmentTime}</span>
              </div>

              <hr className="divider" />

              <div className="receipt-row">
                <span>Treatment Cost</span>
                <span>{fmt(bill.treatmentCost)}</span>
              </div>
              <div className="receipt-row">
                <span>Consultation Fee</span>
                <span>{fmt(bill.consultationFee)}</span>
              </div>
              {bill.discount > 0 && (
                <div className="receipt-row" style={{ color: 'var(--color-success)' }}>
                  <span>Discount</span>
                  <span>− {fmt(bill.discount)}</span>
                </div>
              )}
              <div className="receipt-row total">
                <span>TOTAL DUE</span>
                <span>{fmt(bill.totalAmount)}</span>
              </div>

              <hr className="divider" />
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-muted)' }}>
                Thank you for choosing Sunrise Dental Clinic 🦷<br />
                Please retain this receipt for your records.
              </div>
            </div>

            <div className="no-print" style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
              <button id="print-btn" className="btn btn-accent" onClick={handlePrint}>
                🖨️ Print Receipt
              </button>
              <span className={`badge ${bill.paid ? 'badge-completed' : 'badge-scheduled'}`}
                style={{ padding: '8px 16px', fontSize: 13 }}>
                {bill.paid ? '✅ PAID' : '⏳ PENDING'}
              </span>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BillPage;
