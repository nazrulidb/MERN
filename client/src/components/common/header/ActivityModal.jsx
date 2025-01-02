import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './modalStyles.css';

const ActivityModal = ({
    isOpen,
    onClose,
    address,
    data,
    page,
    onPageChange,
    totalPages
}) => {
    if (!isOpen) return null;

    const truncateAddress = (addr) => {
        return addr
            ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
            : '';
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className="modal-header">
                    <h2>{truncateAddress(address)}</h2>
                </div>

                <div className="modal-title-activity">ACTIVITY</div>

                <div className="modal-body">
                    <table className="activity-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Ticker</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.ticker}</td>
                                    <td>{item.tag}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                    >
                        &lt;
                    </button>
                    <span className="active">{page}</span>
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityModal;
