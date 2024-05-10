import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from "../../Storage/Redux/store";

/**
 * @typedef {import("../../Interfaces").userModel} userModel
 * @typedef {import("react-redux").DefaultRootState} RootState
 */

/**
 * @param {Object} props
 * @param {Function} props.joinRoom
 */
const Lobby = ({ joinRoom }) => {
    /** @type {string | userModel} */
    const [user, setUser] = useState('');
    
    /** @type {string} */
    const [room, setRoom] = useState('');

    /** @type {userModel} */
    const userData = useSelector(
        /** @param {RootState} state */
        (state) => state.userAuthStore
    );

    // Set user state with userData.name when component mounts
    useEffect(() => {
        if (userData && userData.fullName) {
            setUser(userData.fullName);
        }
    }, [userData]);

    return (
        <Form className='lobby'
            onSubmit={e => {
                e.preventDefault();
                joinRoom(user, room);
            }}
        >
            <Form.Group>
                <Form.Control 
                    placeholder="name" 
                    value={userData.fullName} 
                    onChange={e => setUser(e.target.value)} 
                    readOnly
                />
                <Form.Control 
                    placeholder="Room ID" 
                    onChange={e => setRoom(e.target.value)} 
                />
            </Form.Group>
            <Button variant="success" type="submit" disabled={!user || !room}>Join</Button>
        </Form>
    );
}

export default Lobby;
