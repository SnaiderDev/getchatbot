import { useState } from 'react';
import { login } from '../api/auth'
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setIsLoading(true);
        const data = await login({ email, password });

        navigate('/'); // Redirect after successful login
      } catch (err) {
        setError('Invalid credentials: '+ err);
      }
      finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="h-screen bg-bg flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded shadow-md">
      {error && <p className="text-red-500">{error}</p>}
        <h2 className="text-txt text-lg mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded text-bg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded text-bg"
        />

        {isLoading ? (
          <Loader />
        ) : (
          <>  </>
        )}
        <button type="submit" className="bg-btn text-txt w-full p-2 rounded">
          Iniciar sesión
        </button>

        <p className="text-txt mt-4 text-center">
          ¿No tiene cuenta? <a href="/register" className="text-btn hover:underline">Registrese aquí</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
