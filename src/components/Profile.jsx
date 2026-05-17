import React, { useEffect } from 'react'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const Profile = () => {
  const user = useSelector(store => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div><EditProfile user={user}></EditProfile></div>
  )
}

export default Profile