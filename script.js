// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enquiry-form');
    const submitButton = form.querySelector('input[type="submit"]');
    
    // Error message display function
    function showError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message') || 
                        createErrorDiv(formGroup);
        errorDiv.textContent = message;
        formGroup.classList.add('error');
        inputElement.setAttribute('aria-invalid', 'true');
    }

    // Create error message div
    function createErrorDiv(formGroup) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formGroup.appendChild(errorDiv);
        return errorDiv;
    }

    // Clear error message
    function clearError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = '';
        }
        formGroup.classList.remove('error');
        inputElement.setAttribute('aria-invalid', 'false');
    }

    // Validation functions
    const validators = {
        fullName: (value) => {
            if (!value) return 'Please enter your full name.';
            if (value.length < 2) return 'Name is too short. Please enter your full name.';
            if (!/^[a-zA-Z\s]*$/.test(value)) return 'Name should only contain letters and spaces.';
            return '';
        },

        email: (value) => {
            if (!value) return 'Please enter your email address.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return 'Please enter a valid email address (e.g., name@example.com).';
            }
            return '';
        },

        phone: (value) => {
            if (!value) return 'Please enter your phone number.';
            if (!/^\+?[\d\s-]{7,15}$/.test(value)) {
                return 'Please enter a valid phone number (between 7 and 15 digits).';
            }
            return '';
        },

        course: (value) => {
            if (!value) return 'Please select a course you\'re interested in.';
            return '';
        },

        studyMode: (value) => {
            if (!value) return 'Please select your preferred study mode.';
            return '';
        },

        dateOfBirth: (value) => {
            if (!value) return 'Please enter your date of birth.';
            const date = new Date(value);
            const age = (new Date()).getFullYear() - date.getFullYear();
            if (age < 16) return 'You must be at least 16 years old.';
            if (age > 100) return 'Please enter a valid date of birth.';
            return '';
        }
    };

    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            const validator = validators[this.name];
            if (validator) {
                const error = validator(this.value);
                if (error) {
                    showError(this, error);
                } else {
                    clearError(this);
                }
            }
        });

        input.addEventListener('input', function() {
            clearError(this);
        });
    });

    // Form submission handling
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        let hasErrors = false;

        // Validate all fields
        form.querySelectorAll('input, select, textarea').forEach(input => {
            const validator = validators[input.name];
            if (validator) {
                const error = validator(input.value);
                if (error) {
                    showError(input, error);
                    hasErrors = true;
                }
            }
        });

        if (hasErrors) {
            showGlobalError('Please correct the errors before submitting.');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.value = 'Submitting...';
        showLoadingIndicator();

        try {
            // Simulate API call
            await submitFormData(new FormData(form));
            
            // Show success message
            showSuccessMessage();
            form.reset();
            
        } catch (error) {
            // Handle different types of errors
            if (error.name === 'NetworkError') {
                showGlobalError('Network error. Please check your internet connection and try again.');
            } else if (error.name === 'ValidationError') {
                showGlobalError('Please check your information and try again.');
            } else {
                showGlobalError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            // Reset submit button
            submitButton.disabled = false;
            submitButton.value = 'Submit';
            hideLoadingIndicator();
        }
    });

    // Simulated form submission
    async function submitFormData(formData) {
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                if (Math.random() > 0.5) { // Randomly succeed or fail
                    resolve();
                } else {
                    reject(new Error('Network Error'));
                }
            }, 2000);
        });
    }

    // UI feedback functions
    function showLoadingIndicator() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        form.appendChild(loader);
    }

    function hideLoadingIndicator() {
        const loader = form.querySelector('.loader');
        if (loader) loader.remove();
    }

    function showGlobalError(message) {
        const errorContainer = document.getElementById('form-error-container') || 
                             createGlobalErrorContainer();
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }

    function createGlobalErrorContainer() {
        const container = document.createElement('div');
        container.id = 'form-error-container';
        container.className = 'global-error';
        form.insertBefore(container, form.firstChild);
        return container;
    }

    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Form submitted successfully!';
        form.insertBefore(successMessage, form.firstChild);
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
});
