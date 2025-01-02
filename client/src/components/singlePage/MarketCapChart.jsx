import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { parseISO, format, addMonths, addWeeks, isBefore } from 'date-fns';
import './MarketCapChart.css';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const formattedValue =
            value < 0.01
                ? value.toFixed(4) // Show more decimals for very small numbers
                : value.toFixed(2);

        return (
            <div className="custom-tooltip">
                <p className="label">{`${label}`}</p>
                <p className="value">Market Cap: ${formattedValue}</p>
            </div>
        );
    }
    return null;
};

const CustomLegend = (props) => {
    const { payload } = props;
    return (
        <div className="custom-legend">
            {payload.map((entry, index) => (
                <div key={`item-${index}`} className="legend-item">
                    <span
                        className="legend-color"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="legend-text">Market Cap</span>
                </div>
            ))}
        </div>
    );
};

const MarketCapChart = ({ currentCoin }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (currentCoin) {
            const marketcap = currentCoin.formattedMarketCap;
            const { createdAt } = currentCoin; // Change formattedMarketCap to marketcap
            const initialMarketCap = parseFloat(marketcap); // Use the raw marketcap value
            const startDate = parseISO(createdAt);
            const today = new Date();

            const data = [];
            let date = startDate;

            const addInterval =
                today - startDate > 30 * 24 * 60 * 60 * 1000
                    ? addMonths
                    : addWeeks;
            const intervalCount = addInterval === addMonths ? 1 : 1;

            let currentMarketCap = initialMarketCap;
            while (isBefore(date, today)) {
                // Debug log for each data point

                data.push({
                    time: format(date, 'MMM yyyy'),
                    marketCap: currentMarketCap
                });

                date = addInterval(date, intervalCount);
                currentMarketCap *= 1 + (Math.random() - 0.5) / 10;
            }

            setChartData(data);
        }
    }, [currentCoin]);

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#333333"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="time"
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                        tickFormatter={(value) => {
                            if (value < 0.01) {
                                return `$${value.toFixed(4)}`;
                            }
                            return `$${value.toFixed(2)}`;
                        }}
                        domain={['auto', 'auto']} // This will help with the scale
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                    <Line
                        type="monotone"
                        dataKey="marketCap"
                        stroke="#ff6b00"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: '#ff6b00' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MarketCapChart;
