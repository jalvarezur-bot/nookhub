import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header, NavTab } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { PassportView } from './components/PassportView';
import { VillagersView } from './components/VillagersView';
import { CritterpediaView } from './components/CritterpediaView';
import { WikiView } from './components/WikiView';
import { CatalogView } from './components/CatalogView';
import { GalleryView } from './components/GalleryView';
import { OnboardingModal } from './components/OnboardingModal';
import { NotificationModal } from './components/NotificationModal';
import { ProjectKModal } from './components/ProjectKModal';
import { getStoredProjectKTasks, saveStoredProjectKTasks } from './data/projectK';
import { IslandPassport, ResidentState, GalleryPhoto, Villager } from './types';
import {
  getStoredPassport,
  saveStoredPassport,
  getStoredResidents,
  saveStoredResidents,
  getStoredCritterProgress,
  saveStoredCritterProgress,
  getStoredPhotos,
  saveStoredPhotos,
  getStoredDailyTasks,
  saveStoredDailyTasks,
  getHasCompletedOnboarding,
  setHasCompletedOnboarding
} from './utils/storage';
import { playSound } from './utils/audio';
import { auth, googleProvider, testConnection, User } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { fetchUserIslandData, saveUserIslandData, FullIslandData } from './services/islandSync';
import { Cloud, Check, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('inicio');
  const [passport, setPassport] = useState<IslandPassport>(getStoredPassport);
  const [residents, setResidents] = useState<ResidentState[]>(getStoredResidents);
  const [critterProgress, setCritterProgress] = useState(getStoredCritterProgress);
  const [photos, setPhotos] = useState<GalleryPhoto[]>(getStoredPhotos);
  const [dailyTasks, setDailyTasks] = useState(getStoredDailyTasks);
  const [projectKCompleted, setProjectKCompleted] = useState<string[]>(getStoredProjectKTasks);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Authentication & Cloud Sync
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !getHasCompletedOnboarding());
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProjectKOpen, setIsProjectKOpen] = useState(false);
  const [selectedVillagerForWiki, setSelectedVillagerForWiki] = useState<Villager | null>(null);

  const initialLoadDone = useRef(false);

  // Test connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setSyncToast({ message, type });
    const timer = setTimeout(() => {
      setSyncToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Assemble current full island data
  const getFullIslandState = useCallback((): FullIslandData => {
    return {
      passport,
      residents,
      critters: critterProgress,
      photos,
      dailyTasks,
      projectKCompleted,
      hasCompletedOnboarding: getHasCompletedOnboarding(),
      version: 1
    };
  }, [passport, residents, critterProgress, photos, dailyTasks, projectKCompleted]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          const cloudData = await fetchUserIslandData(user.uid);
          if (cloudData) {
            // Cloud data found - sync down to local state
            if (cloudData.passport) {
              setPassport(cloudData.passport);
              saveStoredPassport(cloudData.passport);
            }
            if (cloudData.residents) {
              setResidents(cloudData.residents);
              saveStoredResidents(cloudData.residents);
            }
            if (cloudData.critters) {
              setCritterProgress(cloudData.critters);
              saveStoredCritterProgress(cloudData.critters.caught, cloudData.critters.donated);
            }
            if (cloudData.photos) {
              setPhotos(cloudData.photos);
              saveStoredPhotos(cloudData.photos);
            }
            if (cloudData.dailyTasks) {
              setDailyTasks(cloudData.dailyTasks);
              saveStoredDailyTasks(cloudData.dailyTasks);
            }
            if (cloudData.projectKCompleted) {
              setProjectKCompleted(cloudData.projectKCompleted);
              saveStoredProjectKTasks(cloudData.projectKCompleted);
            }
            if (cloudData.hasCompletedOnboarding !== undefined) {
              setHasCompletedOnboarding(cloudData.hasCompletedOnboarding);
              setIsOnboardingOpen(!cloudData.hasCompletedOnboarding);
            }
            setLastSyncTime(new Date());
            showToast(`¡Bienvenido! Datos de "${cloudData.passport?.islandName || 'tu isla'}" cargados desde la nube.`, 'success');
          } else {
            // First time cloud user - push local state to cloud as backup
            const currentState = getFullIslandState();
            await saveUserIslandData(
              user.uid,
              user.email || '',
              user.displayName,
              user.photoURL,
              currentState,
              true
            );
            setLastSyncTime(new Date());
            showToast('¡Cuenta conectada! Tu isla se ha guardado en la nube de Google.', 'success');
          }
        } catch (err) {
          console.error('Error sincronizando con la nube:', err);
          showToast('No se pudieron descargar los datos de la nube. Usando datos locales.', 'info');
        } finally {
          setIsSyncing(false);
          initialLoadDone.current = true;
        }
      } else {
        initialLoadDone.current = true;
      }
    });

    return () => unsubscribe();
  }, [getFullIslandState, showToast]);

  // Auto-sync changes to cloud when authenticated
  const syncToCloud = useCallback(async (customData?: FullIslandData) => {
    if (!currentUser || !initialLoadDone.current) return;
    setIsSyncing(true);
    try {
      const dataToSave = customData || getFullIslandState();
      await saveUserIslandData(
        currentUser.uid,
        currentUser.email || '',
        currentUser.displayName,
        currentUser.photoURL,
        dataToSave,
        false
      );
      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Error guardando en la nube:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser, getFullIslandState]);

  // Google Sign-In handler
  const handleSignInGoogle = async () => {
    try {
      setIsSyncing(true);
      await signInWithPopup(auth, googleProvider);
      if (soundEnabled) playSound('fanfare');
    } catch (err: unknown) {
      console.error('Error en autenticación con Google:', err);
      setIsSyncing(false);
      showToast('No se pudo completar el inicio de sesión con Google.', 'error');
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      if (soundEnabled) playSound('pop');
      showToast('Has cerrado sesión. Tus datos continúan guardados localmente.', 'info');
    } catch (err) {
      console.error('Error cerrando sesión:', err);
    }
  };

  // Manual cloud sync
  const handleManualSync = async () => {
    if (!currentUser) {
      handleSignInGoogle();
      return;
    }
    await syncToCloud();
    showToast('¡Datos de la isla sincronizados correctamente con Google Cloud!', 'success');
  };

  // Sync state to local storage & cloud
  const handleUpdatePassport = (updated: IslandPassport) => {
    setPassport(updated);
    saveStoredPassport(updated);
    if (currentUser) {
      syncToCloud({ ...getFullIslandState(), passport: updated });
    }
  };

  const handleUpdateResidents = (updated: ResidentState[]) => {
    setResidents(updated);
    saveStoredResidents(updated);
    if (currentUser) {
      syncToCloud({ ...getFullIslandState(), residents: updated });
    }
  };

  const handleToggleCaught = (critterId: string) => {
    const isCaught = critterProgress.caught.includes(critterId);
    const updatedCaught = isCaught
      ? critterProgress.caught.filter((id) => id !== critterId)
      : [...critterProgress.caught, critterId];

    const updated = { ...critterProgress, caught: updatedCaught };
    setCritterProgress(updated);
    saveStoredCritterProgress(updated.caught, updated.donated);
    if (currentUser) {
      syncToCloud({ ...getFullIslandState(), critters: updated });
    }
  };

  const handleToggleDonated = (critterId: string) => {
    const isDonated = critterProgress.donated.includes(critterId);
    const updatedDonated = isDonated
      ? critterProgress.donated.filter((id) => id !== critterId)
      : [...critterProgress.donated, critterId];

    const updatedCaught = critterProgress.caught.includes(critterId)
      ? critterProgress.caught
      : [...critterProgress.caught, critterId];

    const updated = { caught: updatedCaught, donated: updatedDonated };
    setCritterProgress(updated);
    saveStoredCritterProgress(updated.caught, updated.donated);
    if (currentUser) {
      syncToCloud({ ...getFullIslandState(), critters: updated });
    }
  };

  const handleUpdatePhotos = (updated: GalleryPhoto[]) => {
    setPhotos(updated);
    saveStoredPhotos(updated);
    if (currentUser) {
      syncToCloud({ ...getFullIslandState(), photos: updated });
    }
  };

  const handleToggleDailyTask = (id: string) => {
    const updated = dailyTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setDailyTasks(updated);
    saveStoredDailyTasks(updated);
    if (currentUser) {
      syncToCloud({ ...getFullIslandState(), dailyTasks: updated });
    }
  };

  const handleToggleProjectKTask = (taskId: string) => {
    const isDone = projectKCompleted.includes(taskId);
    const updated = isDone
      ? projectKCompleted.filter((id) => id !== taskId)
      : [...projectKCompleted, taskId];

    setProjectKCompleted(updated);
    saveStoredProjectKTasks(updated);
    if (currentUser) {
      syncToCloud({ ...getFullIslandState(), projectKCompleted: updated });
    }
  };

  const handleOnboardingComplete = (updatedPassport: IslandPassport, initialResidents?: ResidentState[]) => {
    handleUpdatePassport(updatedPassport);
    if (initialResidents && initialResidents.length > 0) {
      handleUpdateResidents(initialResidents);
    }
    setHasCompletedOnboarding(true);
    setIsOnboardingOpen(false);

    if (currentUser) {
      syncToCloud({
        ...getFullIslandState(),
        passport: updatedPassport,
        residents: initialResidents && initialResidents.length > 0 ? initialResidents : residents,
        hasCompletedOnboarding: true
      });
    }
  };

  const handleOpenWikiDetail = (villager: Villager) => {
    setSelectedVillagerForWiki(villager);
    setActiveTab('wiki');
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB] text-[#3C342C] flex flex-col selection:bg-[#489D6C]/20 selection:text-[#3C342C]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProjectK={() => setIsProjectKOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        hasNotificationsBadge={true}
        onReplayTutorial={() => setIsOnboardingOpen(true)}
        currentUser={currentUser}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        onSignInGoogle={handleSignInGoogle}
        onSignOut={handleSignOut}
        onManualSync={handleManualSync}
      />

      {/* Cloud Sync Toast Notification */}
      {syncToast && (
        <aside
          aria-label="Notificación de sincronización"
          className="fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#E4D8C8] shadow-lg text-xs font-medium text-[#3C342C] animate-fade-in transition-all"
        >
          {syncToast.type === 'success' && <Check className="w-4 h-4 text-[#489D6C] shrink-0" />}
          {syncToast.type === 'info' && <Cloud className="w-4 h-4 text-[#2D7A8C] shrink-0" />}
          {syncToast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#C86343] shrink-0" />}
          <span>{syncToast.message}</span>
        </aside>
      )}

      {/* Main Tab Content - pb-20 on mobile/tablet so the bottom navigation doesn't overlap */}
      <main className="flex-1 pb-20 lg:pb-16 px-2 sm:px-4 md:px-6">
        {activeTab === 'inicio' && (
          <HomeDashboard
            passport={passport}
            residents={residents}
            dailyTasks={dailyTasks}
            onToggleDailyTask={handleToggleDailyTask}
            caughtList={critterProgress.caught}
            donatedList={critterProgress.donated}
            onToggleCaught={handleToggleCaught}
            onNavigateTab={setActiveTab}
            onOpenWikiDetail={handleOpenWikiDetail}
            soundEnabled={soundEnabled}
            projectKCompleted={projectKCompleted}
            onOpenProjectK={() => setIsProjectKOpen(true)}
          />
        )}

        {activeTab === 'pasaporte' && (
          <PassportView
            passport={passport}
            onUpdatePassport={handleUpdatePassport}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'vecinos' && (
          <VillagersView
            residents={residents}
            onUpdateResidents={handleUpdateResidents}
            soundEnabled={soundEnabled}
            onOpenWikiDetail={handleOpenWikiDetail}
          />
        )}

        {activeTab === 'capturopedia' && (
          <CritterpediaView
            caughtList={critterProgress.caught}
            donatedList={critterProgress.donated}
            onToggleCaught={handleToggleCaught}
            onToggleDonated={handleToggleDonated}
            userHemisphere={passport.hemisphere}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'wiki' && (
          <WikiView
            soundEnabled={soundEnabled}
            selectedVillagerFromProp={selectedVillagerForWiki}
            onClearPropSelection={() => setSelectedVillagerForWiki(null)}
          />
        )}

        {activeTab === 'catalogo' && (
          <CatalogView soundEnabled={soundEnabled} />
        )}

        {activeTab === 'galeria' && (
          <GalleryView
            photos={photos}
            onUpdatePhotos={handleUpdatePhotos}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* Mobile & Tablet Dedicated Bottom Navigation Dock */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
      />

      {/* Interactive Onboarding Tutorial Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        currentPassport={passport}
        soundEnabled={soundEnabled}
      />

      {/* Notifications & Events Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        residents={residents}
        onOpenWikiDetail={handleOpenWikiDetail}
      />

      {/* Project K (Totakeke / K.K. Slider) Official Tasks Modal */}
      <ProjectKModal
        isOpen={isProjectKOpen}
        onClose={() => setIsProjectKOpen(false)}
        completedTasks={projectKCompleted}
        onToggleTask={handleToggleProjectKTask}
        soundEnabled={soundEnabled}
      />

      {/* Cozy Footer */}
      <footer className="border-t border-[#E4D8C8] bg-[#FAF6F0] py-6 px-4 text-center text-xs text-[#7A6F64] mb-14 lg:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            NookHub · Asistente Oficial Insular para Animal Crossing: New Horizons
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Hemisferio {passport.hemisphere}</span>
            <span aria-hidden="true">·</span>
            <span>{passport.islandName}</span>
            <span aria-hidden="true">·</span>
            <span>Rep. {passport.islandRep}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
