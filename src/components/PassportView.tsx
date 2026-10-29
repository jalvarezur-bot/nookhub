import React, { useState, useRef } from 'react';
import { IslandPassport } from '../types';
import { playSound } from '../utils/audio';
import { Sparkles, Camera, Award, Star, Compass, Download, Printer, Check, Palette } from 'lucide-react';

interface PassportViewProps {
  passport: IslandPassport;
  onUpdatePassport: (updated: IslandPassport) => void;
  soundEnabled: boolean;
}

export const PassportView: React.FC<PassportViewProps> = ({
  passport,
  onUpdatePassport,
  soundEnabled
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<IslandPassport>(passport);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const FIRST_TITLES = [
    'Isleño', 'Pescador', 'Cazador', 'Coleccionista', 'Explorador',
    'Soñador', 'Florista', 'Jardinero', 'Gourmet', 'Músico', 'Comerciante'
  ];

  const SECOND_TITLES = [
    'Soñador', 'Insular', 'Novedoso', 'Legendario', 'Madrugador',
    'Nocturno', 'Aventurero', 'Entusiasta', 'Experto', 'Tranquilo', 'Feliz'
  ];

  const AVAILABLE_STAMPS = [
    { id: '5 Estrellas', label: 'Isla de 5 Estrellas', icon: '⭐' },
    { id: 'Concierto de K.K.', label: 'Concierto de Totakeke', icon: '🎸' },
    { id: 'Museo Activo', label: 'Museo de Sócrates', icon: '🏛️' },
    { id: 'Pescador Maestro', label: 'Maestro Pescador', icon: '🎣' },
    { id: 'Cazador Experto', label: 'Cazador de Bichos', icon: '🦋' },
    { id: 'Buceador Marino', label: 'Buceador de Pascal', icon: '🤿' },
    { id: 'Amigo de los Aldeanos', label: 'Corazón Insular', icon: '💖' },
    { id: 'Millonario de Bayas', label: 'Magnate de Bayas', icon: '💰' }
  ];

  const themeStyles = {
    beige: {
      bg: 'bg-[#FAF6F0]',
      card: 'bg-[#FCFAF6]',
      border: 'border-[#E4D8C8]',
      accent: 'text-[#489D6C]',
      badge: 'bg-[#E2F0E7] text-[#489D6C]'
    },
    green: {
      bg: 'bg-[#EAF3EC]',
      card: 'bg-[#F4FAF6]',
      border: 'border-[#BDDCB8]',
      accent: 'text-[#3B8058]',
      badge: 'bg-[#3B8058] text-[#FAF6F0]'
    },
    teal: {
      bg: 'bg-[#EBF5F7]',
      card: 'bg-[#F4FAFB]',
      border: 'border-[#B8DCE3]',
      accent: 'text-[#2D7A8C]',
      badge: 'bg-[#2D7A8C] text-[#FAF6F0]'
    },
    terracotta: {
      bg: 'bg-[#FAEEE8]',
      card: 'bg-[#FCF6F2]',
      border: 'border-[#E3C2B4]',
      accent: 'text-[#B05234]',
      badge: 'bg-[#B05234] text-[#FAF6F0]'
    },
    wood: {
      bg: 'bg-[#F2ECE4]',
      card: 'bg-[#F8F4EE]',
      border: 'border-[#D4C4B2]',
      accent: 'text-[#6D4B2D]',
      badge: 'bg-[#6D4B2D] text-[#FAF6F0]'
    }
  };

  const currentTheme = themeStyles[passport.themeColor] || themeStyles.beige;

  const handleSave = () => {
    if (soundEnabled) playSound('stamp');
    onUpdatePassport(tempData);
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setTempData({ ...tempData, avatarUrl: reader.result });
          if (soundEnabled) playSound('pop');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleStamp = (stampId: string) => {
    if (soundEnabled) playSound('pop');
    const stamps = tempData.stamps.includes(stampId)
      ? tempData.stamps.filter((s) => s !== stampId)
      : [...tempData.stamps, stampId];
    setTempData({ ...tempData, stamps });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4D8C8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3C342C]">Pasaporte Insular</h1>
          <p className="text-xs text-[#7A6F64] mt-1">
            Tu identificación oficial emitida por Nook Inc. para viajar entre islas y recibir visitantes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (soundEnabled) playSound('pop');
              setIsEditing(!isEditing);
              setTempData(passport);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-[#E4D8C8] bg-[#FAF6F0] hover:bg-[#F0E8DC] text-[#3C342C] transition-colors cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-[#489D6C]" />
            <span>{isEditing ? 'Cancelar edición' : 'Personalizar Pasaporte'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-[#E4D8C8] bg-[#FAF6F0] hover:bg-[#F0E8DC] text-[#7A6F64] hover:text-[#3C342C] transition-colors cursor-pointer"
            title="Imprimir o guardar como PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* THE PASSPORT CARD (Physical styled passport layout) */}
      <div className="flex justify-center">
        <div
          className={`w-full max-w-2xl rounded-2xl border-2 ${currentTheme.border} ${currentTheme.card} shadow-sm overflow-hidden p-6 sm:p-8 space-y-6 relative transition-colors`}
          style={{
            backgroundImage: `radial-gradient(circle at 100% 0%, rgba(200, 180, 150, 0.08) 0%, transparent 60%)`
          }}
        >
          {/* Passport Header Strip */}
          <div className="flex items-center justify-between border-b border-[#E4D8C8]/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#489D6C] text-[#FAF6F0] flex items-center justify-center font-bold text-sm shadow-xs">
                N
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6F64]">
                  Plan de Asentamiento en Islas Desiertas
                </p>
                <h2 className="text-xl font-bold tracking-tight text-[#3C342C] flex items-center gap-2">
                  <span>{passport.islandName}</span>
                  <span className="text-xs font-normal text-[#7A6F64]">· Hemisferio {passport.hemisphere}</span>
                </h2>
              </div>
            </div>

            {/* Star Rating Badge */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#E4D8C8]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < passport.starRating ? 'text-[#E6B84A] fill-[#E6B84A]' : 'text-[#D2C4B1]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main Passport Content: Avatar + Information Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Avatar Photo Frame */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-32 h-36 rounded-xl border-2 border-[#D2C4B1] bg-[#FAF6F0] shadow-inner overflow-hidden relative flex items-center justify-center p-1">
                {passport.avatarUrl ? (
                  <img
                    src={passport.avatarUrl}
                    alt={passport.islandRep}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F0E8DC] rounded-lg flex flex-col items-center justify-center text-[#7A6F64] p-3 text-center">
                    <Camera className="w-7 h-7 mb-1 text-[#A89C8F]" />
                    <span className="text-[10px] font-medium leading-tight">Foto del Representante</span>
                  </div>
                )}
              </div>
              <span className="text-[11px] font-semibold text-[#7A6F64] mt-2 tracking-wide uppercase">
                Foto Oficial
              </span>
            </div>

            {/* Passport Identity Metadata */}
            <div className="sm:col-span-2 space-y-3.5 text-xs text-[#3C342C]">
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#7A6F64]">
                  Representante Insular
                </span>
                <p className="text-base font-bold text-[#3C342C]">{passport.islandRep}</p>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#7A6F64]">
                  Título Insular
                </span>
                <p className="font-semibold text-[#489D6C] text-sm">
                  {passport.titleFirst} {passport.titleSecond}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#E4D8C8]/60">
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-[#7A6F64]">
                    Fruta Nativa
                  </span>
                  <p className="font-medium text-[#3C342C]">{passport.nativeFruit}</p>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-[#7A6F64]">
                    Flor Nativa
                  </span>
                  <p className="font-medium text-[#3C342C]">{passport.nativeFlower}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#E4D8C8]/60">
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-[#7A6F64]">
                    Dirección del Sueño (DA)
                  </span>
                  <p className="font-mono text-[11px] font-medium text-[#5C534A]">
                    {passport.dreamAddress || 'No configurado'}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-[#7A6F64]">
                    Código de Creador (MA)
                  </span>
                  <p className="font-mono text-[11px] font-medium text-[#5C534A]">
                    {passport.creatorCode || 'No configurado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Island Motto / Personal Quote */}
          <div className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8]/80 text-xs italic text-[#5C534A] flex items-center justify-between">
            <p>"{passport.motto}"</p>
            <span className="text-[10px] text-[#7A6F64] not-italic ml-4 shrink-0">
              Fundada: {passport.foundedDate}
            </span>
          </div>

          {/* Passport Stamps Collection */}
          <div className="pt-2 border-t border-[#E4D8C8]/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6F64]">
                Sellos de Logros Insulares
              </span>
              <span className="text-[10px] font-medium text-[#7A6F64] tabular-nums">
                {passport.stamps.length} Sellos estampados
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {passport.stamps.map((stampId) => {
                const stampObj = AVAILABLE_STAMPS.find((s) => s.id === stampId);
                return (
                  <span
                    key={stampId}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF6F0] border border-[#E4D8C8] text-[#3C342C]"
                  >
                    <span>{stampObj?.icon || '🔖'}</span>
                    <span>{stampObj?.label || stampId}</span>
                  </span>
                );
              })}
              {passport.stamps.length === 0 && (
                <span className="text-xs text-[#7A6F64] italic">
                  Ningún sello seleccionado aún.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOMIZATION DRAWER / FORM */}
      {isEditing && (
        <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4D8C8]">
            <h3 className="text-base font-bold text-[#3C342C]">Personalización del Pasaporte</h3>
            <span className="text-xs text-[#7A6F64]">Los cambios se reflejan inmediatamente</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Rep Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1">
                Nombre del Representante
              </label>
              <input
                type="text"
                value={tempData.islandRep}
                onChange={(e) => setTempData({ ...tempData, islandRep: e.target.value })}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-semibold text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
              />
            </div>

            {/* Island Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1">
                Nombre de la Isla
              </label>
              <input
                type="text"
                value={tempData.islandName}
                onChange={(e) => setTempData({ ...tempData, islandName: e.target.value })}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-semibold text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
              />
            </div>

            {/* Title Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1">
                Título Parte 1
              </label>
              <select
                value={tempData.titleFirst}
                onChange={(e) => setTempData({ ...tempData, titleFirst: e.target.value })}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-medium text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
              >
                {FIRST_TITLES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1">
                Título Parte 2
              </label>
              <select
                value={tempData.titleSecond}
                onChange={(e) => setTempData({ ...tempData, titleSecond: e.target.value })}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-medium text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
              >
                {SECOND_TITLES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Dream Address & Creator Code */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1">
                Dirección del Sueño (DA)
              </label>
              <input
                type="text"
                value={tempData.dreamAddress}
                placeholder="DA-XXXX-XXXX-XXXX"
                onChange={(e) => setTempData({ ...tempData, dreamAddress: e.target.value })}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-mono text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1">
                Código de Creador (MA)
              </label>
              <input
                type="text"
                value={tempData.creatorCode}
                placeholder="MA-XXXX-XXXX-XXXX"
                onChange={(e) => setTempData({ ...tempData, creatorCode: e.target.value })}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-mono text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
              />
            </div>

            {/* Star Rating & Theme Color */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1">
                Calificación de la Isla ({tempData.starRating} Estrellas)
              </label>
              <div className="flex items-center gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setTempData({ ...tempData, starRating: stars })}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                      tempData.starRating === stars
                        ? 'bg-[#E6B84A] text-[#FAF6F0] border-[#E6B84A]'
                        : 'bg-[#FCFAF6] border-[#E4D8C8] text-[#5C534A]'
                    }`}
                  >
                    {stars} ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1">
                Estilo de Color del Pasaporte
              </label>
              <div className="flex items-center gap-2 mt-1">
                {(['beige', 'green', 'teal', 'terracotta', 'wood'] as const).map((colorKey) => (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setTempData({ ...tempData, themeColor: colorKey })}
                    className={`px-3 py-1.5 rounded-lg border text-xs capitalize cursor-pointer transition-colors ${
                      tempData.themeColor === colorKey
                        ? 'bg-[#3C342C] text-[#FAF6F0] font-semibold border-[#3C342C]'
                        : 'bg-[#FCFAF6] border-[#E4D8C8] text-[#7A6F64]'
                    }`}
                  >
                    {colorKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Motto */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1">
                Lema o Cita Insular
              </label>
              <input
                type="text"
                value={tempData.motto}
                onChange={(e) => setTempData({ ...tempData, motto: e.target.value })}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-medium text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
              />
            </div>

            {/* Photo Upload */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-1">
                Subir Foto para el Pasaporte
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E4D8C8] bg-[#FCFAF6] hover:bg-[#F0E8DC] text-xs font-medium text-[#3C342C] transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Seleccionar imagen de mi dispositivo</span>
                </button>
                {tempData.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setTempData({ ...tempData, avatarUrl: '' })}
                    className="text-xs text-[#C86343] hover:underline"
                  >
                    Eliminar foto
                  </button>
                )}
              </div>
            </div>

            {/* Stamps selector */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6F64] mb-2">
                Sellos Insulares Coleccionados
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AVAILABLE_STAMPS.map((s) => {
                  const isSelected = tempData.stamps.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleStamp(s.id)}
                      className={`p-2.5 rounded-xl border text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#E2F0E7] border-[#489D6C] text-[#3C342C] font-semibold'
                          : 'bg-[#FCFAF6] border-[#E4D8C8] text-[#7A6F64]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{s.icon}</span>
                        <span className="truncate">{s.label}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#489D6C] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E4D8C8]">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setTempData(passport);
              }}
              className="px-4 py-2 text-xs font-semibold text-[#7A6F64] hover:text-[#3C342C] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 text-xs font-bold text-[#FAF6F0] bg-[#489D6C] hover:bg-[#3D855B] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
