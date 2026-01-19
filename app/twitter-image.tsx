import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Poker Range Builder - Professional Poker Range Chart Builder';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Simplified 5x5 grid showing poker range concept
const gridData = [
  ['AA', 'AKs', 'AQs', 'AJs', 'ATs'],
  ['AKo', 'KK', 'KQs', 'KJs', 'KTs'],
  ['AQo', 'KQo', 'QQ', 'QJs', 'QTs'],
  ['AJo', 'KJo', 'QJo', 'JJ', 'JTs'],
  ['ATo', 'KTo', 'QTo', 'JTo', 'TT'],
];

const colors = [
  ['#ef4444', '#ef4444', '#ef4444', '#22c55e', '#22c55e'],
  ['#ef4444', '#ef4444', '#ef4444', '#22c55e', '#3b82f6'],
  ['#ef4444', '#22c55e', '#ef4444', '#22c55e', '#3b82f6'],
  ['#22c55e', '#22c55e', '#3b82f6', '#ef4444', '#3b82f6'],
  ['#22c55e', '#3b82f6', '#3b82f6', '#3b82f6', '#ef4444'],
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '60px',
          }}
        >
          {/* Grid visualization */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {gridData.map((row, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  display: 'flex',
                  gap: '6px',
                }}
              >
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      width: '70px',
                      height: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: colors[rowIndex][colIndex],
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 700,
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Text content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              maxWidth: '500px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #ef4444, #3b82f6)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                }}
              >
                ♠️
              </div>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.6)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                Poker Tool
              </span>
            </div>

            <h1
              style={{
                fontSize: '56px',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
                margin: 0,
                marginBottom: '20px',
              }}
            >
              Range Builder
            </h1>

            <p
              style={{
                fontSize: '24px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Build, organize and study your poker ranges like a professional
            </p>

            {/* Feature pills */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '30px',
                flexWrap: 'wrap',
              }}
            >
              {['Free', 'Offline', 'Exportable'].map((feature) => (
                <span
                  key={feature}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #ef4444, #22c55e, #3b82f6)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
