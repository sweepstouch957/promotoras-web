'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { updateUser } from '../../data/users';
import Link from 'next/link';

export default function UploadPhotoPage() {
  const { user, updateUserData } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar si el usuario puede subir foto (primer login)
  const canUploadPhoto = user?.isFirstLogin === true;

  useEffect(() => {
    console.log('UploadPhotoPage - Usuario:', user);
    console.log('UploadPhotoPage - ¿Puede subir foto?:', canUploadPhoto);
    
    // Si no hay usuario autenticado, redirigir al login
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Si no es primer login, redirigir al dashboard
    if (user && !canUploadPhoto) {
      console.log('No es primer login, redirigiendo al dashboard');
      router.push('/dashboard');
    }
  }, [user, canUploadPhoto, router]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB límite
        setError('La imagen no puede ser mayor a 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !user) return;

    setIsUploading(true);
    setError(null);

    try {
      // Simular subida de imagen (en producción sería una API real)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Actualizar el usuario para marcar que ya no es primer login y guardar la imagen
      const updatedUser = updateUser(user.id, {
        isFirstLogin: false,
        profileImage: selectedImage
      });

      if (updatedUser) {
        // Actualizar el contexto de autenticación
        updateUserData(updatedUser);
        
        console.log('Foto subida exitosamente, redirigiendo al dashboard');
        // Redirigir al dashboard
        router.push('/dashboard');
      } else {
        setError('Error al actualizar el perfil');
      }
    } catch (err) {
      setError('Error al subir la imagen. Por favor intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    if (canUploadPhoto) {
      fileInputRef.current?.click();
    }
  };

  const handleSkip = () => {
    if (!user) return;
    
    // Marcar como no primer login sin foto
    const updatedUser = updateUser(user.id, {
      isFirstLogin: false
    });

    if (updatedUser) {
      updateUserData(updatedUser);
      router.push('/dashboard');
    }
  };

  // Si no es primer login, mostrar loading mientras redirige
  if (!canUploadPhoto) {
    return (
      <div className="mobile-container">
        <div className="upload-photo-container">
          <div className="upload-loading">
            <p>Redirigiendo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <div className="upload-photo-container">
        {/* Back Button */}
        <Link href="/login" className="upload-back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
          </svg>
          Atrás
        </Link>

        {/* Title */}
        <h1 className="upload-title">Sube tu Foto</h1>

        {/* Avatar Section */}
        <div className="upload-avatar-container">
          <div className="upload-avatar">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Foto seleccionada" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <div className="upload-avatar-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <button 
          className="upload-image-button"
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          Subir Imagen
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />

        {/* Error Message */}
        {error && (
          <div className="upload-error">
            <p>{error}</p>
          </div>
        )}

        {/* Continue Button */}
        <button 
          className="upload-continue-button"
          onClick={handleUpload}
          disabled={isUploading || !selectedImage}
        >
          {isUploading ? 'Subiendo...' : 'Terminar'}
        </button>

        {/* Skip Button - opcional para usuarios que no quieren subir foto ahora */}
        

        {/* Logo */}
        <div className="upload-logo">
          <svg width="120" height="24" viewBox="0 0 200 40" fill="#e91e63">
            <text x="0" y="25" fontSize="16" fontWeight="600">sweepsTOUCH</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

