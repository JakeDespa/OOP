import React, { Component, ChangeEvent, FormEvent } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import ApiClient from '../services/ApiClient';

interface LoginPageProps {
    onLogin: () => void;
}

interface LoginPageState {
    email: string;
    password: string;
    error: string | null;
}

class LoginPage extends Component<LoginPageProps, LoginPageState> {
    constructor(props: LoginPageProps) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: null,
        };
    }

    handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({ [name]: value } as unknown as Pick<LoginPageState, keyof LoginPageState>);
    }

    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.setState({ error: null });
        try {
            await ApiClient.login({
                email: this.state.email,
                password: this.state.password,
            });
            this.props.onLogin();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
            this.setState({ error: errorMessage });
            console.error('Login error:', error);
        }
    }

    render() {
        return (
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Card style={{ width: '30rem' }}>
                    <Card.Body>
                        <h2 className="text-center mb-4">TaskMate Login</h2>
                        {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={this.state.email} onChange={this.handleInputChange} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" value={this.state.password} onChange={this.handleInputChange} required />
                            </Form.Group>
                            <Button className="w-100 mt-3" type="submit">Log In</Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            Need an account? <a href="/register">Register</a>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default LoginPage;
