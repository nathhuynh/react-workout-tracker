import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const AdminLoadExercises: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoadExercises = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/admin/load-exercises');
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error loading exercises');
      console.error('Error loading exercises:', error);
    }

    setLoading(false);
  };

  if (session?.user?.email !== 'admin@email.com') {
    return null;
  }

  return (
    <div>
      <h2>Admin: Load Exercises</h2>
      <button onClick={handleLoadExercises} disabled={loading}>
        {loading ? 'Loading...' : 'Load Exercises'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminLoadExercises;