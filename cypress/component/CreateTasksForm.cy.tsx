import CreateTaskForm from "../../src/components/CreateTaskForm";


interface TaskFormData {
  title: string;
  description: string;
  currentProgress: string;
  targetProgress: string;
  metric: string;
}

const VALID_FORM_DATA: TaskFormData = {
  title: 'Test Task',
  description: 'Test Description',
  currentProgress: '0',
  targetProgress: '10',
  metric: 'hours',
}

const IN_VALID_FORM_DATA: TaskFormData = {
  title: 'Test Task 2',
  description: 'Test Description',
  currentProgress: '0',
  targetProgress: '10',
  metric: 'hours',
};

const VALID_FORM_DATA_2: TaskFormData = {
  title: 'Test Task 3',
  description: 'Test Description',
  currentProgress: '0',
  targetProgress: '10',
  metric: 'hours',
};

function fillForm(formData: TaskFormData) {
  cy.findByLabelText(/title/i).type(formData.title);
  cy.findByLabelText(/description/i).type(formData.description);
  cy.findByLabelText(/metric/i).type(formData.metric);
  cy.findByLabelText(/target progress/i).clear().type(formData.targetProgress);
}

function submitForm() {
  cy.findByRole('button', { name: /create task/i }).click();
}

function clickCancel() {
  cy.findByRole('button', { name: /cancel/i }).click();
}

describe('CreateTaskForm', () => {

  let onClose;
  let refetch;

  beforeEach(() => {
    onClose = cy.stub().as('onClose');
    refetch = cy.stub().as('refetch');
    cy.mount(<CreateTaskForm onClose={onClose} refetch={refetch} />);
  });

  it('renders the form with all required fields', () => {
    cy.findByLabelText(/title/i).should('exist');
    cy.findByLabelText(/description/i).should('exist');
    cy.findByLabelText(/current progress/i).should('exist');
    cy.findByLabelText(/target progress/i).should('exist');
    cy.findByLabelText(/metric/i).should('exist');
  });

  it('should submit the correct payload', () => {
    cy.intercept('POST', 'http://localhost:3000/tasks', (req) => {
      console.log('Intercepted request body:', req.body);
      expect(req.body).to.deep.equal({
        title: VALID_FORM_DATA.title,
        description: VALID_FORM_DATA.description,
        currentProgress: Number(VALID_FORM_DATA.currentProgress),
        targetProgress: Number(VALID_FORM_DATA.targetProgress),
        metric: VALID_FORM_DATA.metric,
      });

      req.reply({ statusCode: 201, body: { id: 1 } });
    }).as('createTask');

    fillForm(VALID_FORM_DATA);
    submitForm();

    cy.wait('@createTask');
  });

  it('calls refetch and onClose after successful form submission', () => {
    cy.intercept('POST', 'http://localhost:3000/tasks', {
      statusCode: 201,
      body: { id: 1, title: VALID_FORM_DATA.title },
    }).as('createTask');

    fillForm(VALID_FORM_DATA);
    submitForm();

    cy.wait('@createTask');
    cy.get('@refetch').should('have.been.calledOnce');
    cy.get('@onClose').should('have.been.calledOnce');
  });

  it('does not call onClose or refetch when submission fails', () => {
    cy.intercept('POST', 'http://localhost:3000/tasks', {
      statusCode: 400,
      body: { message: 'Invalid task data' },
    }).as('createTaskFail');

    fillForm(IN_VALID_FORM_DATA);
    submitForm();

    cy.wait('@createTaskFail');
    cy.get('@refetch').should('not.have.been.called');
    cy.get('@onClose').should('not.have.been.called');
  });

  it('disables the submit button while submitting', () => {
    cy.intercept('POST', 'http://localhost:3000/tasks', {
      delay: 2000,
      statusCode: 201,
      body: { id: 1 },
    }).as('createTaskSlow');

  fillForm(VALID_FORM_DATA_2);
  submitForm();

  cy.findByRole('button', { name: /creating/i }).should('be.disabled');
  cy.wait('@createTaskSlow');
});

it('calls the onClose function on clicking cancel button', () => {
  clickCancel();
  cy.get('@onClose').should('have.been.called');
});

});