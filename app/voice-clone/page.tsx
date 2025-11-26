"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ElevenLabsVoiceClone from "@/components/elevenlabs-voice-clone";
import { ClonedVoicesList } from "@/components/cloned-voices-list";
import { Button } from "@/components/ui/button";
import { Plus, List, Loader2 } from "lucide-react";
import { apiService } from "@/lib/api";

const VoiceClonePage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Load subscription to check if plan is active
  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) return;
      
      setIsLoadingSubscription(true);
      try {
        const subscriptionResult = await apiService.getSubscription({
          showToast: false,
          forceRefresh: false
        });
        
        if (subscriptionResult.success && subscriptionResult.data) {
          setSubscription(subscriptionResult.data);
        } else {
          setSubscription(null);
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
        setSubscription(null);
      } finally {
        setIsLoadingSubscription(false);
      }
    };
    
    loadSubscription();
  }, [user]);

  // Check if subscription is active and has voice clones available
  const hasActiveSubscription = subscription?.is_active === true;
  const remainingVoiceClones = subscription?.remaining_voice_clones ?? 0;
  const hasVoiceClonesAvailable = remainingVoiceClones > 0;
  const canCreateVoice = hasActiveSubscription && hasVoiceClonesAvailable && !isLoadingSubscription;

  // Show loading state while checking subscription
  if (isLoadingSubscription && user) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Voice Cloning
          </h1>
          <p className="text-gray-600">
            Manage your cloned voices and create new ones with ElevenLabs
          </p>
          {!isLoadingSubscription && subscription && hasActiveSubscription && (
            <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              <span className="text-blue-500">🎤</span>
              <span>Remaining Voice Clones: <strong>{remainingVoiceClones}</strong> / {subscription.voice_clones}</span>
            </div>
          )}
        </div>
        <Button
          onClick={() => canCreateVoice && setShowCreateForm(!showCreateForm)}
          disabled={!canCreateVoice}
          className="flex items-center gap-2"
        >
          {showCreateForm ? (
            <>
              <List className="h-4 w-4" />
              View All Voices
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Create New Voice
            </>
          )}
        </Button>
      </div>

      {/* Subscription Expired Alert */}
      {!isLoadingSubscription && !hasActiveSubscription && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-400 rounded-xl p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl animate-pulse">
                ⚠️
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-orange-900 mb-2">
                Subscription Expired
              </h3>
              <p className="text-orange-800">
                Your subscription plan has expired. You cannot create new cloned voices until you renew your subscription. 
                {subscription && (
                  <span className="block mt-2 text-sm">
                    <strong>Used Minutes:</strong> {subscription.used_minutes} / {subscription.total_minutes}
                  </span>
                )}
                <span className="block mt-3 text-sm font-semibold">
                  Please contact support to renew your subscription and continue using voice cloning features.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Voice Clones Available Alert */}
      {!isLoadingSubscription && hasActiveSubscription && !hasVoiceClonesAvailable && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-xl p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                🎤
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-900 mb-2">
                No Voice Clones Available
              </h3>
              <p className="text-blue-800">
                You have used all your available voice clones. You can still view and manage your existing cloned voices.
                {subscription && (
                  <span className="block mt-2 text-sm">
                    <strong>Remaining Voice Clones:</strong> {remainingVoiceClones} / {subscription.voice_clones}
                  </span>
                )}
                <span className="block mt-3 text-sm font-semibold">
                  Please contact support to upgrade your plan and get more voice clones.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {showCreateForm ? (
        <div className={`relative ${!canCreateVoice ? 'opacity-60' : ''}`}>
          {!canCreateVoice && (
            <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
                <div className="text-3xl mb-3">{!hasActiveSubscription ? '⚠️' : '🎤'}</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {!hasActiveSubscription ? 'Subscription Expired' : 'No Voice Clones Available'}
                </h3>
                <p className="text-sm text-gray-600">
                  {!hasActiveSubscription 
                    ? 'Your subscription plan has expired. Please contact support to renew your subscription and create new cloned voices.'
                    : 'You have used all your available voice clones. Please contact support to upgrade your plan.'
                  }
                </p>
              </div>
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Create New Cloned Voice
          </h2>
          <ElevenLabsVoiceClone 
            onSuccess={async () => {
              setShowCreateForm(false);
              // Refresh subscription to update remaining voice clones
              try {
                const subscriptionResult = await apiService.getSubscription({
                  showToast: false,
                  forceRefresh: true
                });
                if (subscriptionResult.success && subscriptionResult.data) {
                  setSubscription(subscriptionResult.data);
                }
              } catch (error) {
                console.error('Error refreshing subscription:', error);
              }
            }}
          />
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Cloned Voices
          </h2>
          <ClonedVoicesList
            showCreateButton={true}
            onCreateClick={() => canCreateVoice && setShowCreateForm(true)}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceClonePage;
