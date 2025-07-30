'use client';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProfileSelectorProps {
  open: boolean;
  onClose: () => void;
  onProfileSelected: (profileImage: string) => void;
}

const profileOptions = [
  {
    id: 'avatar1',
    name: 'María',
    image: '👩‍💼',
    color: '#e91e63',
  },
  {
    id: 'avatar2',
    name: 'Ana',
    image: '👩‍🦱',
    color: '#9c27b0',
  },
  {
    id: 'avatar3',
    name: 'Sofía',
    image: '👩‍🦰',
    color: '#3f51b5',
  },
  {
    id: 'avatar4',
    name: 'Carmen',
    image: '👩‍🦳',
    color: '#009688',
  },
  {
    id: 'avatar5',
    name: 'Isabel',
    image: '👩‍💻',
    color: '#ff9800',
  },
  {
    id: 'avatar6',
    name: 'Elena',
    image: '👩‍🎓',
    color: '#4caf50',
  },
];

export default function ProfileSelector({ open, onClose, onProfileSelected }: ProfileSelectorProps) {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const { updateUser, user } = useAuth();

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
  };

  const handleConfirm = async () => {
    if (selectedProfile && user) {
      const selectedOption = profileOptions.find(p => p.id === selectedProfile);
      if (selectedOption) {
        // Update user with selected profile image
        await updateUser({
          profileImage: selectedOption.image,
          isFirstLogin: false, // Mark that first login is complete
        });
        
        onProfileSelected(selectedOption.image);
        onClose();
      }
    }
  };

  const handleSkip = async () => {
    if (user) {
      // Mark first login as complete even if skipped
      await updateUser({
        isFirstLogin: false,
      });
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="profile-selector-overlay">
      <div className="profile-selector-modal">
        <div className="profile-selector-header">
          <button onClick={handleSkip} className="profile-selector-close">
            ×
          </button>
          
          <h2 className="profile-selector-title">Elige tu Avatar</h2>
          <p className="profile-selector-subtitle">
            Selecciona un avatar que te represente en la aplicación
          </p>
        </div>

        <div className="profile-grid">
          {profileOptions.map((profile) => (
            <div
              key={profile.id}
              className={`profile-option ${selectedProfile === profile.id ? 'selected' : ''}`}
              onClick={() => handleProfileSelect(profile.id)}
            >
              <div 
                className="profile-option-avatar"
                style={{ backgroundColor: profile.color }}
              >
                {profile.image}
              </div>
              <span className="profile-option-name">{profile.name}</span>
              {selectedProfile === profile.id && (
                <span className="profile-option-check">✓</span>
              )}
            </div>
          ))}
        </div>

        <div className="profile-selector-actions">
          <button
            className="profile-selector-button outline"
            onClick={handleSkip}
          >
            Omitir
          </button>
          <button
            className="profile-selector-button filled"
            onClick={handleConfirm}
            disabled={!selectedProfile}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

