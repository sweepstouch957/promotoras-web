"use client";
import { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUploadPhoto, useUpdateProfile } from "../hooks/usePromoterData";
import { CircularProgress, Alert } from "@mui/material";

interface ProfileSelectorProps {
  open: boolean;
  onClose: () => void;
  onProfileSelected: (profileImage: string) => void;
}

export default function ProfileSelector({
  open,
  onClose,
  onProfileSelected,
}: ProfileSelectorProps) {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<"avatar" | "photo">("avatar");
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mutations
  const uploadPhotoMutation = useUploadPhoto();
  const updateProfileMutation = useUpdateProfile();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validaciones
      if (file.size > 5 * 1024 * 1024) {
        // 5MB límite
        setError("La imagen no puede ser mayor a 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Por favor selecciona un archivo de imagen válido");
        return;
      }

      setError(null);
      setSelectedFile(file);
      setSelectedProfile(null);
      setUploadType("photo");

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = async () => {
    if (!user || !user._id) {
      setError("Usuario no autenticado");
      return;
    }

    try {
      setError(null);

      if (uploadType === "photo" && selectedFile) {
        // Subir foto real
        const uploadResult = await uploadPhotoMutation.mutateAsync(
          selectedFile
        );

        if (uploadResult.url) {
          // Actualizar perfil con la URL de la foto
          await updateProfileMutation.mutateAsync({
            userId: user._id,
            updates: {
              profileImage: uploadResult.url,
              isFirstLogin: false,
            },
          });

          onProfileSelected(uploadResult.url);
          onClose();
        } else {
          throw new Error("No se obtuvo URL de la imagen subida");
        }
      } else {
        setError("Por favor selecciona un avatar o sube una foto");
      }
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      setError(
        error.message || "Error al actualizar el perfil. Intenta de nuevo."
      );
    }
  };

  const handleSkip = async () => {
    if (!user) return;

    try {
      setError(null);
      await updateProfileMutation.mutateAsync({
        userId: user._id,
        updates: {
          isFirstLogin: false,
        },
      });
      onClose();
    } catch (error: any) {
      console.error("Error al marcar primer login:", error);
      setError(error.message || "Error al procesar. Intenta de nuevo.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const isLoading =
    uploadPhotoMutation.isPending || updateProfileMutation.isPending;
  const hasSelection = selectedProfile || selectedFile;

  if (!open) return <></>;

  return (
    <div className="profile-selector-overlay">
      <div className="profile-selector-modal">
        <div className="profile-selector-header">
          <button
            onClick={handleSkip}
            className="profile-selector-close"
            disabled={isLoading}
          >
            ×
          </button>

          <h2 className="profile-selector-title">Elige tu Avatar</h2>
          <p className="profile-selector-subtitle">
            Selecciona un avatar que te represente o sube tu propia foto
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="upload-error" style={{ margin: "16px 0" }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {/* Upload Photo Section */}
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <button
            onClick={handleUploadClick}
            disabled={isLoading}
            style={{
              backgroundColor: "#e91e63",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "0 auto",
            }}
          >
            📷 Subir mi propia foto
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          {/* Preview de la foto subida */}
          {previewImage && (
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto",
                  border: "3px solid #e91e63",
                }}
              >
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                Vista previa de tu foto
              </p>

              <Alert severity="info" style={{ marginTop: "8px" }}>
                Asegúrate de que tu foto seas tú y que no tenga filtros o
                ediciones excesivas.
              </Alert>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="profile-selector-actions">
          <button
            className="profile-selector-button filled"
            onClick={handleConfirm}
            disabled={!hasSelection || isLoading}
            style={{
              opacity: !hasSelection || isLoading ? 0.5 : 1,
              cursor: !hasSelection || isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <CircularProgress size={16} sx={{ color: "white" }} />
                {uploadType === "photo" ? "Subiendo..." : "Guardando..."}
              </div>
            ) : (
              "Confirmar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
