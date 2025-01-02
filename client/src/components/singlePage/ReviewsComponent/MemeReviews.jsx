import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import MemeTrades from './MemeTrades';
import HoldersDistribution from './HoldersDistribution';
import './MemeReviews.css';

const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}`;
};

const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const MemeReviews = ({ coinId, coinAddress }) => {
    const { address } = useWeb3ModalAccount();
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [page, setPage] = useState(1);
    const [selectedTab, setSelectedTab] = useState('thread'); // Start with holders tab
    const [isLoading, setIsLoading] = useState(true);
    const commentsPerPage = 5;

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/reviews/coin/${coinId}`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [coinId]);

    useEffect(() => {
        if (coinAddress) {
            setIsLoading(false);
        }
    }, [coinAddress]);

    const handlePostComment = async () => {
        const formData = new FormData();
        formData.append('coinId', coinId);
        formData.append('username', truncateAddress(address));
        formData.append('comment', newComment);

        try {
            const response = await axios.post('/api/reviews', formData);
            setComments([...comments, response.data]);
        } catch (error) {
            console.error('Error posting comment:', error);
        }

        setNewComment('');
        setOpen(false);
    };

    const displayedComments = comments.slice(
        (page - 1) * commentsPerPage,
        page * commentsPerPage
    );

    return (
        <div className="reviews-container">
            <div className="tabs">
                <button
                    className={`tab ${
                        selectedTab === 'thread' ? 'active' : ''
                    }`}
                    onClick={() => setSelectedTab('thread')}
                >
                    Thread
                </button>
                <button
                    className={`tab ${
                        selectedTab === 'trades' ? 'active' : ''
                    }`}
                    onClick={() => setSelectedTab('trades')}
                >
                    Trades
                </button>
                <button
                    className={`tab ${
                        selectedTab === 'holders' ? 'active' : ''
                    }`}
                    onClick={() => setSelectedTab('holders')}
                >
                    Top Holders
                </button>
            </div>

            {selectedTab === 'thread' && (
                <div className="thread-container">
                    <button
                        className="post-comment-btn"
                        onClick={() => setOpen(true)}
                    >
                        Post a Comment
                    </button>

                    {/* Comment Modal */}
                    {open && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>Post a Comment</h3>
                                <textarea
                                    value={newComment}
                                    onChange={(e) =>
                                        setNewComment(e.target.value)
                                    }
                                    placeholder="Write your comment..."
                                    className="comment-input"
                                />
                                <div className="modal-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="post-btn"
                                        onClick={handlePostComment}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="comments-list">
                        {displayedComments.map((comment) => (
                            <div key={comment._id} className="comment">
                                <div className="comment-header">
                                    <span className="username">
                                        {comment.username}
                                    </span>
                                    <span className="timestamp">
                                        {moment(comment.createdAt).format(
                                            'MMMM Do YYYY, h:mm:ss a'
                                        )}
                                    </span>
                                </div>
                                <p className="comment-text">
                                    {comment.comment}
                                </p>
                                {comment.image && (
                                    <img
                                        src={`data:${
                                            comment.image.contentType
                                        };base64,${arrayBufferToBase64(
                                            comment.image.data.data
                                        )}`}
                                        alt="meme"
                                        className="comment-image"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
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
                            disabled={
                                page >=
                                Math.ceil(comments.length / commentsPerPage)
                            }
                            onClick={() => setPage(page + 1)}
                            className="page-btn"
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}
            {selectedTab === 'trades' && (
                <div className="trades-container">
                    {isLoading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <MemeTrades tokenAddress={coinAddress.address} />
                    )}
                </div>
            )}
            {selectedTab === 'holders' && (
                <HoldersDistribution tokenAddress={coinAddress.address} />
            )}
        </div>
    );
};

export default MemeReviews;
