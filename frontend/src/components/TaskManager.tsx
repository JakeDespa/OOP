import React, { Component, ChangeEvent, FormEvent } from 'react';
import { Table, Button, Modal, Form, Alert, Card, Image } from 'react-bootstrap';
import { Task } from '../models/Task';
import ApiClient from '../services/ApiClient';

//sorting if same duedate
const priorityOrder: { [key: string]: number } = {
    High: 3,
    Medium: 2,
    Low: 1
};

interface TaskManagerState {
    tasks: Task[];
    error: string | null;
    showModal: boolean;
    isEditing: boolean;
    currentTask: Partial<Task> | null;
    qrCode: string | null;
    showQRModal: boolean;
    sortMode: "dueDate";
    filterStatus: "All" | "Pending" | "In Progress" | "Completed";
    currentPage: number;
    tasksPerPage: number;
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
            sortMode: "dueDate",
            filterStatus: "All",
            currentPage: 1,
            tasksPerPage: 5,
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

    handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
        this.setState({ 
            sortMode: event.target.value as "dueDate",
            currentPage: 1 // reset to first page
        });
    };


    render() {
        const { tasks, error, showModal, isEditing, currentTask, sortMode, filterStatus } = this.state;

        //ari mag sort
        const sortedTasks = [...tasks];

        if (sortMode === "dueDate") {
            sortedTasks.sort((a, b) => {
                const dateA = new Date(a.dueDate).getTime();
                const dateB = new Date(b.dueDate).getTime();

                if (dateA !== dateB) {
                    //by due date
                    return dateA - dateB;
                } else {
                    //by priority
                    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
                }
            });
        }

        //filter
        let visibleTasks = sortedTasks;
        if (filterStatus !== "All") {
            visibleTasks = sortedTasks.filter(task => task.status === filterStatus);
        }

        //pagination
        const indexOfLastTask = this.state.currentPage * this.state.tasksPerPage;
        const indexOfFirstTask = indexOfLastTask - this.state.tasksPerPage;
        const currentTasks = visibleTasks.slice(indexOfFirstTask, indexOfLastTask);

        return (
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h2 className="m-0">Task Manager</h2>
                    <div className="d-flex align-items-center gap-2">
                        <Form.Select
                            size="sm"
                            value={sortMode}
                            onChange={this.handleSortChange}
                            className="w-auto"
                        >
                            <option value="dueDate">Sort by Due Date</option>
                        </Form.Select>
                        <Form.Select
                            size="sm"
                            value={filterStatus}
                            onChange={(e) => this.setState({ 
                                filterStatus: e.target.value as TaskManagerState["filterStatus"],
                                currentPage: 1 // reset to first page
                            })}
                            className="w-auto"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </Form.Select>
                        <Button
                            variant="primary"
                            onClick={() => this.handleModalOpen()}
                        >
                            Create Task
                        </Button>
                    </div>
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
                            {currentTasks.map(task => (
                                <tr key={task.taskID}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</td>
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
                        <div className="d-flex justify-content-center gap-2 mt-3">
                            <Button
                                size="sm"
                                disabled={this.state.currentPage === 1}
                                onClick={() => this.setState({ currentPage: this.state.currentPage - 1 })}
                            >
                                Previous
                            </Button>

                            <span>Page {this.state.currentPage} of {Math.ceil(visibleTasks.length / this.state.tasksPerPage)}</span>

                            <Button
                                size="sm"
                                disabled={this.state.currentPage === Math.ceil(visibleTasks.length / this.state.tasksPerPage)}
                                onClick={() => this.setState({ currentPage: this.state.currentPage + 1 })}
                            >
                                Next
                            </Button>
                        </div>
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
