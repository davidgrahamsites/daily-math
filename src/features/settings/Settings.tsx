import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Check, X, Copy } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';

const API_KEY_STORAGE_KEY = 'openai_api_key';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    onApiKeySaved: () => void;
}

export const Settings = ({ isOpen, onClose, onApiKeySaved }: SettingsProps) => {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadSavedApiKey();
        }
    }, [isOpen]);

    const loadSavedApiKey = async () => {
        try {
            const { value } = await Preferences.get({ key: API_KEY_STORAGE_KEY });
            if (value) {
                setApiKey(value);
            }
        } catch (error) {
            console.error('Failed to load API key:', error);
        }
    };

    const handleSave = async () => {
        if (!apiKey.trim()) {
            alert('Please enter a valid API key');
            return;
        }

        setIsSaving(true);
        try {
            await Preferences.set({
                key: API_KEY_STORAGE_KEY,
                value: apiKey.trim()
            });

            onApiKeySaved();
            setSavedSuccess(true);

            setTimeout(() => {
                setSavedSuccess(false);
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Failed to save API key:', error);
            alert('Failed to save API key. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClear = async () => {
        try {
            await Preferences.remove({ key: API_KEY_STORAGE_KEY });
            setApiKey('');
            onApiKeySaved(); // Reload with mock data
        } catch (error) {
            console.error('Failed to clear API key:', error);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            // Fallback for iOS
            const textArea = document.createElement('textarea');
            textArea.value = apiKey;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-bg-card border border-text-secondary/20 rounded-2xl shadow-2xl w-[90%] max-w-md p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <SettingsIcon className="text-accent-primary" size={24} />
                        <h2 className="text-xl font-bold text-text-primary">Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-text-primary"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* API Key Section */}
                <div className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
                            <Key size={16} />
                            OpenAI API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showKey ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full px-4 py-3 pr-24 bg-black/20 border border-text-secondary/20 rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {apiKey && (
                                    <button
                                        onClick={handleCopy}
                                        className="text-text-secondary hover:text-text-primary transition-colors"
                                        title="Copy API Key"
                                    >
                                        {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="text-text-secondary hover:text-text-primary text-xs"
                                >
                                    {showKey ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-text-secondary mt-2">
                            Your API key is stored securely on your device and never shared.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || savedSuccess}
                            className="flex-1 py-3 bg-accent-primary text-white font-bold rounded-lg hover:bg-accent-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {savedSuccess ? (
                                <>
                                    <Check size={18} />
                                    Saved!
                                </>
                            ) : isSaving ? (
                                'Saving...'
                            ) : (
                                'Save API Key'
                            )}
                        </button>
                        {apiKey && (
                            <button
                                onClick={handleClear}
                                className="px-4 py-3 bg-error/20 text-error font-bold rounded-lg hover:bg-error/30 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Help Text */}
                    <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-xs text-text-secondary">
                            <strong className="text-text-primary">Don't have an API key?</strong><br />
                            Get one from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-accent-primary underline">OpenAI Platform</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const getStoredApiKey = async (): Promise<string | null> => {
    try {
        const { value } = await Preferences.get({ key: API_KEY_STORAGE_KEY });
        return value;
    } catch (error) {
        console.error('Failed to retrieve API key:', error);
        return null;
    }
};
