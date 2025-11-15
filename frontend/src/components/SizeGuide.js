import React, { useState } from 'react';

function SizeGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const sizeChart = {
    'XS': { chest: '32-34', waist: '26-28', hips: '34-36' },
    'S': { chest: '34-36', waist: '28-30', hips: '36-38' },
    'M': { chest: '36-38', waist: '30-32', hips: '38-40' },
    'L': { chest: '38-40', waist: '32-34', hips: '40-42' },
    'XL': { chest: '40-42', waist: '34-36', hips: '42-44' }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          background: 'none',
          border: '1px solid #8B7355',
          color: '#8B7355',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Size Guide
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Size Guide</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Size</th>
                  <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Chest</th>
                  <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Waist</th>
                  <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Hips</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(sizeChart).map(([size, measurements]) => (
                  <tr key={size}>
                    <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{size}</td>
                    <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{measurements.chest}</td>
                    <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{measurements.waist}</td>
                    <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{measurements.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default SizeGuide;