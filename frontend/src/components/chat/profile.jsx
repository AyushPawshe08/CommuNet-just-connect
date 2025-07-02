import React, { useState } from 'react';
import { Settings, LogOut, X, Camera, Edit } from 'lucide-react';
import { useAuthStore } from '../../socket/useAuth';
import AvatarSelection from '../chat/avatarSelection';

const Profile = ({ showProfile, setShowProfile }) => {
  const { authUser, logout, updateProfile } = useAuthStore();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  if (!showProfile || !authUser) return null;
  
  const handleLogout = async () => {
    try {
      await logout();
      setShowProfile(false);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleAvatarUpdate = async (newAvatar) => {
    try {
      // Call your auth store update function
      await updateProfile({ profilePic: newAvatar });
    } catch (error) {
      console.error('Failed to update avatar:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg w-full max-w-md transform transition-all duration-300 scale-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="relative inline-block">
                {authUser.profilePic ? (
                  <img 
                    src={authUser.profilePic} 
                    alt={authUser.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {authUser.name?.charAt(0).toUpperCase() || authUser.email?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                
                {/* Avatar Edit Button */}
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-colors duration-200 shadow-lg"
                  title="Change Avatar"
                >
                  <Camera size={16} className="text-white" />
                </button>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{authUser.name || 'User'}</h3>
              <p className="text-gray-400">{authUser.email}</p>
              <p className="text-green-400 text-sm mt-2">Online</p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowAvatarModal(true)}
                className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <Edit size={20} />
                <span>Change Avatar</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <AvatarSelection
        showAvatarModal={showAvatarModal}
        setShowAvatarModal={setShowAvatarModal}
        currentAvatar={authUser.profilePic}
        onAvatarUpdate={handleAvatarUpdate}
      />
    </>
  );
};

export default Profile;