'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useUploadPhoto, useUpdateProfile } from '../../hooks/usePromoterData';
import { CircularProgress, Alert } from '@mui/material';
import Link from 'next/link';

export default function UploadPhotoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mutations
  const uploadPhotoMutation = useUploadPhoto();
  const updateProfileMutation = useUpdateProfile();

  // Verificar si el usuario puede subir foto (primer login)
  const canUploadPhoto = user?.isFirstLogin === true;

  useEffect(() => {
    
    // Si no hay usuario autenticado, redirigir al login
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Si no es primer login, redirigir al dashboard
    if (user && !canUploadPhoto) {
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
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !selectedFile || !user) return;

    try {
      setError(null);

      // Subir la imagen usando la API
      const uploadResult = await uploadPhotoMutation.mutateAsync(selectedFile);
      
      if (uploadResult.url) {
        // Actualizar el perfil del usuario
        await updateProfileMutation.mutateAsync({
          userId: user.id,
          updates: {
            isFirstLogin: false,
            profileImage: uploadResult.url
          }
        });
                router.push('/dashboard');
      } else {
        throw new Error('No se obtuvo URL de la imagen subida');
      }
    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      setError(error.message || 'Error al subir la imagen. Por favor intenta de nuevo.');
    }
  };

  const handleButtonClick = () => {
    if (canUploadPhoto) {
      fileInputRef.current?.click();
    }
  };

  const handleSkip = async () => {
    if (!user) return;
    
    try {
      setError(null);
      // Marcar como no primer login sin foto
      await updateProfileMutation.mutateAsync({
        userId: user.id,
        updates: {
          isFirstLogin: false
        }
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error al marcar primer login:', error);
      setError(error.message || 'Error al procesar. Intenta de nuevo.');
    }
  };

  const isLoading = uploadPhotoMutation.isPending || updateProfileMutation.isPending;

  // Si no es primer login, mostrar loading mientras redirige
  if (!canUploadPhoto) {
    return (
      <div className="mobile-container">
        <div className="upload-photo-container">
          <div className="upload-loading">
            <CircularProgress size={40} sx={{ color: '#e91e63' }} />
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
        <Link 
          href="/login" 
          className="upload-back-button"
          style={{ 
            opacity: isLoading ? 0.5 : 1,
            pointerEvents: isLoading ? 'none' : 'auto'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
          </svg>
          Atrás
        </Link>

        {/* Title */}
        <h1 className="upload-title">Sube tu Foto</h1>

        {/* Error Message */}
        {error && (
          <div className="upload-error" style={{ margin: '16px 0' }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

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
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          {isLoading ? 'Procesando...' : 'Subir Imagen'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />

        {/* Continue Button */}
        <button 
          className="upload-continue-button"
          onClick={handleUpload}
          disabled={isLoading || !selectedImage}
          style={{
            opacity: (isLoading || !selectedImage) ? 0.5 : 1,
            cursor: (isLoading || !selectedImage) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isLoading && <CircularProgress size={20} sx={{ color: 'white' }} />}
          {isLoading ? 'Subiendo...' : 'Terminar'}
        </button>

        {/* Skip Button */}
        <button 
          className="upload-skip-button"
          onClick={handleSkip}
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.5 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginTop: '16px',
            background: 'transparent',
            border: '1px solid #ccc',
            color: '#666',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        >
          {isLoading ? 'Procesando...' : 'Omitir por ahora'}
        </button>

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

