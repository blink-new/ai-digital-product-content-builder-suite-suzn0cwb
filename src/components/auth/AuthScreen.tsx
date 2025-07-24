import { SparklesIcon, CheckIcon } from '@heroicons/react/24/outline'
import { blink } from '../../blink/client'

const features = [
  'Create 60+ types of digital products',
  'AI-powered content generation',
  'One-click auto-fill functionality',
  'Multi-format export (PDF, DOCX, HTML, MD)',
  'Professional templates library',
  'Viral meme & social media generator',
  'Advanced analytics & insights',
  'Monetization strategies included'
]

const stats = [
  { label: 'Product Types', value: '60+' },
  { label: 'AI Models', value: '10+' },
  { label: 'Export Formats', value: '4' },
  { label: 'Templates', value: '500+' }
]

export function AuthScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left side - Features */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8">
          <div className="mx-auto max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Builder Suite</h1>
                <p className="text-gray-600">Professional Content Creation</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Create Professional Digital Products in Minutes
            </h2>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right side - Auth */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">AI Builder Suite</h1>
              <p className="text-gray-600 mt-2">Professional Content Creation Platform</p>
            </div>
            
            <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">
                  Sign in to access your AI-powered content creation suite
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg text-white">
                    <div className="flex items-center space-x-3 mb-3">
                      <SparklesIcon className="w-6 h-6" />
                      <span className="font-semibold">What's New</span>
                    </div>
                    <ul className="text-sm space-y-1 opacity-90">
                      <li>• 10 AI models integration</li>
                      <li>• Advanced blog generator</li>
                      <li>• Social media automation</li>
                      <li>• Professional PDF designer</li>
                    </ul>
                  </div>
                </div>
                
                <button
                  onClick={() => blink.auth.login()}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Sign In to Get Started
                </button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <span>🚀 Instant Setup</span>
                <span>🔒 Secure & Private</span>
                <span>⚡ AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}