import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'RangeDeck - Free Poker Range Builder & Hand Chart Tool';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

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
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
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

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              maxWidth: '520px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  padding: '8px 16px',
                  background: '#22c55e',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                100% Free
              </div>
            </div>

            <h1
              style={{
                fontSize: '64px',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
                margin: 0,
                marginBottom: '12px',
                letterSpacing: '-2px',
              }}
            >
              RangeDeck
            </h1>

            <p
              style={{
                fontSize: '28px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.4,
                margin: 0,
                marginBottom: '24px',
              }}
            >
              Build & study poker hand ranges with interactive charts
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {['No Signup', 'Offline Ready', 'Export/Import'].map((feature) => (
                <span
                  key={feature}
                  style={{
                    padding: '10px 18px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    fontWeight: 500,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

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
