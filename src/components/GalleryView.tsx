import React, { useState, useRef } from 'react';
import { GalleryPhoto } from '../types';
import { playSound } from '../utils/audio';
import { Camera, Heart, Plus, Trash2, Calendar, Tag, X, Maximize2, Download } from 'lucide-react';

interface GalleryViewProps {
  photos: GalleryPhoto[];
  onUpdatePhotos: (photos: GalleryPhoto[]) => void;
  soundEnabled: boolean;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  photos,
  onUpdatePhotos,
  soundEnabled
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryPhoto['category']>('Paisajes');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['all', 'Paisajes', 'Vecinos', 'Eventos', 'Interiores'];

  const filteredPhotos = photos.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (onlyFavorites && !p.isFavorite) return false;
    return true;
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result);
          if (soundEnabled) playSound('pop');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (!previewUrl) return;
    if (soundEnabled) playSound('fanfare');

    const newPhoto: GalleryPhoto = {
      id: `photo_${Date.now()}`,
      title: title.trim() || 'Recuerdo Insular',
      category,
      url: previewUrl,
      date: date || new Date().toISOString().slice(0, 10),
      description: description.trim(),
      isFavorite: false,
      taggedVillagers: tagsInput
        ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
        : []
    };

    onUpdatePhotos([newPhoto, ...photos]);
    // Reset form
    setTitle('');
    setDescription('');
    setTagsInput('');
    setPreviewUrl('');
    setIsUploadOpen(false);
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (soundEnabled) playSound('bell');
    const updated = photos.map((p) =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    onUpdatePhotos(updated);
    if (lightboxPhoto && lightboxPhoto.id === id) {
      setLightboxPhoto({ ...lightboxPhoto, isFavorite: !lightboxPhoto.isFavorite });
    }
  };

  const handleDeletePhoto = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (soundEnabled) playSound('pop');
    const updated = photos.filter((p) => p.id !== id);
    onUpdatePhotos(updated);
    if (lightboxPhoto && lightboxPhoto.id === id) {
      setLightboxPhoto(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4D8C8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3C342C]">Álbum de Fotos Insular</h1>
          <p className="text-xs text-[#7A6F64] mt-1">
            Galería con tus mejores capturas del juego, atardeceres en el muelle y momentos especiales con tus vecinos.
          </p>
        </div>

        <button
          onClick={() => {
            if (soundEnabled) playSound('pop');
            setIsUploadOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#FAF6F0] bg-[#489D6C] hover:bg-[#3D855B] rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir Captura del Juego</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                if (soundEnabled) playSound('pop');
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#3C342C] text-[#FAF6F0]'
                  : 'bg-[#FCFAF6] border border-[#E4D8C8] text-[#7A6F64] hover:text-[#3C342C]'
              }`}
            >
              {cat === 'all' ? 'Todas las fotos' : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (soundEnabled) playSound('pop');
            setOnlyFavorites(!onlyFavorites);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
            onlyFavorites
              ? 'bg-[#FAEEE8] border-[#C86343] text-[#C86343]'
              : 'bg-[#FCFAF6] border-[#E4D8C8] text-[#7A6F64] hover:text-[#3C342C]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-[#C86343]' : ''}`} />
          <span>Solo Favoritas</span>
        </button>
      </div>

      {/* Photos Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => {
              if (soundEnabled) playSound('pop');
              setLightboxPhoto(photo);
            }}
            className="group bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl overflow-hidden shadow-xs hover:border-[#D2C4B1] transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Image Box */}
            <div className="relative aspect-16/10 overflow-hidden bg-[#F0E8DC]">
              <img
                src={photo.url}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Heart button */}
              <button
                onClick={(e) => toggleFavorite(photo.id, e)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#3C342C]/40 backdrop-blur-xs text-white hover:bg-[#3C342C]/60 transition-colors"
                title={photo.isFavorite ? 'Quitar de favoritas' : 'Añadir a favoritas'}
              >
                <Heart
                  className={`w-4 h-4 ${
                    photo.isFavorite ? 'text-[#C86343] fill-[#C86343]' : 'text-white'
                  }`}
                />
              </button>

              <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#3C342C]/60 backdrop-blur-xs text-[10px] font-semibold text-white">
                {photo.category}
              </div>
            </div>

            {/* Photo Metadata */}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-[#3C342C] group-hover:text-[#489D6C] transition-colors line-clamp-1">
                  {photo.title}
                </h3>
                <span className="text-[10px] text-[#7A6F64] shrink-0 tabular-nums">{photo.date}</span>
              </div>

              {photo.description && (
                <p className="text-xs text-[#5C534A] line-clamp-2 leading-relaxed">
                  {photo.description}
                </p>
              )}

              {photo.taggedVillagers && photo.taggedVillagers.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {photo.taggedVillagers.map((villager) => (
                    <span
                      key={villager}
                      className="text-[10px] text-[#7A6F64] bg-[#FAF6F0] border border-[#E4D8C8]/80 px-2 py-0.5 rounded-md"
                    >
                      @{villager}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="p-12 text-center bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl">
          <Camera className="w-8 h-8 text-[#A89C8F] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#3C342C]">No hay fotos registradas en esta vista.</p>
          <p className="text-xs text-[#7A6F64] mt-1">¡Haz clic en "Añadir Captura del Juego" para subir tus mejores recuerdos!</p>
        </div>
      )}

      {/* UPLOAD PHOTO MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3C342C]/40 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl max-w-lg w-full shadow-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4D8C8]">
              <h3 className="text-base font-bold text-[#3C342C]">Añadir Nueva Captura</h3>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1 text-[#7A6F64] hover:text-[#3C342C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* File input */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#7A6F64] mb-1">
                  Archivo de Imagen (Switch o PC)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 rounded-xl border border-dashed border-[#D2C4B1] bg-[#FCFAF6] hover:bg-[#F0E8DC] text-center text-[#7A6F64] hover:text-[#3C342C] transition-colors cursor-pointer"
                >
                  <Camera className="w-6 h-6 mx-auto mb-1 text-[#A89C8F]" />
                  <span>{previewUrl ? 'Cambiar imagen seleccionada' : 'Seleccionar captura de pantalla'}</span>
                </button>
                {previewUrl && (
                  <div className="mt-2 aspect-16/9 rounded-xl overflow-hidden border border-[#E4D8C8]">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#7A6F64] mb-1">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Concierto de Totakeke en la playa"
                  className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#7A6F64] mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GalleryPhoto['category'])}
                    className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
                  >
                    <option value="Paisajes">Paisajes & Terraforming</option>
                    <option value="Vecinos">Mis Vecinos</option>
                    <option value="Eventos">Eventos Especiales</option>
                    <option value="Interiores">Diseño de Interiores</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#7A6F64] mb-1">Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#7A6F64] mb-1">
                  Vecinos en la foto (separados por coma)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ej: Narciso, Munchi, Canela"
                  className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#7A6F64] mb-1">Descripción / Recuerdo</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles del momento..."
                  className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C] h-16"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E4D8C8]">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-3.5 py-2 text-xs text-[#7A6F64] hover:text-[#3C342C] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!previewUrl}
                onClick={handleSavePhoto}
                className="px-5 py-2 text-xs font-bold text-[#FAF6F0] bg-[#489D6C] hover:bg-[#3D855B] disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Guardar en el Álbum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3C342C]/80 backdrop-blur-sm">
          <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col">
            <div className="relative aspect-16/10 bg-black">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#3C342C]">{lightboxPhoto.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-[#7A6F64] mt-0.5">
                    <span>{lightboxPhoto.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{lightboxPhoto.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(lightboxPhoto.id)}
                    className="p-2 rounded-xl border border-[#E4D8C8] bg-[#FAF6F0] hover:bg-[#F0E8DC] transition-colors"
                    title="Favorita"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        lightboxPhoto.isFavorite ? 'text-[#C86343] fill-[#C86343]' : 'text-[#7A6F64]'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(lightboxPhoto.id)}
                    className="p-2 rounded-xl border border-[#E4D8C8] bg-[#FAF6F0] hover:bg-[#FAEEE8] text-[#C86343] transition-colors"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {lightboxPhoto.description && (
                <p className="text-xs text-[#5C534A] leading-relaxed">
                  {lightboxPhoto.description}
                </p>
              )}

              {lightboxPhoto.taggedVillagers && lightboxPhoto.taggedVillagers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {lightboxPhoto.taggedVillagers.map((v) => (
                    <span
                      key={v}
                      className="text-xs text-[#489D6C] bg-[#E2F0E7] px-2.5 py-0.5 rounded-full font-medium"
                    >
                      @{v}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
