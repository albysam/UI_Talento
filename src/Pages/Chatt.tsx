import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { useSelector } from 'react-redux';
import { RootState } from '../Storage/Redux/store';
import { useGetApplicationUsersQuery } from '../Apis/applicationUserApi';
import { applicationUserModel } from '../Interfaces';
import './Chatstyle.css';

interface ChatMessage {
    sender: string;
    message: string;
    timestamp: string;
}

interface Notification {
    id: number;
    message: string;
}

const Chatt = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [users, setUsers] = useState<applicationUserModel[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [receiver, setReceiver] = useState("");
    const [message, setMessage] = useState('');

    const userData = useSelector((state: RootState) => state.userAuthStore);

    const { data, isLoading } = useGetApplicationUsersQuery({
        searchString: '',
        department: userData.department,
        pageNumber: 1,
        pageSize: 10,
    });

    useEffect(() => {
        if (!isLoading && data?.result) {
            setUsers(data.result);
        }
    }, [data, isLoading]);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl("https://talentsapi.azurewebsites.net/chatt", { skipNegotiation: true, transport: HttpTransportType.WebSockets })
            .configureLogging(LogLevel.Information)
            .build();
    
        const onReceiveMessage = (sender: string, receivedMessage: string) => {
          
            setMessages(prevMessages => [...prevMessages, { sender, message: receivedMessage, timestamp: new Date().toISOString() }]);
    
          
            if (sender !== userData.fullName) {
                setNotifications(prev => [...prev, { id: prev.length + 1, message: `New message from ${sender}` }]);
            }
        };
    
        newConnection.start()
            .then(() => {
                setConnection(newConnection);
                newConnection.on('ReceiveMessage', onReceiveMessage);
            })
            .catch(err => console.error('Connection error:', err));
    
        return () => {
            newConnection.stop();
        };
    }, [userData]); 
    

    const handleNotificationClick = (notificationId: number) => {
        setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    };

    const sendMessage = () => {
        if (message.trim() === '') return;
        if (connection) {
            connection.invoke('SendMessage', userData.fullName, receiver, message)
                .catch(err => console.error(err));
        }
        setMessage('');
    };

    const handleEmployeeClick = async (name: React.SetStateAction<string>) => {
        setReceiver(name);
        try {
            const response = await fetch(`https://talentsapi.azurewebsites.net/api/message/${userData.fullName}/${name}`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages: ', error);
        }
    };

    return (
        <div className="containerchat flex h-screen">
            <div className="users w-1/3">
            <div className="notifications w-1/3 bg-gray-100 p-4">
                
                {notifications.map((notification, index) => (
                    <div key={index} onClick={() => handleNotificationClick(notification.id)} className="notification p-3 my-2 bg-yellow-200 rounded-md shadow cursor-pointer">
                        {notification.message}
                    </div>
                ))}
            </div>


                <ul>
                    {users.filter(u => u.id !== userData.id).map((user, index) => (
                        <li key={user.id} onClick={() => user.name && handleEmployeeClick(user.name)}
                            className="p-4 cursor-pointer hover:bg-gray-200">
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>

            {receiver && (
                <div className="w-2/3 bg-white">
                    <div className="flex justify-between items-center border-b p-4">
                        <h2 className="text-lg font-semibold">Chat with {receiver}</h2>
                    </div>
                    <div className="px-4 py-2 h-80 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className="mb-2">
                                <strong>{msg.sender}</strong>: {msg.message} <span className="timestamp text-gray-400 text-xs">{new Date(msg.timestamp).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="input-wide flex items-center justify-between border-t p-4">
                        <input type="text" placeholder="Type a message" value={message}
                               onChange={(e) => setMessage(e.target.value)} required className="flex-1 p-2 border rounded-md focus:outline-none" />
                        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">Send</button>
                    </div>
                </div>
            )}

           
        </div>
    );
}

export default Chatt;
