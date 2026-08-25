import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  X,
  Globe,
  Plus,
  Coins,
  Search,
  Eye,
  Shield,
  Check,
  Sparkles,
} from 'lucide-react';
import { RiskLevel, DisplayMode, CurrencyInfo, CustomLanguage } from '../types';
import {
  BUILT_IN_LANGUAGES,
  TranslationDict,
  LanguageCode,
} from '../utils/translations';
import { POPULAR_CURRENCIES, findCurrencies } from '../utils/currencies';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onChangeLanguage: (code: string) => void;
  customLanguages: Record<string, CustomLanguage>;
  onAddCustomLanguage: (lang: CustomLanguage) => void;
  currentCurrency: CurrencyInfo;
  onChangeCurrency: (currency: CurrencyInfo) => void;
  displayMode: DisplayMode;
  onChangeDisplayMode: (mode: DisplayMode) => void;
  riskLevel: RiskLevel;
  onChangeRiskLevel: (level: RiskLevel) => void;
  t: TranslationDict;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onChangeLanguage,
  customLanguages,
  onAddCustomLanguage,
  currentCurrency,
  onChangeCurrency,
  displayMode,
  onChangeDisplayMode,
  riskLevel,
  onChangeRiskLevel,
  t,
}) => {
  const [currencySearch, setCurrencySearch] = useState('');
  const [showAddLanguageForm, setShowAddLanguageForm] = useState(false);
  const [newLangName, setNewLangName] = useState('');
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('🌐');

  if (!isOpen) return null;

  const matchedCurrencies = findCurrencies(currencySearch);

  const handleAddLanguageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim() || !newLangCode.trim()) return;

    const code = newLangCode.trim().toLowerCase();
    const name = newLangName.trim();

    // Create custom language dictionary with personalized translations
    const customDict: Partial<TranslationDict> = {
      appTitle: `${name.toUpperCase()} STOCK PREDICTOR`,
      appSubtitle: `${name} Quantitative Neural Prediction Engine`,
      bullish: `${name} Bullish`,
      bearish: `${name} Bearish`,
      probRising: `Probability of Rising (${name})`,
      probDipping: `Probability of Dipping (${name})`,
      targetTomorrow: `Target Tomorrow (${name})`,
      testPrediction1000: `Test with $1,000 (${name})`,
    };

    onAddCustomLanguage({
      code,
      name,
      flag: newLangFlag || '🌐',
      translations: customDict,
    });

    onChangeLanguage(code);
    setNewLangName('');
    setNewLangCode('');
    setShowAddLanguageForm(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0e1628] border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wide text-slate-100">
                {t.settings}
              </h2>
              <p className="text-xs text-slate-400">{t.systemPreferences}</p>
            </div>
          </div>
          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 1. Language Section */}
          <div className="p-4 rounded-2xl bg-[#09101d] border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase text-slate-200">
                  {t.language}
                </h3>
              </div>
              <button
                id="btn-toggle-add-language"
                onClick={() => setShowAddLanguageForm(!showAddLanguageForm)}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addLanguage}</span>
              </button>
            </div>

            {/* Language Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(BUILT_IN_LANGUAGES).map(([code, lang]) => {
                const isSelected = currentLanguage === code;
                return (
                  <button
                    key={code}
                    id={`btn-lang-${code}`}
                    onClick={() => onChangeLanguage(code)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold shadow-md shadow-emerald-950'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span className="text-xs">{lang.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}

              {/* Custom Added Languages */}
              {(Object.entries(customLanguages) as [string, CustomLanguage][]).map(([code, lang]) => {
                const isSelected = currentLanguage === code;
                return (
                  <button
                    key={code}
                    onClick={() => onChangeLanguage(code)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag || '🌐'}</span>
                      <span className="text-xs">{lang.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Language Form */}
            {showAddLanguageForm && (
              <form
                onSubmit={handleAddLanguageSubmit}
                className="mt-4 p-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-3"
              >
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {t.addLanguage}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder={t.enterLanguageName}
                    value={newLangName}
                    onChange={(e) => setNewLangName(e.target.value)}
                    className="sm:col-span-2 px-3 py-1.5 bg-[#080d19] border border-slate-700 rounded-lg text-xs text-slate-100 outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder={t.enterLanguageCode}
                    value={newLangCode}
                    onChange={(e) => setNewLangCode(e.target.value)}
                    className="px-3 py-1.5 bg-[#080d19] border border-slate-700 rounded-lg text-xs text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLanguageForm(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg shadow"
                  >
                    {t.addLanguageButton}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 2. Currency Section */}
          <div className="p-4 rounded-2xl bg-[#09101d] border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase text-slate-200">
                {t.currency}
              </h3>
            </div>

            {/* Currency Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                id="search-currency-input"
                type="text"
                placeholder={t.searchCurrency}
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#080d19] border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            {/* Currency Grid or "No Result" notice */}
            {matchedCurrencies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1">
                {matchedCurrencies.map((c) => {
                  const isSelected = currentCurrency.code === c.code;
                  return (
                    <button
                      key={c.code}
                      id={`btn-curr-${c.code}`}
                      onClick={() => onChangeCurrency(c)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold shadow'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs">{c.code}</span>
                        <span className="text-xs text-slate-400 font-mono">{c.symbol}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{c.name}</div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center bg-slate-900/40 border border-slate-800/80 rounded-xl text-xs text-rose-400 font-medium">
                {t.noCurrencyResult} "{currencySearch}"
              </div>
            )}
          </div>

          {/* 3. Prediction Display Mode Toggle */}
          <div className="p-4 rounded-2xl bg-[#09101d] border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase text-slate-200">
                {t.displayMode}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                id="btn-displaymode-auto"
                onClick={() => onChangeDisplayMode('auto')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  displayMode === 'auto'
                    ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">{t.displayModeAuto}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Show higher %</div>
              </button>

              <button
                id="btn-displaymode-rise"
                onClick={() => onChangeDisplayMode('rise_only')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  displayMode === 'rise_only'
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">{t.displayModeRiseOnly}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Always Chance of Rise</div>
              </button>

              <button
                id="btn-displaymode-dip"
                onClick={() => onChangeDisplayMode('dip_only')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  displayMode === 'dip_only'
                    ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">{t.displayModeDipOnly}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Always Chance of Dip</div>
              </button>
            </div>
          </div>

          {/* 4. Risk Level Section */}
          <div className="p-4 rounded-2xl bg-[#09101d] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase text-slate-200 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                {t.riskLevel}
              </div>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as RiskLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onChangeRiskLevel(lvl)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      riskLevel === lvl
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">{t.themeCyberDark}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
