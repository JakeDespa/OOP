import React, { Component } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Tabs, Tab, Image } from 'react-bootstrap';
import { User } from '../models/User';
import ApiClient from '../services/ApiClient';

interface UserProfileProps {
    onThemeChange?: (theme: 'light' | 'dark') => void;
}

interface UserProfileState {
    user: User | null;
    loading: boolean;
    editing: boolean;
    formData: {
        name: string;
        email: string;
        theme: string;
    };
    passwordData: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    };
    error: string | null;
    success: string | null;
    changingPassword: boolean;
    uploadingPicture: boolean;
    previewImage: string | null;
}

class UserProfile extends Component<UserProfileProps, UserProfileState> {
    private fileInputRef = React.createRef<HTMLInputElement>();

    constructor(props: UserProfileProps) {
        super(props);
        this.state = {
            user: null,
            loading: true,
            editing: false,
            formData: {
                name: '',
                email: '',
                theme: 'light',
            },
            passwordData: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
            error: null,
            success: null,
            changingPassword: false,
            uploadingPicture: false,
            previewImage: null,
        };
    }

    componentDidMount() {
        this.loadUserProfile();
    }

    loadUserProfile = async () => {
        try {
            this.setState({ loading: true, error: null });
            // Fetch user profile from backend
            const user = await ApiClient.getUserProfile();
            
            // Also update localStorage with the latest profile data
            localStorage.setItem('user', JSON.stringify({
                userID: user.userID,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                theme: user.theme,
            }));

            this.setState({
                user,
                loading: false,
                formData: {
                    name: user.name,
                    email: user.email,
                    theme: user.theme || 'light',
                },
            });
        } catch (error) {
            this.setState({
                error: 'Failed to load user profile',
                loading: false,
            });
        }
    };

    handleEditToggle = () => {
        if (this.state.editing) {
            // Cancel editing
            this.setState({
                editing: false,
                formData: {
                    name: this.state.user?.name || '',
                    email: this.state.user?.email || '',
                    theme: this.state.user?.theme || 'light',
                },
            });
        } else {
            // Enable editing
            this.setState({ editing: true });
        }
    };

