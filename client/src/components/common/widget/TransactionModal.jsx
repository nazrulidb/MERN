import React from 'react';
import './TransactionModal.css';

const TransactionModal = ({ isOpen, onClose, type, message, txHash }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    {type === 'info' && (
                        <>
                            <div className="loading-spinner"></div>
                            <h2>Processing</h2>
                        </>
                    )}
                    {type === 'success' && <h2>Success</h2>}
                    {type === 'error' && <h2>Error</h2>}
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                    {txHash && (
                        <a
                            href={`https://basescan.org/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tx-link"
                        >
                            View on Basescan
                        </a>
                    )}
                </div>
                {/* Only show close button for success and error states */}
                {type !== 'info' && (
                    <button className="modal-button" onClick={onClose}>
                        OK
                    </button>
                )}
            </div>
        </div>
    );
};

export default TransactionModal;
