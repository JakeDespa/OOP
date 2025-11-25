import React, { Component, ChangeEvent, FormEvent } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import ApiClient from '../services/ApiClient';

interface RegisterPageState {
    name: string;
    email: string;
    password: string;
    error: string | null;
    success: boolean;
}

class RegisterPage extends Component<{}, RegisterPageState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            error: null,
            success: false,
        };
    }

    handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({ [name]: value } as unknown as Pick<RegisterPageState, keyof RegisterPageState>);
    }

    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.setState({ error: null });
        try {
            await ApiClient.register({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
            });
            this.setState({ success: true });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            this.setState({ error: errorMessage });
            console.error('Registration error:', error);
        }
    }

    render() {
        if (this.state.success) {
            return <Navigate to="/login" />;
        }

        return (
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Card style={{ width: '30rem' }}>
                    <Card.Body>
                        <h2 className="text-center mb-4">Create TaskMate Account</h2>
                        {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group id="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" value={this.state.name} onChange={this.handleInputChange} required />
                            </Form.Group>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={this.state.email} onChange={this.handleInputChange} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" value={this.state.password} onChange={this.handleInputChange} required />
                            </Form.Group>
                            <Button className="w-100 mt-3" type="submit">Register</Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            Already have an account? <a href="/login">Log In</a>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default RegisterPage;
