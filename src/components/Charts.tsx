interface LineChartProps {
  isDark: boolean;
}

interface PieChartProps {
  isDark: boolean;
}

export function LineChart({ isDark }: LineChartProps) {
  return (
    <div className={`${isDark ? 'bg-neutral-800' : 'bg-gray-800'} rounded-lg p-6`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-300'}`}>
            Transações
          </p>
          <p className="text-white text-3xl font-bold">1.231</p>
        </div>
        <select className={`px-3 py-1 rounded text-sm ${
          isDark
            ? 'bg-neutral-700 text-gray-300'
            : 'bg-gray-700 text-gray-200'
        } border-0`}>
          <option>Todas</option>
        </select>
      </div>

      <svg viewBox="0 0 500 200" className="w-full h-32 mb-4">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        <polyline
          points="20,150 60,100 100,140 140,60 180,120 220,80 260,110 300,70 340,130 380,90 420,140 460,100"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        <polygon
          points="20,150 60,100 100,140 140,60 180,120 220,80 260,110 300,70 340,130 380,90 420,140 460,100 460,200 20,200"
          fill="url(#gradient)"
        />

        {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460].map((x, i) => (
          <circle key={i} cx={x} cy={[150, 100, 140, 60, 120, 80, 110, 70, 130, 90, 140, 100][i]} r="3" fill="#3b82f6" />
        ))}

        <line x1="20" y1="160" x2="460" y2="160" stroke="#444" strokeWidth="1" />
        {[20, 80, 140, 200, 260, 320, 380, 440].map((x, i) => (
          <text key={i} x={x} y="180" textAnchor="middle" fontSize="10" fill="#666">
            {i}
          </text>
        ))}

        {[20, 60, 100, 140, 180].map((y, i) => (
          <text key={i} x="10" y={160 - (i * 25)} fontSize="10" fill="#666" textAnchor="end">
            {i * 250}
          </text>
        ))}
      </svg>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span>Tooltip sample: 682 | 5h</span>
      </div>
    </div>
  );
}

export function PieChart({ isDark }: PieChartProps) {
  const data = [
    { label: 'Aprovadas', value: 84.8, count: 990, color: '#10b981' },
    { label: 'Pendente', value: 13.4, count: 230, color: '#fbbf24' },
    { label: 'Recusadas', value: 1.8, count: 11, color: '#ef4444' }
  ];

  const radius = 45;
  let currentAngle = -Math.PI / 2;

  return (
    <div className={`${isDark ? 'bg-neutral-800' : 'bg-gray-800'} rounded-lg p-6`}>
      <div className="flex items-center gap-8">
        <div className="flex-1 flex justify-center">
          <svg width="150" height="150" viewBox="0 0 150 150">
            {data.map((item, idx) => {
              const sliceAngle = (item.value / 100) * (2 * Math.PI);
              const startAngle = currentAngle;
              const endAngle = currentAngle + sliceAngle;
              currentAngle = endAngle;

              const x1 = 75 + radius * Math.cos(startAngle);
              const y1 = 75 + radius * Math.sin(startAngle);
              const x2 = 75 + radius * Math.cos(endAngle);
              const y2 = 75 + radius * Math.sin(endAngle);

              const largeArc = sliceAngle > Math.PI ? 1 : 0;

              return (
                <path
                  key={idx}
                  d={`M 75 75 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                />
              );
            })}

            <circle cx="75" cy="75" r="30" fill={isDark ? '#171717' : '#1f2937'} />
          </svg>
        </div>

        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-white text-sm font-medium">{item.label}</span>
              <span className="text-gray-400 text-sm ml-auto">{item.value.toFixed(1)}%</span>
              <span className="text-white font-bold ml-2">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
