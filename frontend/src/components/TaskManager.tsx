import React, { Component, ChangeEvent, FormEvent } from 'react';
import { Table, Button, Modal, Form, Alert, Card, Image } from 'react-bootstrap';
import { Task } from '../models/Task';
import ApiClient from '../services/ApiClient';

interface TaskManagerState {
    tasks: Task[];
    error: string | null;
    showModal: boolean;
    isEditing: boolean;
    currentTask: Partial<Task> | null;
    qrCode: string | null;
    showQRModal: boolean;
}

class TaskManager extends Component<{}, TaskManagerState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            tasks: [],
            error: null,
            showModal: false,
            isEditing: false,
            currentTask: null,
            qrCode: null,
            showQRModal: false,
        };
    }

    componentDidMount() {
        this.loadTasks();
    }

    loadTasks = async () => {
        try {
            const tasks = await ApiClient.getTasks();
            this.setState({ tasks });
        } catch (error) {
            this.setState({ error: 'Failed to load tasks.' });
        }
    }

    handleModalOpen = (task: Partial<Task> | null = null) => {
        this.setState({
            showModal: true,
            isEditing: !!task,
            currentTask: task ? { ...task } : { title: '', description: '', priority: 'Medium', status: 'Pending' },
        });
    }

    handleModalClose = () => {
        this.setState({ showModal: false, isEditing: false, currentTask: null });
    }

    handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (this.state.currentTask) {
            this.setState({
                currentTask: {
                    ...this.state.currentTask,
                    [name]: value,
                }
            });
        }
    }

    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!this.state.currentTask) return;

        try {
            if (this.state.isEditing && this.state.currentTask.taskID) {
                await ApiClient.updateTask(this.state.currentTask.taskID, this.state.currentTask);
            } else {
                await ApiClient.createTask(this.state.currentTask);
            }
            this.loadTasks();
            this.handleModalClose();
        } catch (error) {
            this.setState({ error: 'Failed to save task.' });
        }
    }

    handleDelete = async (taskId: number) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await ApiClient.deleteTask(taskId);
                this.loadTasks();
            } catch (error) {
                this.setState({ error: 'Failed to delete task.' });
            }
        }
    }
    
    handleShowQRCode = async (taskId: number) => {
        try {
            const qrCode = await ApiClient.getTaskQRCode(taskId);
            this.setState({ qrCode, showQRModal: true });
        } catch (error) {
            this.setState({ error: 'Failed to generate QR code.' });
        }
    }

    handleQRModalClose = () => {
        this.setState({ showQRModal: false, qrCode: null });
    }

    render() {
        const { tasks, error, showModal, isEditing, currentTask } = this.state;

        return (
            <Card>
                <Card.Header>
                    <h2 className="d-inline">Task Manager</h2>
                    <Button variant="primary" className="float-end" onClick={() => this.handleModalOpen()}>Create Task</Button>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Due Date</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.taskID}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>{task.dueDate.toLocaleDateString()}</td>
                                    <td>{task.priority}</td>
                                    <td>{task.status}</td>
                                    <td>
                                        <Button variant="info" size="sm" onClick={() => this.handleShowQRCode(task.taskID)}>QR</Button>{' '}
                                        <Button variant="warning" size="sm" onClick={() => this.handleModalOpen(task)}>Edit</Button>{' '}
                                        <Button variant="danger" size="sm" onClick={() => this.handleDelete(task.taskID)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>

                {/* Task Form Modal */}
                <Modal show={showModal} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? 'Edit Task' : 'Create Task'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {currentTask && (
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" name="title" value={currentTask.title} onChange={this.handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" name="description" value={currentTask.description} onChange={this.handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Due Date</Form.Label>
                                    <Form.Control type="date" name="dueDate" value={currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().split('T')[0] : ''} onChange={this.handleInputChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Priority</Form.Label>
                                    <Form.Select name="priority" value={currentTask.priority} onChange={this.handleInputChange}>
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select name="status" value={currentTask.status} onChange={this.handleInputChange}>
                                        <option>Pending</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button variant="primary" type="submit">Save Changes</Button>
                            </Form>
                        )}
                    </Modal.Body>
                </Modal>
                
                {/* QR Code Modal */}
                <Modal show={this.state.showQRModal} onHide={this.handleQRModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Task QR Code</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        {this.state.qrCode && <Image src={this.state.qrCode} fluid />}
                    </Modal.Body>
                </Modal>
            </Card>
        );
    }
}

export default TaskManager;
