 import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../API';

export const Messages = ({ onSetActiveContent }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [receiverRole, setReceiverRole] = useState('employer');
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('role');
  const userId = userRole === 'employer' ? localStorage.getItem('employer_id') : localStorage.getItem('user_Id');
  const socketRef = useRef(null);
  
  const [sending, setSending] = useState(false);
  
  useEffect(() => {
    console.log('Messages.jsx - localStorage:', {
      authToken: authToken?.substring(0, 10) + '...',
      userRole,
      userId,
    });
    if (!authToken || !userId || !userRole) {
      setError('Authentication required. Please log in.');
      toast.error('Please log in to view messages');
      return;
    }

    // Fetch messages and unread count
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching messages with authToken:', authToken.substring(0, 10) + '...');
        const [messagesRes, countRes] = await Promise.all([
          axios.get(`${BASE_URL}/jobs/messages`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get(`${BASE_URL}/jobs/unreadMessageCount`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);
        console.log('Messages fetched:', messagesRes.data.length, 'messages');
        setMessages(messagesRes.data || []);
        setMessageCount(countRes.data.count || 0);
      } catch (err) {
        console.error('Fetch messages error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        const errorMsg = err.response?.data?.error || 'Failed to load messages';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // WebSocket setup
    socketRef.current = io(BASE_URL, { auth: { token: authToken }, reconnectionAttempts: 5 });
    const socket = socketRef.current;
    const room = `${userRole}:${userId}`;

    socket.on('connect', () => {
      socket.emit('join', room);
      console.log(`Messages socket connected as ${room}`);
    });

    socket.on('newMessage', (data) => {
      console.log('Received new message:', data);
      if (data.receiver_id === parseInt(userId) && data.receiver_role === userRole) {
        setMessages((prev) => [data, ...prev]);
        if (!data.is_read) {
          setMessageCount((prev) => prev + 1);
          toast.success(`New message from ${data.sender_name}: ${data.message}`, {
            duration: 5000,
            style: { cursor: 'pointer' },
            onClick: () => onSetActiveContent('Messages'),
          });
        }
      }
    });

    socket.on('messagesRead', (data) => {
      if (data.user_id === parseInt(userId) && data.user_role === userRole) {
        setMessageCount(0);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.receiver_id === parseInt(userId) && !msg.is_read ? { ...msg, is_read: true } : msg
          )
        );
        console.log('Messages marked as read in Messages component');
        toast.success('All messages marked as read');
      }
    });

    socket.on('messageRead', (data) => {
      if (data.user_id === parseInt(userId)) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === data.message_id ? { ...msg, is_read: true } : msg))
        );
        setMessageCount((prev) => Math.max(0, prev - 1));
        console.log(`Message ${data.message_id} marked as read`);
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Messages socket error:', err.message);
      setError('Failed to connect to messages. Retrying...');
      toast.error('Messages connection failed');
    });

    return () => {
      socket.disconnect();
      console.log(`Messages socket disconnected for ${room}`);
    };
  }, [authToken, userId, userRole, onSetActiveContent]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !receiverId) {
      toast.error('Please enter a message and receiver ID');
      return;
    }
    const parsedReceiverId = parseInt(receiverId);
    if (isNaN(parsedReceiverId)) {
      toast.error('Receiver ID must be a valid number');
      return;
    }
    setSending(true);
    try {
      console.log('Sending message:', {
        receiver_id: parsedReceiverId,
        receiver_role: receiverRole,
        message: newMessage.trim(),
        sender_id: userId,
        sender_role: userRole,
      });
      const response = await axios.post(
        `${BASE_URL}/jobs/sendMessage`,
        { receiver_id: parsedReceiverId, receiver_role: receiverRole, message: newMessage.trim() },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const sentMessage = {
        id: response.data.message_id,
        sender_id: parseInt(userId),
        sender_role: userRole,
        sender_name: localStorage.getItem('name') || 'Unknown',
        receiver_id: parsedReceiverId,
        receiver_role: receiverRole,
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
        is_read: false,
      };
      setMessages((prev) => [sentMessage, ...prev]);
      setNewMessage('');
      setReceiverId('');
      toast.success('Message sent!');
    } catch (err) {
      console.error('Send message error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMsg = err.response?.data?.error || 'Failed to send message';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSending(false);
    }
  };

  const handleMarkRead = async (messageId) => {
    try {
      await axios.post(
        `${BASE_URL}/jobs/markMessageRead`,
        { message_id: messageId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, is_read: true } : msg)));
      setMessageCount((prev) => Math.max(0, prev - 1));
      toast.success('Message marked as read');
    } catch (err) {
      console.error('Mark read error:', err.response?.data || err.message);
      setError('Failed to mark message as read');
      toast.error('Failed to mark message as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.post(
        `${BASE_URL}/jobs/markAllMessagesRead`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setMessageCount(0);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.receiver_id === parseInt(userId) && !msg.is_read ? { ...msg, is_read: true } : msg
        )
      );
      toast.success('All messages marked as read');
    } catch (err) {
      console.error('Mark all read error:', err.response?.data || err.message);
      setError('Failed to mark all messages as read');
      toast.error('Failed to mark all messages as read');
    }
  };

  return (
    <div className="w-full bg-gray-50 py-8 px-4">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <button
            onClick={handleMarkAllRead}
            className={`px-4 py-2 rounded-full shadow-md transition-colors ${
              messageCount === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
            disabled={messageCount === 0}
          >
            Mark All Read
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg animate-fade-in">{error}</div>
        )}
        {loading ? (
          <div className="p-4 bg-teal-100 text-teal-700 rounded-lg flex items-center gap-2 animate-fade-in">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
            </svg>
            Loading messages...
          </div>
        ) : (
          <>
            <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <input
                type="number"
                placeholder="Receiver ID (e.g., employer or seeker ID)"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={sending}
              />
              <select
                value={receiverRole}
                onChange={(e) => setReceiverRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={sending}
              >
                <option value="employer">Employer</option>
                <option value="seeker">Job Seeker</option>
              </select>
              <textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
                rows={4}
                disabled={sending}
              />
              <button
                onClick={handleSendMessage}
                className={`bg-teal-600 text-white px-4 py-2 rounded-full shadow-md transition-colors ${
                  sending || !newMessage.trim() || !receiverId
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-teal-700'
                }`}
                disabled={sending || !newMessage.trim() || !receiverId}
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
            <div className="h-[80vh] overflow-auto w-full space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg shadow-md border border-gray-200 transition-all duration-200 ${
                      msg.sender_id === parseInt(userId) && msg.sender_role === userRole
                        ? 'bg-teal-50 text-right'
                        : msg.is_read
                        ? 'bg-gray-100'
                        : 'bg-white'
                    }`}
                  >
                    <p className="text-sm text-gray-600 font-medium">
                      {msg.sender_name} ({msg.sender_role}) <span>id ({msg.sender_id})</span>  
                    </p>
                    <p className="text-gray-900 break-words">{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                    {msg.receiver_id === parseInt(userId) && msg.receiver_role === userRole && !msg.is_read && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="text-teal-600 text-sm mt-2 hover:underline focus:outline-none"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Messages.propTypes = {
  onSetActiveContent: PropTypes.func.isRequired,
};