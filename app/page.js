import Link from 'next/link';
import { 
  Shield, 
  AlertTriangle, 
  Mail, 
  CheckCircle, 
  ArrowRight, 
  Brain,
  Search,
  Lock,
  BarChart3,
  Users,
  Clock,
  Zap,
  FileText,
  Globe,
  Target,
  Award,
  MessageSquare,
  Download,
  Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-500/30 p-4 rounded-2xl backdrop-blur-sm">
                  <Shield className="w-16 h-16 text-blue-200" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                AI-Powered Email Scam & Phishing Detector
              </h1>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-blue-200 text-lg">
                <div className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Advanced Machine Learning
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Real-Time Threat Detection
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Comprehensive Analytics
                </div>
              </div>
              <div className="mt-4 text-blue-100 max-w-3xl mx-auto">
                <p className="flex items-center justify-center text-lg">
                  Protect your organization from sophisticated phishing attacks and email scams
                </p>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Identify Malicious Emails Before They Reach Your Inbox
              <span className="block text-blue-200 mt-2 text-2xl">98.5% Detection Accuracy with AI-Powered Analysis</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Our advanced machine learning model analyzes email content, headers, and patterns to 
              detect sophisticated phishing attempts, scam emails, and social engineering attacks 
              in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <Shield className="w-5 h-5 mr-2" />
                Start Free Analysis
              </Link>
              <Link
                href="/auth/login"
                className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Access Dashboard
              </Link>
            </div>
            <div className="mt-8 flex justify-center space-x-8 text-sm text-blue-200">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                No credit card required
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Free basic analysis
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Instant results
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: '10,000+', sublabel: 'Protected Users' },
              { icon: Mail, label: '1M+', sublabel: 'Emails Analyzed' },
              { icon: AlertTriangle, label: '50K+', sublabel: 'Threats Blocked' },
              { icon: Award, label: '99.9%', sublabel: 'Uptime Guarantee' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Email Security Platform
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced threat detection powered by machine learning to protect your organization 
              from evolving email-based attacks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Analysis',
                description: 'Advanced machine learning models trained on millions of phishing emails',
                features: [
                  '98.5% detection accuracy',
                  'Continuous model updates',
                  'Pattern recognition',
                  'Behavioral analysis'
                ]
              },
              {
                icon: Search,
                title: 'Deep Content Inspection',
                description: 'Thorough analysis of email content, headers, and metadata',
                features: [
                  'Header authentication check',
                  'Link reputation analysis',
                  'Attachment scanning',
                  'Language pattern detection'
                ]
              },
              {
                icon: AlertTriangle,
                title: 'Real-Time Threat Detection',
                description: 'Instant identification of phishing attempts and scams',
                features: [
                  'Zero-day threat protection',
                  'Immediate alerts',
                  'Risk scoring',
                  'Priority classification'
                ]
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Comprehensive reporting and threat intelligence',
                features: [
                  'Threat trends dashboard',
                  'User risk assessment',
                  'Attack vector analysis',
                  'Compliance reporting'
                ]
              },
              {
                icon: Lock,
                title: 'Security & Compliance',
                description: 'Enterprise-grade security with full compliance',
                features: [
                  'End-to-end encryption',
                  'GDPR compliant',
                  'Data privacy protection',
                  'Audit trails'
                ]
              },
              {
                icon: Globe,
                title: 'Multi-Language Support',
                description: 'Detection capabilities across multiple languages',
                features: [
                  'International phishing detection',
                  'Localized scam patterns',
                  'Cross-language analysis',
                  'Global threat database'
                ]
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Email Analysis Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered system analyzes every aspect of an email to identify potential threats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Mail,
                step: '1',
                title: 'Submit Email',
                description: 'Forward suspicious emails or use our API for automated analysis'
              },
              {
                icon: Brain,
                step: '2',
                title: 'AI Analysis',
                description: 'ML model analyzes content, headers, links, and patterns'
              },
              {
                icon: Target,
                step: '3',
                title: 'Threat Detection',
                description: 'Instant identification of phishing indicators and scam patterns'
              },
              {
                icon: CheckCircle,
                step: '4',
                title: 'Get Results',
                description: 'Receive detailed report with risk score and detection reasons'
              }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detection Categories - FIXED SECTION */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Detect
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive protection against various types of email-based threats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fixed: Using static color classes instead of dynamic */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Phishing Emails</h3>
              <p className="text-sm text-gray-600">25K+/month detected</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Business Email Compromise</h3>
              <p className="text-sm text-gray-600">12K+/month detected</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Credential Theft</h3>
              <p className="text-sm text-gray-600">18K+/month detected</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Spear Phishing</h3>
              <p className="text-sm text-gray-600">8K+/month detected</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Malicious Attachments</h3>
              <p className="text-sm text-gray-600">15K+/month detected</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Suspicious Links</h3>
              <p className="text-sm text-gray-600">30K+/month detected</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">CEO Fraud</h3>
              <p className="text-sm text-gray-600">5K+/month detected</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Social Engineering</h3>
              <p className="text-sm text-gray-600">20K+/month detected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your organization's needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                description: 'For individuals and small teams',
                features: [
                  '10 email analyses/month',
                  'Basic threat detection',
                  'Email support',
                  '7-day history'
                ],
                button: 'Get Started',
                popular: false
              },
              {
                name: 'Professional',
                price: '$49',
                period: '/month',
                description: 'For growing businesses',
                features: [
                  '500 email analyses/month',
                  'Advanced threat detection',
                  'Priority support',
                  '30-day history',
                  'API access',
                  'Team management'
                ],
                button: 'Start Free Trial',
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For large organizations',
                features: [
                  'Unlimited analyses',
                  'Custom ML model training',
                  'Dedicated support',
                  'Unlimited history',
                  'SLA guarantee',
                  'On-premise deployment'
                ],
                button: 'Contact Sales',
                popular: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-xl shadow-lg p-8 ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white scale-105 border-2 border-blue-400' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`${plan.popular ? 'text-blue-200' : 'text-gray-500'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle className={`w-4 h-4 mr-2 ${
                        plan.popular ? 'text-blue-300' : 'text-blue-600'
                      }`} />
                      <span className={plan.popular ? 'text-blue-100' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === 'Enterprise' ? '/contact' : '/auth/register'}
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-white text-blue-700 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.button}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Security Professionals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what our users say about our email protection platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This tool caught a sophisticated phishing email that bypassed our other security measures. The detailed analysis helped us understand the threat vectors.",
                author: "Sarah Johnson",
                role: "CISO, TechCorp Inc.",
                rating: 5
              },
              {
                quote: "The AI detection is incredibly accurate. We've reduced successful phishing attempts by 95% since implementing this solution.",
                author: "Michael Chen",
                role: "IT Security Manager",
                rating: 5
              },
              {
                quote: "The dashboard analytics provide invaluable insights into our email threat landscape. Worth every penny for the enterprise plan.",
                author: "David Williams",
                role: "Security Consultant",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Start Protecting Your Organization Today
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of organizations using our AI-powered platform to detect 
            and prevent email-based threats before they cause damage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center space-x-2 bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              <span>Start Free Analysis</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center space-x-2 bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              <span>Request Demo</span>
            </Link>
          </div>
          <div className="mt-8 flex justify-center space-x-6 text-sm text-blue-200">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              No credit card required
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              14-day free trial
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Cancel anytime
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <div>
                  <span className="font-bold text-xl">PhishDetect AI</span>
                  <p className="text-blue-300 text-sm">Advanced Email Security</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered email scam and phishing detection platform protecting 
                organizations from sophisticated email-based threats.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 text-blue-300">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/api-docs" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 text-blue-300">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/threat-intel" className="hover:text-white transition-colors">Threat Intelligence</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 text-blue-300">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>© {new Date().getFullYear()} PhishDetect AI. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}