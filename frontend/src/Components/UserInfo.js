// Import the necessary dependencies, such as useState and useEffect
import { useState, useEffect } from 'react';

// Define a function to fetch user info by email
const UserInfo = (email) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users?email=${email}`);
        if (response.ok) {
          const result = await response.json();
          setUserInfo(result);
        } else {
          const result = await response.json();
          setError(result.error || 'Failed to fetch user information');
        }
      } catch (error) {
        setError('An error occurred while fetching user information');
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchUserInfo();
    }
  }, [email]);

  return { userInfo, loading, error };
};

export default UserInfo;
