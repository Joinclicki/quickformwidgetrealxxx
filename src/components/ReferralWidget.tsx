import React, { useState } from 'react';
import { X, DollarSign, Gift } from 'lucide-react';
import ThankYouModal from './ThankYouModal';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  referralFirstName: string;
  referralLastName: string;
  referralPhone: string;
}

interface WidgetConfig {
  buttonColor?: string;
  youtubeVideoId?: string;
  headerText?: string;
  rewardText?: string;
  webhookUrl1?: string;
  webhookUrl2?: string;
}

const INITIAL_FORM_DATA: FormData = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  referralFirstName: '',
  referralLastName: '',
  referralPhone: '',
};

const DEFAULT_CONFIG: WidgetConfig = {
  buttonColor: '#4F46E5', // Default indigo-600
  youtubeVideoId: 'your-video-id',
  headerText: 'Refer a business to Clicki Referrals!',
  rewardText: 'Earn $25 per referral',
  webhookUrl1: 'YOUR_FIRST_WEBHOOK_URL',
  webhookUrl2: 'YOUR_SECOND_WEBHOOK_URL',
};

export default function ReferralWidget({ config = {} }: { config?: WidgetConfig }) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [isOpen, setIsOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First webhook
      if (finalConfig.webhookUrl1) {
        await fetch(finalConfig.webhookUrl1, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      // Wait 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Second webhook
      if (finalConfig.webhookUrl2) {
        await fetch(finalConfig.webhookUrl2, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      setFormData(INITIAL_FORM_DATA);
      setIsSubmitting(false);
      setIsOpen(false);
      setShowThankYou(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          style={{ backgroundColor: finalConfig.buttonColor }}
          className="fixed bottom-4 left-4 z-50 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Gift className="w-5 h-5" />
          Refer & Earn
        </button>
        {showThankYou && (
          <ThankYouModal onClose={() => setShowThankYou(false)} rewardText={finalConfig.rewardText} />
        )}
      </>
    );
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 md:bg-transparent md:pointer-events-none" 
        onClick={() => setIsOpen(false)}
      >
        <div 
          onClick={e => e.stopPropagation()} 
          className="fixed md:absolute w-full md:w-[380px] bg-white h-full md:h-auto md:bottom-4 md:left-4 md:rounded-lg shadow-xl overflow-auto md:pointer-events-auto"
        >
          <div className="sticky top-0 bg-white p-4 border-b z-10">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-1">{finalConfig.headerText} 👋</h2>
            <div className="aspect-video bg-gray-100 rounded-lg mb-4">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${finalConfig.youtubeVideoId}`}
                title="Clicki Referrals | Affiliate Program"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <DollarSign className="w-5 h-5" />
                Earn rewards!
              </div>
              <p className="text-green-700">{finalConfig.rewardText}</p>
            </div>
          </div>

          {/* Rest of the form JSX remains the same until the submit button */}
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">What's your name?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[16px]"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[16px]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">What's your phone number?</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="(555) 555-5555"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[16px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Who are you referring?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="referralFirstName"
                  placeholder="First name"
                  value={formData.referralFirstName}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[16px]"
                  required
                />
                <input
                  type="text"
                  name="referralLastName"
                  placeholder="Last name"
                  value={formData.referralLastName}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[16px]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">What's their number?</label>
              <input
                type="tel"
                name="referralPhone"
                placeholder="(555) 555-5555"
                value={formData.referralPhone}
                onChange={handleInputChange}
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[16px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: finalConfig.buttonColor }}
              className="w-full text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md animate-pulse-beacon"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  Send Referral
                </>
              )}
            </button>
          </form>
          
          <div className="p-2 text-center text-xs text-gray-500 border-t">
            Get more referrals with Clicki ✨
          </div>
        </div>
      </div>
      {showThankYou && (
        <ThankYouModal onClose={() => setShowThankYou(false)} rewardText={finalConfig.rewardText} />
      )}
    </>
  );
}