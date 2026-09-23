import React from 'react';
import { ShieldAlert, User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingModalProps {
  isOpen: boolean;
  onEnterDemo: () => void;
  onSignIn: () => void;
}

export const LandingModal: React.FC<LandingModalProps> = ({
  isOpen,
  onEnterDemo,
  onSignIn,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-container"
        style={{
          maxWidth: '520px',
          border: '1px solid #0E223D',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Government Emblem Top Header */}
        <div
          style={{
            background: 'linear-gradient(180deg, #0D1C30 0%, #081322 100%)',
            padding: '16px 20px',
            color: '#FFFFFF',
            borderBottom: '2px solid #070F1B',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#94A3B8' }}>
            GOVERNMENT OF INDIA &bull; METEOROLOGICAL RESEARCH
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
            <span
              className="font-mono"
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#60A5FA',
                background: 'rgba(37, 99, 235, 0.25)',
                padding: '1px 8px',
                borderRadius: '2px',
                border: '1px solid rgba(96, 165, 250, 0.4)',
              }}
            >
              CIFS
            </span>
            <h2 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.04em' }}>
              CYCLONE INTELLIGENCE & FORECAST SYSTEM
            </h2>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
            Multi-Source Tropical Cyclone Analysis, Forecast & Risk Intelligence
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid var(--border-color)',
              padding: '12px',
              borderRadius: '3px',
              marginBottom: '16px',
              fontSize: '11px',
              color: '#334155',
              lineHeight: 1.5,
            }}
          >
            <strong>INSTITUTIONAL NOTICE & DISCLAIMER: </strong>
            Prototype developed for Smart India Hackathon (SIH) 2026 Problem Statement 26070:
            <em> "Tropical Cyclone Pattern Identification, Classification & Prediction"</em>.
            This platform provides scientific decision-support intelligence around the WeatherNext probabilistic backbone and MOSDAC satellite observations.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={onEnterDemo}
              className="gov-btn gov-btn-primary"
              style={{
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>ENTER DEMO MODE (BAY OF BENGAL SIMULATION)</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={onSignIn}
              className="gov-btn"
              style={{
                padding: '9px 14px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Lock size={13} className="text-secondary" />
              <span>METEOROLOGIST / OPERATOR SIGN IN</span>
            </button>
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '10px', color: '#64748B' }}>
            Authoritative warnings remain the sole responsibility of authorized meteorological agencies (IMD).
          </div>
        </div>
      </div>
    </div>
  );
};
