import { useRef, useState } from 'react';
import { submitContactForm } from '../api/contact';

const EMPTY_VALUES = { name: '', email: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const FIELD_CLASSES =
  'mt-1 block w-full rounded-md border bg-white px-3 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2';
const VALID_CLASSES = 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/30';
const INVALID_CLASSES = 'border-red-600 focus:border-red-600 focus:ring-red-600/30';

function validateField(name, value) {
  const trimmed = value.trim();
  if (name === 'name') return trimmed ? '' : 'Please enter your name.';
  if (name === 'message') return trimmed ? '' : 'Please enter a message.';
  if (!trimmed) return 'Please enter your email address.';
  return EMAIL_PATTERN.test(trimmed) ? '' : 'Please enter a valid email address, like name@example.com.';
}

function Field({ as: Control = 'input', label, name, error, ...props }) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <Control
        id={name}
        name={name}
        aria-required="true"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${FIELD_CLASSES} ${error ? INVALID_CLASSES : VALID_CLASSES}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);

  function handleChange({ target: { name, value } }) {
    setValues((current) => ({ ...current, [name]: value }));
    setStatus((current) => (current === 'submitting' ? current : 'idle'));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
    }
  }

  function handleBlur({ target: { name, value } }) {
    setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'submitting') return;

    const nextErrors = Object.fromEntries(
      Object.entries(values).map(([name, value]) => [name, validateField(name, value)]),
    );
    setErrors(nextErrors);

    const firstInvalid = Object.keys(values).find((name) => nextErrors[name]);
    if (firstInvalid) {
      setStatus('idle');
      formRef.current.elements[firstInvalid].focus();
      return;
    }

    setStatus('submitting');
    try {
      await submitContactForm(values);
      setValues(EMPTY_VALUES);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const submitting = status === 'submitting';

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-lg space-y-5 rounded-lg bg-white p-5 shadow sm:p-8"
    >
      <h1 className="text-2xl font-semibold text-slate-900">Contact Us</h1>

      <Field
        label="Name"
        name="name"
        type="text"
        autoComplete="name"
        value={values.name}
        error={errors.name}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        error={errors.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Field
        as="textarea"
        label="Message"
        name="message"
        rows={5}
        value={values.message}
        error={errors.message}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? 'Sending…' : 'Send message'}
      </button>

      <div role="status">
        {status === 'success' && (
          <p className="rounded-md bg-green-50 p-3 text-sm text-green-800">
            Thanks! Your message has been sent.
          </p>
        )}
        {status === 'error' && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            Sorry, your message could not be sent. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}
