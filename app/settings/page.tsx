"use client";

import { useState } from "react";
import { Settings, Save, Key, Globe, Volume2, Database, Bot } from "lucide-react";

export default function SettingsPage() {
  const [config, setConfig] = useState({
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    voiceProvider: "polly",
    voiceName: "Joanna",
    language: "en-US",
    speechTimeout: "auto",
    maxCallDuration: "600",
    greetingMessage:
      "Salam! SmartTech Solutions-a xoş gəlmisiniz. Bugün sizə necə kömək edə bilərəm?",
    fallbackMessage:
      "Bağışlayın, başa düşmədim. Zəhmət olmasa təkrar edə bilərsiniz?",
    nlpProvider: "built-in",
    dialogflowProjectId: "",
    watsonApiKey: "",
    webhookUrl: "",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, save to a persistent store
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass =
    "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Parametrlər</h1>
        <p className="text-sm text-muted mt-1">
          Sİ səsli sistemi, inteqrasiyaları və davranışı konfiqurasiya edin
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Twilio Configuration */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-5">
            <Key className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Twilio Konfiqurasiyasi</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Hesab SID</label>
              <input
                type="password"
                className={inputClass}
                placeholder="AC..."
                value={config.twilioAccountSid}
                onChange={(e) => setConfig({ ...config, twilioAccountSid: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Kimlik Tokeni</label>
              <input
                type="password"
                className={inputClass}
                placeholder="Kimlik tokeniniz"
                value={config.twilioAuthToken}
                onChange={(e) => setConfig({ ...config, twilioAuthToken: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Telefon Nömrəsi</label>
              <input
                type="text"
                className={inputClass}
                placeholder="+1234567890"
                value={config.twilioPhoneNumber}
                onChange={(e) => setConfig({ ...config, twilioPhoneNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Webhook URL</label>
              <input
                type="text"
                className={inputClass}
                placeholder="https://your-domain.com/api/twilio/voice"
                value={config.webhookUrl}
                onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-5">
            <Volume2 className="w-4 h-4 text-accent" />
            <h3 className="font-semibold">Səs və Dil</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Səs Provayderi</label>
              <select
                className={inputClass}
                value={config.voiceProvider}
                onChange={(e) => setConfig({ ...config, voiceProvider: e.target.value })}
              >
                <option value="polly">Amazon Polly</option>
                <option value="google">Google TTS</option>
                <option value="azure">Azure Speech</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Səs Adı</label>
              <select
                className={inputClass}
                value={config.voiceName}
                onChange={(e) => setConfig({ ...config, voiceName: e.target.value })}
              >
                <option value="Joanna">Joanna (Qadın)</option>
                <option value="Matthew">Matthew (Kişi)</option>
                <option value="Salli">Salli (Qadın)</option>
                <option value="Joey">Joey (Kişi)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Dil</label>
              <select
                className={inputClass}
                value={config.language}
                onChange={(e) => setConfig({ ...config, language: e.target.value })}
              >
                <option value="en-US">İngilis (ABŞ)</option>
                <option value="en-GB">İngilis (Böyük Britaniya)</option>
                <option value="es-ES">İspan</option>
                <option value="fr-FR">Fransız</option>
                <option value="de-DE">Alman</option>
                <option value="tr-TR">Türk</option>
                <option value="az-AZ">Azərbaycan</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Nitq Vaxtı</label>
              <select
                className={inputClass}
                value={config.speechTimeout}
                onChange={(e) => setConfig({ ...config, speechTimeout: e.target.value })}
              >
                <option value="auto">Avtomatik aşkarlama</option>
                <option value="3">3 saniyə</option>
                <option value="5">5 saniyə</option>
                <option value="10">10 saniyə</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Maks. Zəng Müdəti (saniyə)
              </label>
              <input
                type="number"
                className={inputClass}
                value={config.maxCallDuration}
                onChange={(e) => setConfig({ ...config, maxCallDuration: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* AI / NLP Configuration */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bot className="w-4 h-4 text-success" />
            <h3 className="font-semibold">Sİ və NLP Konfiqurasiyasi</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">NLP Provayderi</label>
              <select
                className={inputClass}
                value={config.nlpProvider}
                onChange={(e) => setConfig({ ...config, nlpProvider: e.target.value })}
              >
                <option value="built-in">Daxili NLP Mühərriki</option>
                <option value="dialogflow">Google Dialogflow</option>
                <option value="watson">IBM Watson</option>
                <option value="openai">OpenAI GPT</option>
              </select>
            </div>
            {config.nlpProvider === "dialogflow" && (
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">
                  Dialogflow Layihə ID
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="layihə-id-niz"
                  value={config.dialogflowProjectId}
                  onChange={(e) =>
                    setConfig({ ...config, dialogflowProjectId: e.target.value })
                  }
                />
              </div>
            )}
            {config.nlpProvider === "watson" && (
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">
                  Watson API Açarı
                </label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="Watson API açarınız"
                  value={config.watsonApiKey}
                  onChange={(e) => setConfig({ ...config, watsonApiKey: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>

        {/* Response Messages */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-4 h-4 text-warning" />
            <h3 className="font-semibold">Cavab Mesajları</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Salamı Mesajı
              </label>
              <textarea
                rows={2}
                className={`${inputClass} resize-none`}
                value={config.greetingMessage}
                onChange={(e) => setConfig({ ...config, greetingMessage: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Ehtiyat Mesajı
              </label>
              <textarea
                rows={2}
                className={`${inputClass} resize-none`}
                value={config.fallbackMessage}
                onChange={(e) => setConfig({ ...config, fallbackMessage: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <Save className="w-4 h-4" />
            Konfiqurasiyanı Yadda Saxla
          </button>
          {saved && (
            <span className="text-sm text-success font-medium">Konfiqurasiya yadda saxlanıldı!</span>
          )}
        </div>
      </form>
    </div>
  );
}
