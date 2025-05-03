import { useState } from 'react';
import Loading from './Loading';

interface FormField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  pattern?: string;
  minLength?: number;
}

interface AuthFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  error?: string;
  buttonText: string;
  footer?: React.ReactNode;
}

export default function AuthForm({ title, fields, onSubmit, error, buttonText, footer }: AuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100"> {/* Changed background color */}
      <form onSubmit={handleSubmit} data-testid="auth-form" className="space-y-4 w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-2xl border border-blue-300/20"> {/* Added blue border */}
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">{title}</h2> {/* Changed text color */}

        {error && (
          <div className="mb-4 p-3 bg-blue-200 text-blue-800 rounded"> {/* Changed background and text color */}
            {error}
          </div>
        )}

        {fields.map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block text-blue-700 text-sm font-bold mb-2"> {/* Changed text color */}
              {field.label}
            </label>
            <input
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" {/* Changed focus ring color */}
              required={field.required}
              pattern={field.pattern}
              minLength={field.minLength}
              disabled={loading}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed" {/* Adjusted blue shades */}
        >
          {loading ? <Loading /> : buttonText}
        </button>

        {footer && (
          <div className="mt-4 text-center text-blue-700"> {/* Changed text color */}
            {footer}
          </div>
        )}
      </form>
    </div>
  );
}