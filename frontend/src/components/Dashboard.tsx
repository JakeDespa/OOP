import React, { Component } from 'react';
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import TaskManager from './TaskManager';
import UserProfile from './UserProfile';
import { User } from '../models/User';
import ApiClient from '../services/ApiClient';


interface DashboardProps {
    onLogout: () => void;
    onThemeChange?: (theme: 'light' | 'dark') => void;
}

interface DashboardState {
    activeView: 'tasks' | 'categories' | 'tags' | 'profile';
    user: User | null;
    loading: boolean;
}

class Dashboard extends Component<DashboardProps, DashboardState> {
    constructor(props: DashboardProps) {
        super(props);
        this.state = {
            activeView: 'tasks',
            user: null,
            loading: true,
        };
    }

    componentDidMount() {
        this.loadUserProfile();
    }

    loadUserProfile = async () => {
        try {
            const user = await ApiClient.getUserProfile();
            this.setState({ user, loading: false });
        } catch (error) {
            this.setState({ loading: false });
        }
    };

    renderActiveView() {
        switch (this.state.activeView) {
            case 'tasks':
                return <TaskManager user={this.state.user} />;
            case 'profile':
                return <UserProfile onThemeChange={this.props.onThemeChange} />;
           
            default:
                return <TaskManager user={this.state.user} />;
        }
    }

    render() {
        const { user } = this.state;

        return (
            <>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand href="#home">TaskMate</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link onClick={() => this.setState({ activeView: 'tasks' })}>Tasks</Nav.Link>
                                <Nav.Link onClick={() => this.setState({ activeView: 'profile' })}>Profile</Nav.Link>
                                {/* <Nav.Link onClick={() => this.setState({ activeView: 'categories' })}>Categories</Nav.Link> */}
                                {/* <Nav.Link onClick={() => this.setState({ activeView: 'tags' })}>Tags</Nav.Link> */}
                            </Nav>
                            <div className="d-flex align-items-center gap-3 me-3">
                                {user && (
                                    <>
                                        {user.profilePicture && (
                                            <Image
                                                src={user.profilePicture}
                                                alt="Profile"
                                                roundedCircle
                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                            />
                                        )}
                                        <span className="text-white">{user.name}</span>
                                    </>
                                )}
                            </div>
                            <Button variant="outline-light" onClick={this.props.onLogout}>Logout</Button>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Container className="mt-4">
                    {this.renderActiveView()}
                </Container>
            </>
        );
    }
}

export default Dashboard;
