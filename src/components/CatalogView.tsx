import React, { useState } from 'react';
import { ARTWORKS_DATA, FURNITURE_HIGHLIGHTS, KK_SONGS } from '../data/catalog';
import { playSound } from '../utils/audio';
import { Search, Sparkles, ShieldCheck, AlertCircle, Music, Hammer, Check } from 'lucide-react';

interface CatalogViewProps {
  soundEnabled: boolean;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ soundEnabled }) => {
  const [activeTab, setActiveTab] = useState<'art' | 'furniture' | 'music'>('art');
  const [searchQuery, setSearchQuery] = useState('');
  const [artFilter, setArtFilter] = useState<'all' | 'hasFake' | 'alwaysReal'>('all');
  const [collectedItems, setCollectedItems] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('acnh_catalog_collected');
      return saved ? JSON.parse(saved) : ['dynamic_painting', 'ironwood_kitchenette'];
    } catch {
      return ['dynamic_painting'];
    }
  });

  const toggleCollected = (id: string) => {
    if (soundEnabled) playSound('bell');
    const updated = collectedItems.includes(id)
      ? collectedItems.filter((i) => i !== id)
      : [...collectedItems, id];
    setCollectedItems(updated);
    try {
      localStorage.setItem('acnh_catalog_collected', JSON.stringify(updated));
    } catch {}
  };

  const filteredArt = ARTWORKS_DATA.filter((art) => {
    const matchesSearch =
      art.nameSpanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.realName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (artFilter === 'hasFake' && !art.hasFake) return false;
    if (artFilter === 'alwaysReal' && art.hasFake) return false;
    return true;
  });

  const filteredFurniture = FURNITURE_HIGHLIGHTS.filter((f) => {
    return (
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredSongs = KK_SONGS.filter((s) => {
    return (
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mood.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4D8C8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3C342C]">Guía de Catálogo, Arte y Música</h1>
          <p className="text-xs text-[#7A6F64] mt-1">
            Guía de autenticidad de Ladino, series de muebles icónicas y discografía de Totakeke (K.K. Slider).
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF6F0] border border-[#E4D8C8] rounded-xl">
          <button
            onClick={() => {
              if (soundEnabled) playSound('pop');
              setActiveTab('art');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'art'
                ? 'bg-[#C86343] text-[#FAF6F0] shadow-xs'
                : 'text-[#7A6F64] hover:text-[#3C342C]'
            }`}
          >
            🎨 Guía de Arte de Ladino
          </button>
          <button
            onClick={() => {
              if (soundEnabled) playSound('pop');
              setActiveTab('furniture');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'furniture'
                ? 'bg-[#489D6C] text-[#FAF6F0] shadow-xs'
                : 'text-[#7A6F64] hover:text-[#3C342C]'
            }`}
          >
            🛋️ Muebles & Recetas DIY
          </button>
          <button
            onClick={() => {
              if (soundEnabled) playSound('pop');
              setActiveTab('music');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'music'
                ? 'bg-[#3E8F9F] text-[#FAF6F0] shadow-xs'
                : 'text-[#7A6F64] hover:text-[#3C342C]'
            }`}
          >
            🎸 Canciones de Totakeke
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-[#FAF6F0] border border-[#E4D8C8] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7A6F64] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, artista o serie..."
            className="w-full pl-9 pr-4 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
          />
        </div>

        {activeTab === 'art' && (
          <div className="flex items-center gap-2">
            <select
              value={artFilter}
              onChange={(e) => setArtFilter(e.target.value as typeof artFilter)}
              className="px-3 py-2 bg-[#FCFAF6] border border-[#E4D8C8] rounded-xl text-xs font-medium text-[#3C342C] focus:outline-hidden focus:border-[#489D6C]"
            >
              <option value="all">Todas las obras</option>
              <option value="hasFake">Obras con falsificaciones</option>
              <option value="alwaysReal">Obras siempre auténticas</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: ARTWORKS GUIDE */}
      {activeTab === 'art' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl text-xs leading-relaxed text-[#5C534A] flex items-start gap-3">
            <span className="text-xl">🦊</span>
            <div>
              <p className="font-semibold text-[#3C342C]">¿Cómo comprar en el Navío de Ladino?</p>
              <p className="text-[#7A6F64] mt-0.5">
                Ladino atraca en la playa secreta norte de tu isla. Solo vende una obra por cliente al día. Sócrates no aceptará donaciones falsas para el museo, así que utiliza esta guía para identificar el ejemplar auténtico.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArt.map((art) => {
              const isCollected = collectedItems.includes(art.id);
              return (
                <div
                  key={art.id}
                  className="bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl p-5 shadow-xs space-y-3 hover:border-[#D2C4B1] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#3C342C]">{art.nameSpanish}</h3>
                        {art.hasFake ? (
                          <span className="text-[10px] font-semibold text-[#C86343] bg-[#FAEEE8] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Falsificable
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-[#489D6C] bg-[#E2F0E7] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Siempre Auténtica
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#7A6F64] mt-0.5">
                        Obra real: <strong className="text-[#3C342C]">{art.realName}</strong> ({art.author})
                      </p>
                    </div>

                    <button
                      onClick={() => toggleCollected(art.id)}
                      title={isCollected ? 'En mi museo' : 'Marcar como donada al museo'}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        isCollected
                          ? 'bg-[#489D6C] border-[#489D6C] text-[#FAF6F0]'
                          : 'bg-[#FAF6F0] border-[#E4D8C8] text-[#7A6F64] hover:text-[#3C342C]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isCollected ? 'En Museo' : 'Registrar'}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8]/80 text-xs text-[#5C534A]">
                    <span className="text-[10px] uppercase font-bold text-[#7A6F64] block mb-1">
                      Pistas para detectar la falsificación de Ladino:
                    </span>
                    <p className="leading-relaxed">{art.fakeTell}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FURNITURE & DIY RECIPES */}
      {activeTab === 'furniture' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFurniture.map((item) => {
            const isCollected = collectedItems.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#489D6C] transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#489D6C] tracking-wider">
                        {item.series}
                      </span>
                      <h3 className="text-sm font-bold text-[#3C342C] mt-0.5">{item.name}</h3>
                      <p className="text-[11px] text-[#7A6F64]">{item.category}</p>
                    </div>

                    <button
                      onClick={() => toggleCollected(item.id)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        isCollected
                          ? 'bg-[#489D6C] border-[#489D6C] text-[#FAF6F0]'
                          : 'bg-[#FAF6F0] border-[#E4D8C8] text-[#A89C8F] hover:text-[#3C342C]'
                      }`}
                      title="Marcar como fabricado / coleccionado"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.diy && item.materials && (
                    <div className="mt-3 p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E4D8C8]/80 text-[11px] text-[#5C534A]">
                      <span className="font-bold text-[#3C342C] block text-[10px] uppercase">
                        Materiales de Bricolaje:
                      </span>
                      <p className="mt-0.5 text-[#7A6F64]">{item.materials}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E4D8C8]/60 text-xs">
                  <span className="text-[#7A6F64] text-[11px]">Valor de venta:</span>
                  <span className="font-bold text-[#3C342C] tabular-nums">
                    {item.price.toLocaleString()} bayas
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: TOTAKEKE SONGS */}
      {activeTab === 'music' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2B2621] to-[#3C342C] text-[#FAF6F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6B84A] text-[#2B2621] flex items-center justify-center font-bold shrink-0">
                <Music className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#FAF6F0]">Discografía Completa de Totakeke (K.K. Slider)</p>
                <p className="text-[#FAF6F0]/75 text-[11px] mt-0.5">
                  Una vez completes el <strong>Proyecto K</strong>, Totakeke tocará en la plaza cada sábado a partir de las 18:00 hrs y te regalará una copia de la canción que le solicites.
                </p>
              </div>
            </div>
            <div className="text-[11px] text-[#E6B84A] font-semibold bg-[#FAF6F0]/10 px-3 py-1.5 rounded-xl border border-[#FAF6F0]/15 shrink-0">
              Coleccionadas: {collectedItems.filter((i) => KK_SONGS.some((s) => s.id === i)).length} / {KK_SONGS.length}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSongs.map((song) => {
            const isCollected = collectedItems.includes(song.id);
            return (
              <div
                key={song.id}
                className="bg-[#FCFAF6] border border-[#E4D8C8] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#3E8F9F] transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#3E8F9F]/10 text-[#3E8F9F] flex items-center justify-center shrink-0">
                        <Music className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#3C342C]">{song.title}</h3>
                        <p className="text-[11px] text-[#7A6F64]">{song.mood}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCollected(song.id)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        isCollected
                          ? 'bg-[#3E8F9F] border-[#3E8F9F] text-[#FAF6F0]'
                          : 'bg-[#FAF6F0] border-[#E4D8C8] text-[#A89C8F] hover:text-[#3C342C]'
                      }`}
                      title="En mi gramófono"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-[#5C534A] mt-3 leading-relaxed">
                    {song.description}
                  </p>
                </div>

                {song.isSecret && (
                  <div className="p-2 bg-[#FAEEE8] rounded-xl text-[10px] font-semibold text-[#C86343]">
                    🔒 Canción Secreta: Pídela escribiendo exactamente su nombre.
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
};
