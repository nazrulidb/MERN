import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { truncateAddress } from './utils';
import './MemeTrades.css';

const MemeTrades = ({ tokenAddress }) => {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const tradesPerPage = 5;

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await axios.get(`/api/trades/${tokenAddress}`);
                setTrades(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trades:', error);
                setLoading(false);
            }
        };

        if (tokenAddress) {
            fetchTrades();
        }
    }, [tokenAddress]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    const startIndex = (page - 1) * tradesPerPage;
    const displayedTrades = trades.slice(
        startIndex,
        startIndex + tradesPerPage
    );

    return (
        <div className="trades-container">
            <h2 className="trades-title">Meme Trades</h2>

            <div className="table-container">
                <table className="trades-table">
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Trade Type</th>
                            <th>Date</th>
                            <th>Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedTrades.map((trade) => (
                            <tr key={trade._id}>
                                <td>{truncateAddress(trade.walletAddress)}</td>
                                <td>
                                    <span
                                        className={`trade-type ${trade.tradeType.toLowerCase()}`}
                                    >
                                        {trade.tradeType}
                                    </span>
                                </td>
                                <td>{new Date(trade.date).toLocaleString()}</td>
                                <td>
                                    <a
                                        href={`https://basescan.org/tx/${trade.transactionId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transaction-link"
                                    >
                                        {truncateAddress(trade.transactionId)}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="page-btn"
                >
                    ‹
                </button>
                <span className="page-number">{page}</span>
                <button
                    disabled={page >= Math.ceil(trades.length / tradesPerPage)}
                    onClick={() => setPage(page + 1)}
                    className="page-btn"
                >
                    ›
                </button>
            </div>
        </div>
    );
};

export default MemeTrades;
