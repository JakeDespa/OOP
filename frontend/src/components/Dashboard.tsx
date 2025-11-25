import React, { Component } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import TaskManager from './TaskManager';
// Placeholders for other manager components
// import CategoryManager from './CategoryManager';
// import TagManager from './TagManager';
// import ProfilePage from './ProfilePage';

interface DashboardProps {
    onLogout: () => void;
}

interface DashboardState {
    activeView: 'tasks' | 'categories' | 'tags' | 'profile';
}

class Dashboard extends Component<DashboardProps, DashboardState> {
    constructor(props: DashboardProps) {
        super(props);
        this.state = {
            activeView: 'tasks',
        };
    }

    renderActiveView() {
        switch (this.state.activeView) {
            case 'tasks':
                return <TaskManager />;
            // case 'categories':
            //     return <CategoryManager />;
            // case 'tags':
            //     return <TagManager />;
            // case 'profile':
            //     return <ProfilePage />;
            default:
                return <TaskManager />;
        }
    }

    render() {
        return (
            <>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand href="#home">TaskMate</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link onClick={() => this.setState({ activeView: 'tasks' })}>Tasks</Nav.Link>
                                {/* <Nav.Link onClick={() => this.setState({ activeView: 'categories' })}>Categories</Nav.Link> */}
                                {/* <Nav.Link onClick={() => this.setState({ activeView: 'tags' })}>Tags</Nav.Link> */}
                                {/* <Nav.Link onClick={() => this.setState({ activeView: 'profile' })}>Profile</Nav.Link> */}
                            </Nav>
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
