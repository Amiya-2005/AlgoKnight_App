import { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// Platform-specific rating tiers and colors
const PLATFORM_CONFIGS = {
  codeforces: {
    tiers: [
      { name: "Newbie", color: "#808080", min: 0, max: 1199 },
      { name: "Pupil", color: "#008000", min: 1200, max: 1399 },
      { name: "Specialist", color: "#03a89e", min: 1400, max: 1599 },
      { name: "Expert", color: "#0000ff", min: 1600, max: 1899 },
      { name: "Candidate Master", color: "#aa00aa", min: 1900, max: 2099 },
      { name: "Master", color: "#ff8c00", min: 2100, max: 2299 },
      { name: "Grandmaster", color: "#ff0000", min: 2300, max: 2399 },
      { name: "International Grandmaster", color: "#ff0000", min: 2400, max: 2599 },
      { name: "Legendary Grandmaster", color: "#ff0000", min: 2600, max: 10000 }
    ],
    primaryColor: "#4285F4",
    mainLineColor: "#4285F4",
    accentColor: "#DB4437"
  },
  codechef: {
    tiers: [
      { name: "1★", color: "#666666", min: 0, max: 1399 },
      { name: "2★", color: "#1E7D22", min: 1400, max: 1599 },
      { name: "3★", color: "#3366CC", min: 1600, max: 1799 },
      { name: "4★", color: "#684273", min: 1800, max: 1999 },
      { name: "5★", color: "#FFD819", min: 2000, max: 2199 },
      { name: "6★", color: "#FF7F00", min: 2200, max: 2499 },
      { name: "7★", color: "#D0011B", min: 2500, max: 10000 }
    ],
    primaryColor: "#5B4638",
    mainLineColor: "#E05D44",
    accentColor: "#5B4638"
  },
  leetcode: {
    tiers: [
      { name: "Knight", color: "#FF8C00", min: 1950, max: 2149 },
      { name: "Guardian", color: "#FF0000", min: 2150, max: 2299 },
      { name: "2500+", color: "#FF0000", min: 2300, max: 10000 }
    ],
    primaryColor: "#FFA116",
    mainLineColor: "#FFA116",
    accentColor: "#192B46"
  }
};

// Default tier configuration
const DEFAULT_TIERS = [
  { name: "Tier 1", color: "#808080", min: 0, max: 1399 },
  { name: "Tier 2", color: "#008000", min: 1400, max: 1799 },
  { name: "Tier 3", color: "#0000ff", min: 1800, max: 2199 },
  { name: "Tier 4", color: "#aa00aa", min: 2200, max: 2599 },
  { name: "Tier 5", color: "#ff0000", min: 2600, max: 10000 }
];

const RatingPlot = ({ platform = "leetcode", handle, data, inView = true }) => {
  const [chartData, setChartData] = useState([]);
  const [domain, setDomain] = useState({ min: 1000, max: 2200 });

  // Get platform configuration or use default
  const platformConfig = PLATFORM_CONFIGS[platform.toLowerCase()] || {
    tiers: DEFAULT_TIERS,
    primaryColor: "#4285F4",
    mainLineColor: "#4285F4",
    accentColor: "#DB4437"
  };

  useEffect(() => {
    if (data && data[platform] && data[platform].length > 0) {
      // Process data for chart
      const processedData = data[platform].map((contest, index) => {
        const date = new Date(contest.date);

        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();

        // Include year only for the first contest of each year
        let displayDate = `${month}/${day}`;

        const del = index > 0 ? contest.rating - data[platform][index - 1].rating : contest.rating;

        return {
          id: index,
          name: displayDate,
          date: `${year}/${month}/${day}`,
          rating: contest.rating,
          title: contest.name,
          rank: contest.rank,
          timestamp: contest.date,
          delta: `${del > 0 ? '+' : ' '}${del}`,
        };
      });

      // Sort by contest date
      processedData.sort((a, b) => a.timestamp - b.timestamp);

      // Set chart data
      setChartData(processedData);

      // Calculate domain with padding
      const ratings = processedData.map(item => item.rating);
      const minRating = Math.min(...ratings);
      const maxRating = Math.max(...ratings);
      const padding = Math.max(100, (maxRating - minRating) * 0.1);

      setDomain({
        min: Math.max(0, Math.floor((minRating - padding) / 100) * 100),
        max: Math.ceil((maxRating + padding) / 100) * 100
      });
    }
  }, [data]);



  // Get current rating tier
  const getCurrentTier = (rating) => {
    return platformConfig.tiers.find(tier => rating >= tier.min && rating <= tier.max) || platformConfig.tiers[0];
  };

  const currentRating = data?.contestRating || 0;
  const currentTier = getCurrentTier(currentRating);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg text-sm">
          <p className="font-bold text-base mb-1">{data.title}</p>
          <p className="text-gray-800 dark:text-gray-200 font-medium">Rating: {Math.round(data.rating)}</p>
          <p className="text-gray-800 dark:text-gray-200 font-medium">Rank: #{data.rank}</p>
          <p className="text-gray-800 dark:text-gray-200 font-medium">Delta: {data.delta}</p>
          <p className="text-gray-800 dark:text-gray-200 font-medium">Date: {data.date}</p>
        </div>
      );
    }
    return null;
  };

  // Generate reference lines for rating tiers
  const ratingTierLines = platformConfig.tiers.map(tier => {
    // Only show relevant tiers based on current domain
    if (tier.min >= domain.min && tier.min <= domain.max) {
      return (
        <ReferenceLine
          key={tier.name}
          y={tier.min}
          stroke={tier.color}
          strokeDasharray="3 3"
          strokeWidth={1.5}
          label={{
            value: tier.name,
            position: 'insideBottomRight',
            style: { fill: tier.color, fontSize: '12px', fontWeight: 'bold' }
          }}
        />
      );
    }
    return null;
  });

  const getStrokeColor = () => {
    // Use platform-specific color or current tier color
    return platformConfig.mainLineColor || currentTier.color;
  };

  return (
    <div className="w-full h-64 sm:h-80">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" strokeOpacity={0.7} />
            <XAxis
              dataKey="name"
              className="text-gray-700 dark:text-gray-200"
              fontSize={13}
              fontWeight="600"
              tickLine={false}
              axisLine={{ stroke: '#888', strokeWidth: 1.5 }}
            />
            <YAxis
              domain={[domain.min, domain.max]}
              className="text-gray-700 dark:text-gray-200"
              fontSize={13}
              fontWeight="600"
              tickLine={false}
              axisLine={{ stroke: '#888', strokeWidth: 1.5 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {ratingTierLines}
            <Line
              type="monotone"
              dataKey="rating"
              stroke={getStrokeColor()}
              strokeWidth={3}
              dot={{
                strokeWidth: 2,
                r: 5,
                className: "stroke-white dark:stroke-gray-800",
                fill: getStrokeColor()
              }}
              activeDot={{ r: 7, stroke: getStrokeColor(), strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-700 dark:text-gray-200 font-medium text-center">
          {!handle ? "Add your coding handles to enable data fetching." : "No contest Data available"}
        </div>
      )}
    </div>
  );
};

export default RatingPlot;