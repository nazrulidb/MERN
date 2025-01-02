import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, type, message, txHash }) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-modal-overlay">
            <div className="confirmation-modal-content">
                <div className={`confirmation-modal-header ${type}`}>
                    {type === 'success' && (
                        <div className="confirmation-success-icon">✓</div>
                    )}
                </div>
                <div className="confirmation-modal-body">
                    <p>{message}</p>
                    {txHash && (
                        <a
                            href={`https://basescan.org/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="confirmation-tx-link"
                        >
                            View on Basescan
                        </a>
                    )}
                </div>
                <button className="confirmation-modal-button" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
