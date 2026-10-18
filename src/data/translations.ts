import type { MerchantLanguage } from '../types';

export interface MerchantTranslations {
  portalTitle: string;
  portalSubtitle: string;
  selectLanguage: string;
  freezeAlertTitle: string;
  freezeAlertDesc: string;
  frozenAmount: string;
  holdLayer: string;
  regulatoryNotice: string;
  daysRemaining: string;
  scenariosTitle: string;
  scenarioSubtitle: string;
  statementTitle: string;
  statementSubtitle: string;
  statementPlaceholder: string;
  recordVoice: string;
  stopRecord: string;
  previewAudio: string;
  pauseAudio: string;
  evidenceTitle: string;
  evidenceSubtitle: string;
  receiptLabel: string;
  shopPhotoLabel: string;
  uploadCustom: string;
  submitButton: string;
  reSubmitButton: string;
  processingText: string;
  statusHold: string;
  statusCleared: string;
  statusClearedDesc: string;
  statusRejected: string;
  statusRejectedDesc: string;
  viewReceipt: string;
  closeReceipt: string;
  safeHarborProtected: string;
  officerApprovedAt: string;
  caseRef: string;
}

export const TRANSLATIONS: Record<MerchantLanguage, MerchantTranslations> = {
  kn: {
    portalTitle: 'ಪ್ರಮಾಣ-AI ವ್ಯಾಪಾರಿ ಪೋರ್ಟಲ್',
    portalSubtitle: 'ರಿಯಲ್-ಟೈಮ್ UPI ತಡೆ ತೆರವು ಇಂಜಿನ್ (RBI & NPCI)',
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    freezeAlertTitle: '⚠️ ನಿಮ್ಮ ಖಾತೆಯ ಮೇಲೆ UPI ಡೆಬಿಟ್ ತಡೆ (Hold) ವಿಧಿಸಲಾಗಿದೆ',
    freezeAlertDesc: 'ಸೈಬರ್ ಅಪರಾಧ ದೂರಿನ ಕಾರಣದಿಂದಾಗಿ ಈ ವಹಿವಾಟನ್ನು ತಾತ್ಕಾಲಿಕವಾಗಿ ತಡೆಹಿಡಿಯಲಾಗಿದೆ. ವ್ಯಾಪಾರದ ಪುರಾವೆ ನೀಡಿ ತಕ್ಷಣ ಅನ್‌ಬ್ಲಾಕ್ ಮಾಡಿಕೊಳ್ಳಿ.',
    frozenAmount: 'ತಡೆಹಿಡಿಯಲಾದ ಮೊತ್ತ',
    holdLayer: 'ಲೇಯರ್-3 ಸೈಬರ್ ಲಿಯನ್',
    regulatoryNotice: 'ಆರ್‌ಬಿಐ ಸೆಪ್ಟೆಂಬರ್ 2026 ನಿಯಮಾವಳಿ - 20 ದಿನಗಳ ಗ್ರಾಹಕ ರಕ್ಷಣೆ',
    daysRemaining: 'ಉಳಿದಿರುವ ಸಮಯ: 19 ದಿನಗಳು',
    scenariosTitle: '1-ಕ್ಲಿಕ್ ಡೆಮೊ ಸನ್ನಿವೇಶಗಳು',
    scenarioSubtitle: 'ಪರೀಕ್ಷಿಸಲು ಒಂದು ಸನ್ನಿವೇಶ ಆಯ್ಕೆಮಾಡಿ',
    statementTitle: 'ವ್ಯಾಪಾರಿ ವಿವರಣೆ (ಕನ್ನಡ ಧ್ವನಿ / ಟೆಕ್ಸ್ಟ್)',
    statementSubtitle: 'ವಹಿವಾಟು ಮತ್ತು ಗ್ರಾಹಕರ ವಿವರಗಳನ್ನು ಧ್ವನಿಯಲ್ಲಿ ತಿಳಿಸಿ',
    statementPlaceholder: 'ಇಲ್ಲಿ ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಮಾಡಿ ಅಥವಾ ಗ್ರಾಹಕರ ವಿವರ, ಮಾರಾಟವಾದ ಸರಕುಗಳ ವಿವರವನ್ನು ಬರೆಯಿರಿ...',
    recordVoice: 'ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಮಾಡಿ',
    stopRecord: 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ',
    previewAudio: 'ಪ್ಲೇ ಮಾಡಿ',
    pauseAudio: 'ನಿಲ್ಲಿಸಿ',
    evidenceTitle: 'ವಾಣಿಜ್ಯ ವಹಿವಾಟಿನ ದಾಖಲೆಗಳು',
    evidenceSubtitle: 'ಸ್ವಯಂಚಾಲಿತ ಬಿಲ್ ಅಥವಾ ನಿಮ್ಮ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    receiptLabel: '1. ಖರೀದಿ ಬಿಲ್ / ಟ್ಯಾಕ್ಸ್ ಇನ್‌ವಾಯ್ಸ್',
    shopPhotoLabel: '2. ಅಂಗಡಿ ಕೌಂಟರ್ ಫೋಟೋ',
    uploadCustom: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್',
    submitButton: 'ಪುರಾವೆ ಸಲ್ಲಿಸಿ & ತಡೆ ತೆರವುಗೊಳಿಸಿ (Gemini AI Audit)',
    reSubmitButton: 'ಮರು-ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ',
    processingText: 'ಜೆಮಿನಿ 2.5 AI ಪರಿಶೀಲನೆ ನಡೆಯುತ್ತಿದೆ...',
    statusHold: 'ತಾತ್ಕಾಲಿಕ ತಡೆ (Hold Active)',
    statusCleared: '✅ ಅಭಿನಂದನೆಗಳು! ಡೆಬಿಟ್ ತಡೆ ತೆರವುಗೊಳಿಸಲಾಗಿದೆ',
    statusClearedDesc: 'ಬ್ಯಾಂಕ್ ನೋಡಲ್ ಅಧಿಕಾರಿಯು ನಿಮ್ಮ ಪುರಾವೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಸುರಕ್ಷಿತ ವ್ಯಾಪಾರಿ ಎಂದು ದೃಢಪಡಿಸಿದ್ದಾರೆ. ನಿಮ್ಮ ಹಣ ತಕ್ಷಣ ಬಿಡುಗಡೆಯಾಗಿದೆ.',
    statusRejected: '❌ ವಹಿವಾಟು ತಿರಸ್ಕರಿಸಲಾಗಿದೆ (ಸೈಬರ್ ಸೆಲ್ ತನಿಖೆ)',
    statusRejectedDesc: 'ಪುರಾವೆ ಹೊಂದಾಣಿಕೆಯಾಗದ ಕಾರಣ ಈ ಖಾತೆಯನ್ನು NCRP 1930 ಸೈಬರ್ ಅಪರಾಧ ವಿಭಾಗಕ್ಕೆ ವರ್ಗಾಯಿಸಲಾಗಿದೆ.',
    viewReceipt: 'ದೊಡ್ಡದಾಗಿ ನೋಡಿ',
    closeReceipt: 'ಮುಚ್ಚಿ',
    safeHarborProtected: 'ಆರ್‌ಬಿಐ ನಿಯಮ 14(b) ಅಡಿಯಲ್ಲಿ ರಕ್ಷಣೆ ಪಡೆದಿದೆ',
    officerApprovedAt: 'ಅಧಿಕಾರಿಯ ಅನುಮೋದನೆ ಸಮಯ',
    caseRef: 'ಪ್ರಕರಣದ ಸಂಖ್ಯೆ',
  },
  hi: {
    portalTitle: 'प्रमाण-AI व्यापारी पोर्टल',
    portalSubtitle: 'रियल-टाइम भुगतान अनब्लॉकर व वैधता जांच इंजन',
    selectLanguage: 'भाषा चुनें',
    freezeAlertTitle: '⚠️ आपके खाते पर अस्थायी UPI डेबिट होल्ड लगा है',
    freezeAlertDesc: 'साइबर अपराध जांच के तहत इस लेन-देन पर अस्थायी रोक लगाई गई है। प्रमाण प्रस्तुत कर तुरंत होल्ड हटाएं।',
    frozenAmount: 'होल्ड की गई राशि',
    holdLayer: 'लेयर-3 साइबर लियन',
    regulatoryNotice: 'आरबीआई सितंबर 2026 निर्देश - 20-दिवसीय ग्राहक सुरक्षा',
    daysRemaining: 'शेष समय: 19 दिन',
    scenariosTitle: '1-क्लिक डेमो केस',
    scenarioSubtitle: 'परीक्षण के लिए केस चुनें',
    statementTitle: 'व्यापारी का बयान (वॉइस या टेक्स्ट)',
    statementSubtitle: 'लेन-देन और सामान की बिक्री की जानकारी बोलें या लिखें',
    statementPlaceholder: 'यहां अपनी आवाज़ रिकॉर्ड करें या लेन-देन और ग्राहक का विवरण लिखें...',
    recordVoice: 'आवाज़ रिकॉर्ड करें',
    stopRecord: 'रिकॉर्डिंग रोकें',
    previewAudio: 'सुनें',
    pauseAudio: 'रोकें',
    evidenceTitle: 'व्यापारिक बिक्री प्रमाण',
    evidenceSubtitle: 'स्वचालित बिल या अपनी रसीद अपलोड करें',
    receiptLabel: '1. बिक्री बिल / टैक्स रसीद',
    shopPhotoLabel: '2. दुकान / काउंटर की फोटो',
    uploadCustom: 'फोटो अपलोड करें',
    submitButton: 'सबूत जमा करें और खाता अनब्लॉक करें (Gemini AI)',
    reSubmitButton: 'पुनः जांच के लिए भेजें',
    processingText: 'जेमिनी 2.5 AI जांच कर रहा है...',
    statusHold: 'अस्थायी रोक (होल्ड सक्रिय)',
    statusCleared: '✅ बधाई! आपके खाते से होल्ड हटा दिया गया है',
    statusClearedDesc: 'बैंक नोडल अधिकारी ने आपके सबूतों की पुष्टि कर दी है और खाता तुरंत प्रभाव से अनब्लॉक कर दिया गया है।',
    statusRejected: '❌ लेन-देन अस्वीकृत (साइबर सेल को भेजा गया)',
    statusRejectedDesc: 'सबूतों में विसंगति के कारण यह केस NCRP 1930 साइबर अपराध प्रकोष्ठ को सौंप दिया गया है।',
    viewReceipt: 'बड़ा देखें',
    closeReceipt: 'बंद करें',
    safeHarborProtected: 'आरबीआई नियम 14(b) के तहत सुरक्षित',
    officerApprovedAt: 'स्वीकृति समय',
    caseRef: 'केस संदर्भ',
  },
  en: {
    portalTitle: 'Pramaan-AI Merchant Portal',
    portalSubtitle: 'Real-Time Payment Chain-Freeze Resolution Engine',
    selectLanguage: 'Language',
    freezeAlertTitle: '⚠️ Temporary Debit Hold Placed on Your Account',
    freezeAlertDesc: 'A cyber-fraud lien has been placed on this transaction by law enforcement. Submit proof of sale to lift the hold.',
    frozenAmount: 'Frozen Amount',
    holdLayer: 'Layer-3 Cyber Lien',
    regulatoryNotice: 'RBI September 2026 Draft KYC Directions (20-Day Safe Harbor)',
    daysRemaining: '19 Days 14 Hrs Remaining',
    scenariosTitle: '1-Click Demo Scenarios',
    scenarioSubtitle: 'Select a case to inspect',
    statementTitle: 'Merchant Statement (Vernacular Voice / Text)',
    statementSubtitle: 'Explain the transaction in your natural language',
    statementPlaceholder: 'Record voice or type your explanation of goods sold, customer details, and payment timestamp...',
    recordVoice: 'Record Voice',
    stopRecord: 'Stop Recording',
    previewAudio: 'Play',
    pauseAudio: 'Pause',
    evidenceTitle: 'Commercial Proof-of-Sale Documents',
    evidenceSubtitle: 'Auto-generated invoice or upload custom photo',
    receiptLabel: '1. Tax Invoice / Receipt',
    shopPhotoLabel: '2. Shop Front / Counter Photo',
    uploadCustom: 'Upload Photo',
    submitButton: 'Submit Evidence & Run Gemini AI Audit',
    reSubmitButton: 'Re-Submit & Re-Audit',
    processingText: 'Running Gemini 2.5 Flash Multimodal Audit...',
    statusHold: 'Temporary Debit Hold Active',
    statusCleared: '✅ Debit Hold Lifted! Account Fully Unblocked',
    statusClearedDesc: 'Bank Nodal Officer verified your commercial evidence via Gemini 2.5 Flash. Safe-harbor clearance certificate issued.',
    statusRejected: '❌ Account Suspended & Escalated to Cyber Crime Cell',
    statusRejectedDesc: 'Evidence mismatch flagged. Referred to National Cyber Crime Reporting Portal (NCRP 1930 / SPF ASC).',
    viewReceipt: 'Enlarge',
    closeReceipt: 'Close',
    safeHarborProtected: 'Protected under RBI Directive Section 14(b)',
    officerApprovedAt: 'Adjudication Timestamp',
    caseRef: 'Case Docket Ref',
  },
};