    handleInputChange = (e: any) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            formData: {
                ...prevState.formData,
                [name]: value,
            },
        }));
    };

    handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            passwordData: {
                ...prevState.passwordData,
                [name]: value,
            },
        }));
    };

    handleSaveChanges = async () => {
        try {
            this.setState({ error: null, success: null });
            
            // Call API to update profile
            const updatedUser = await ApiClient.updateUserProfile({
                name: this.state.formData.name,
                email: this.state.formData.email,
                theme: this.state.formData.theme,
            });

            // Update user in localStorage
            localStorage.setItem('user', JSON.stringify({
                userID: updatedUser.userID,
                name: updatedUser.name,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
                theme: updatedUser.theme,
            }));

            // Apply theme if it changed
            if (this.props.onThemeChange && updatedUser.theme) {
                this.props.onThemeChange(updatedUser.theme as 'light' | 'dark');
            }

            this.setState({
                user: updatedUser,
                editing: false,
                success: 'Profile updated successfully!',
            });

            // Clear success message after 3 seconds
            setTimeout(() => {
                this.setState({ success: null });
            }, 3000);
        } catch (error) {
            this.setState({
                error: 'Failed to update profile',
            });
        }
    };

    handleChangePassword = async () => {
        try {
            this.setState({ error: null, success: null, changingPassword: true });

            const { currentPassword, newPassword, confirmPassword } = this.state.passwordData;

            // Validation
            if (!currentPassword || !newPassword || !confirmPassword) {
                this.setState({
                    error: 'All password fields are required',
                    changingPassword: false,
                });
                return;
            }

            if (newPassword !== confirmPassword) {
                this.setState({
                    error: 'New password and confirm password do not match',
                    changingPassword: false,
                });
                return;
            }

            if (newPassword.length < 6) {
                this.setState({
                    error: 'New password must be at least 6 characters long',
                    changingPassword: false,
                });
                return;
            }

            // Call API to change password
            await ApiClient.changePassword(currentPassword, newPassword);

            this.setState({
                success: 'Password changed successfully!',
                passwordData: {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                },
                changingPassword: false,
            });

            // Clear success message after 3 seconds
            setTimeout(() => {
                this.setState({ success: null });
            }, 3000);
        } catch (error: any) {
            this.setState({
                error: error.response?.data?.message || 'Failed to change password',
                changingPassword: false,
            });
        }
    };

    handleProfilePictureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.setState({ error: 'Image size must be less than 5MB' });
            return;
        }

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
            this.setState({ error: 'Unsupported image format. Please use JPEG, PNG, GIF, or WebP' });
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target?.result as string;
            this.setState({ previewImage: base64String });
        };
        reader.readAsDataURL(file);
    };

    handleUploadProfilePicture = async () => {
        if (!this.state.previewImage) {
            this.setState({ error: 'Please select an image first' });
            return;
        }

        try {
            this.setState({ error: null, success: null, uploadingPicture: true });

            const updatedUser = await ApiClient.uploadProfilePicture(this.state.previewImage);

            // Update localStorage
            const userData = {
                userID: updatedUser.userID,
                name: updatedUser.name,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
            };
            localStorage.setItem('user', JSON.stringify(userData));

            this.setState({
                user: updatedUser,
                previewImage: null,
                success: 'Profile picture uploaded successfully!',
                uploadingPicture: false,
            });

            // Clear success message after 3 seconds
            setTimeout(() => {
                this.setState({ success: null });
            }, 3000);

            // Reset file input
            if (this.fileInputRef.current) {
                this.fileInputRef.current.value = '';
            }
        } catch (error: any) {
            this.setState({
                error: error.response?.data?.message || 'Failed to upload profile picture',
                uploadingPicture: false,
            });
        }
    };

    handleDeleteProfilePicture = async () => {
        try {
            this.setState({ error: null, success: null });

            await ApiClient.deleteProfilePicture();

            const updatedUser = { ...this.state.user! };
            updatedUser.profilePicture = undefined;

            // Update localStorage
            const userData = {
                userID: updatedUser.userID,
                name: updatedUser.name,
                email: updatedUser.email,
                profilePicture: undefined,
            };
            localStorage.setItem('user', JSON.stringify(userData));

            this.setState({
                user: updatedUser,
                success: 'Profile picture deleted successfully!',
            });

            // Clear success message after 3 seconds
            setTimeout(() => {
                this.setState({ success: null });
            }, 3000);
        } catch (error: any) {
            this.setState({
                error: error.response?.data?.message || 'Failed to delete profile picture',
            });
        }
    };

    render() {
        const { user, loading, editing, formData, passwordData, error, success, changingPassword, uploadingPicture, previewImage } = this.state;

        if (loading) {
            return (
                <Container className="mt-4">
                    <div className="text-center">Loading profile...</div>
                </Container>
            );
        }

        if (!user) {
            return (
                <Container className="mt-4">
                    <Alert variant="warning">User profile not found</Alert>
                </Container>
            );
        }

        return (
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        {error && <Alert variant="danger" onClose={() => this.setState({ error: null })} dismissible>{error}</Alert>}
                        {success && <Alert variant="success" onClose={() => this.setState({ success: null })} dismissible>{success}</Alert>}

                        <Tabs defaultActiveKey="profile" className="mb-3">
                            <Tab eventKey="profile" title="Profile Information">
                                <Card>
                                    <Card.Body>
                                        {!editing ? (
                                            // Display Mode
                                            <>
                                                <div className="mb-3">
                                                    <strong>Name:</strong>
                                                    <p>{user.name}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Email:</strong>
                                                    <p>{user.email}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <strong>User ID:</strong>
                                                    <p>{user.userID}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Theme:</strong>
                                                    <p>{user.theme ? user.theme.charAt(0).toUpperCase() + user.theme.slice(1) : 'Light'}</p>
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    onClick={this.handleEditToggle}
                                                    className="w-100"
                                                >
                                                    Edit Profile
                                                </Button>
                                            </>
                                        ) : (
                                            // Edit Mode
                                            <>
                                                <Form>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={this.handleInputChange}
                                                            placeholder="Enter your name"
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={this.handleInputChange}
                                                            placeholder="Enter your email"
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Theme</Form.Label>
                                                        <Form.Select
                                                            name="theme"
                                                            value={formData.theme}
                                                            onChange={this.handleInputChange}
                                                        >
                                                            <option value="light">Light</option>
                                                            <option value="dark">Dark</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="success"
                                                            onClick={this.handleSaveChanges}
                                                            className="flex-grow-1"
                                                        >
                                                            Save Changes
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            onClick={this.handleEditToggle}
                                                            className="flex-grow-1"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Tab>

                            <Tab eventKey="picture" title="Profile Picture">
                                <Card>
                                    <Card.Body>
                                        <div className="text-center mb-4">
                                            {previewImage ? (
                                                <Image
                                                    src={previewImage}
                                                    alt="Preview"
                                                    rounded
                                                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                                                />
                                            ) : user.profilePicture ? (
                                                <Image
                                                    src={user.profilePicture}
                                                    alt="Profile"
                                                    rounded
                                                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '150px',
                                                        height: '150px',
                                                        margin: '0 auto',
                                                        backgroundColor: '#e9ecef',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#999',
                                                    }}
                                                >
                                                    No Picture
                                                </div>
                                            )}
                                        </div>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Select Image</Form.Label>
                                            <Form.Control
                                                ref={this.fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif,image/webp"
                                                onChange={this.handleProfilePictureSelect}
                                            />
                                            <Form.Text className="text-muted">
                                                Max size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
                                            </Form.Text>
                                        </Form.Group>

                                        <div className="d-flex gap-2">
                                            {previewImage && (
                                                <Button
                                                    variant="success"
                                                    onClick={this.handleUploadProfilePicture}
                                                    disabled={uploadingPicture}
                                                    className="flex-grow-1"
                                                >
                                                    {uploadingPicture ? 'Uploading...' : 'Upload Picture'}
                                                </Button>
                                            )}
                                            {user.profilePicture && (
                                                <Button
                                                    variant="danger"
                                                    onClick={this.handleDeleteProfilePicture}
                                                    className="flex-grow-1"
                                                >
                                                    Delete Current Picture
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab>

                            <Tab eventKey="password" title="Change Password">
                                <Card>
                                    <Card.Body>
                                        <Form>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Current Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={this.handlePasswordInputChange}
                                                    placeholder="Enter your current password"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={this.handlePasswordInputChange}
                                                    placeholder="Enter your new password"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={this.handlePasswordInputChange}
                                                    placeholder="Confirm your new password"
                                                />
                                            </Form.Group>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="success"
                                                    onClick={this.handleChangePassword}
                                                    disabled={changingPassword}
                                                    className="flex-grow-1"
                                                >
                                                    {changingPassword ? 'Changing...' : 'Change Password'}
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => this.setState({
                                                        passwordData: {
                                                            currentPassword: '',
                                                            newPassword: '',
                                                            confirmPassword: '',
                                                        },
                                                    })}
                                                    className="flex-grow-1"
                                                    disabled={changingPassword}
                                                >
                                                    Clear
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab>


                        </Tabs>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default UserProfile;
