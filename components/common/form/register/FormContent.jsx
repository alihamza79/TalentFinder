import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For Next.js routing
import { ToastContainer, toast } from 'react-toastify'; // Toaster notifications
import 'react-toastify/dist/ReactToastify.css';
import { registerUser } from '../../../../appwrite/Services/authServices';

const FormContent = ({ isEmployer }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();



  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission
    setLoading(true);

    try {
      // Register the user, pass whether the user is an employer or candidate
      await registerUser(email, password, isEmployer);
      
      // Show success notification
      toast.success('Registration successful!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Close after 3 seconds
      });

      // Redirect to home page after delay to let user see the success message
      setTimeout(() => {
        router.push('/');
      }, 3000); // 3-second delay before redirecting
    } catch (error) {
      console.error("Error during registration:", error);

      // Show error notification
      toast.error(`Registration failed: ${error}` , {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        <div className="form-group">
          <button className="theme-btn btn-style-one" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>

      {/* Toast notification container */}
      <ToastContainer />
    </>
  );
};

export default FormContent;