// Vernacular pre-filled statements for scenarios by language
export const SCENARIO_STATEMENTS: Record<string, Record<MerchantLanguage, string>> = {
  'ramesh-medicals': {
    kn: 'ಸರ್, ಗ್ರಾಹಕರು ₹1,450 ಕೊಟ್ಟು ಮಗುವಿನ ಹಾಲು (ಲ್ಯಾಕ್ಟೋಜನ್-2) ಮತ್ತು ಅಮಾಕ್ಸಿಸಿಲಿನ್ 500mg ಆಂಟಿಬಯೋಟಿಕ್ ಅನ್ನು ಸಂಜೆ 4:15 ಕ್ಕೆ ಖರೀದಿಸಿದರು. ಇಗೋ ನನ್ನ ಕಾರ್ಬನ್-ಕಾಪಿ ಬಿಲ್ #409 ಮತ್ತು ಮೆಡಿಕಲ್ ಶಾಪ್ ಕೌಂಟರ್ ಫೋಟೋ. ನನ್ನ ಖಾತೆ ಅನ್‌ಬ್ಲಾಕ್ ಮಾಡಿ.',
    hi: 'सर, ग्राहक ने शाम 4:15 बजे ₹1,450 में बच्चे का दूध (Lactogen) और एमोक्सिसिलिन दवा खरीदी। यह मेरा कार्बन-कॉपी बिल #409 और मेरी मेडिकल दुकान की काउंटर फोटो है। कृपया खाता तुरंत अनब्लॉक करें।',
    en: 'Sir, customer bought baby food (Lactogen-2) and Amoxicillin 500mg for ₹1,450 at 4:15 PM. Here is my carbon-copy bill #409 and my medical shop counter photo. Please unfreeze my funds.',
  },
  'uncle-tan-chicken-rice': {
    kn: 'ಗ್ರಾಹಕರು ಮಧ್ಯಾಹ್ನ 12:30 ಕ್ಕೆ ಕಚೇರಿ ಊಟಕ್ಕಾಗಿ 10 ಪ್ಯಾಕೆಟ್ ಹುರಿದ ಚಿಕನ್ ರೈಸ್ ಆರ್ಡರ್ ಮಾಡಿದರು ($48.50 SGD). ಇದು ನನ್ನ Sunmi POS ಥರ್ಮಲ್ ರಸೀದಿ.',
    hi: 'ग्राहक ने दोपहर 12:30 बजे ऑफिस लंच के लिए 10 पैकेट चिकन राइस ऑर्डर किए ($48.50 SGD)। यह मेरा POS थर्मल रसीद बिल है।',
    en: 'Customer ordered 10 packets roasted chicken rice for office lunch at 12:30 PM, here is the POS thermal slip for $48.50 SGD paid via PayNow.',
  },
  'rajesh-trading': {
    kn: 'ನಾವು ಹಾರ್ಡ್‌ವೇರ್ ವ್ಯಾಪಾರ ಮಾಡುತ್ತೇವೆ. ₹48,000 ಹಣ ಬಂದಿತ್ತು. ಇದು ಮೂರು ವಾರಗಳ ಹಿಂದಿನ ₹12,000 ಹಾರ್ಡ್‌ವೇರ್ ಬಿಲ್.',
    hi: 'हम हार्डवेयर ट्रेडिंग करते हैं। ₹48,000 किसी ग्राहक से आया था। यह 3 हफ्ते पुराना ₹12,000 का रसीद है।',
    en: 'We do hardware trading. Payment of ₹48,000 was received from buyer. Attached is hardware receipt dated 3 weeks ago for ₹12,000.',
  },
};
