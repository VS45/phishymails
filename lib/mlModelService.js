// This is a simplified ML model service
// In production, you'd integrate with actual ML models (TensorFlow.js, Python API, etc.)

class MLModelService {
    constructor() {
        this.modelLoaded = false;
        this.phishingKeywords = [
            'verify your account',
            'confirm your identity',
            'suspended',
            'unusual activity',
            'login attempt',
            'update your information',
            'click here',
            'urgent action required',
            'limited time',
            'won a prize',
            'lottery',
            'inheritance',
            'wire transfer',
            'western union',
            'money gram',
            'bitcoin',
            'cryptocurrency',
            'paypal',
            'bank account',
            'credit card',
            'ssn',
            'social security',
            'password expired',
            'security alert',
        ];

        this.suspiciousDomains = [
            'secure-verify.com',
            'account-update.net',
            'paypal-security.com',
            'bank-verification.info',
            'amazon-support.co',
            'apple-id-verify.org',
            'microsoft-account.net',
            'dropbox-login.com',
            'google-docs-share.xyz',
            'facebook-security.tk',
        ];
    }

    async loadModel() {
        // Simulate loading a pre-trained model
        this.modelLoaded = true;
        console.log('ML Model loaded successfully');
        return true;
    }

    extractLinks(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = text.match(urlRegex) || [];
        
        return urls.map(url => {
            try {
                const domain = new URL(url).hostname;
                const isSuspicious = this.suspiciousDomains.some(d => domain.includes(d));
                
                return {
                    url,
                    domain,
                    isSuspicious,
                    threatLevel: isSuspicious ? 'suspicious' : 'safe',
                    reason: isSuspicious ? 'Domain matches known suspicious pattern' : null,
                };
            } catch (e) {
                return {
                    url,
                    domain: 'invalid',
                    isSuspicious: true,
                    threatLevel: 'suspicious',
                    reason: 'Invalid URL format',
                };
            }
        });
    }

    analyzeEmailContent(emailData) {
        const { subject, body, sender, headers } = emailData;
        const fullText = `${subject} ${body}`.toLowerCase();
        
        const detectionReasons = [];
        let confidenceScore = 0;
        let status = 'safe';

        // Check for phishing keywords
        const foundKeywords = this.phishingKeywords.filter(keyword => 
            fullText.includes(keyword.toLowerCase())
        );

        if (foundKeywords.length > 0) {
            detectionReasons.push({
                reason: `Contains suspicious keywords: ${foundKeywords.slice(0, 3).join(', ')}`,
                category: 'urgent_language',
                severity: foundKeywords.length > 5 ? 'high' : 'medium',
                details: foundKeywords,
            });
            confidenceScore += foundKeywords.length * 5;
        }

        // Check for urgent/threatening language
        const urgentPatterns = [
            'urgent', 'immediately', 'within 24 hours', 'suspended', 
            'closed', 'terminated', 'legal action'
        ];
        
        const urgentFound = urgentPatterns.filter(p => fullText.includes(p));
        if (urgentFound.length > 0) {
            detectionReasons.push({
                reason: 'Contains urgent or threatening language',
                category: 'threatening_language',
                severity: 'high',
                details: urgentFound,
            });
            confidenceScore += 25;
        }

        // Check for requests for personal information
        const personalInfoPatterns = [
            'password', 'ssn', 'social security', 'credit card', 'pin',
            'bank account', 'login credentials', 'verify your identity'
        ];
        
        const personalInfoFound = personalInfoPatterns.filter(p => fullText.includes(p));
        if (personalInfoFound.length > 0) {
            detectionReasons.push({
                reason: 'Requests personal or financial information',
                category: 'request_for_personal_info',
                severity: 'critical',
                details: personalInfoFound,
            });
            confidenceScore += 35;
        }

        // Check for grammar and spelling issues (simplified)
        const grammarIssues = this.checkGrammarIssues(fullText);
        if (grammarIssues.length > 0) {
            detectionReasons.push({
                reason: 'Contains unusual grammar or spelling errors',
                category: 'grammar_issues',
                severity: 'low',
                details: grammarIssues.slice(0, 3),
            });
            confidenceScore += grammarIssues.length * 2;
        }

        // Extract and analyze links
        const links = this.extractLinks(fullText);
        const suspiciousLinks = links.filter(l => l.isSuspicious);
        
        if (suspiciousLinks.length > 0) {
            detectionReasons.push({
                reason: `Contains ${suspiciousLinks.length} suspicious link(s)`,
                category: 'suspicious_links',
                severity: suspiciousLinks.length > 2 ? 'high' : 'medium',
                details: suspiciousLinks.map(l => l.domain),
            });
            confidenceScore += suspiciousLinks.length * 15;
        }

        // Check for generic greetings
        if (fullText.includes('dear customer') || fullText.includes('dear user') || 
            fullText.includes('valued member') || !fullText.includes('dear')) {
            detectionReasons.push({
                reason: 'Uses generic greeting instead of personalized',
                category: 'generic_greeting',
                severity: 'low',
                details: 'Legitimate emails typically address you by name',
            });
            confidenceScore += 5;
        }

        // Check for spoofed sender (simplified)
        if (sender && headers) {
            const domain = sender.split('@')[1];
            if (domain && this.suspiciousDomains.some(d => domain.includes(d))) {
                detectionReasons.push({
                    reason: 'Sender domain appears suspicious',
                    category: 'spoofed_sender',
                    severity: 'high',
                    details: `Domain: ${domain}`,
                });
                confidenceScore += 30;
            }
        }

        // Determine status based on confidence score
        if (confidenceScore >= 70) {
            status = 'phishing';
        } else if (confidenceScore >= 40) {
            status = 'suspicious';
        } else {
            status = 'safe';
        }

        // Cap confidence score at 100
        confidenceScore = Math.min(confidenceScore, 100);

        return {
            status,
            confidenceScore,
            reasons: detectionReasons,
            links,
            analyzedAt: new Date(),
        };
    }

    checkGrammarIssues(text) {
        // Simplified grammar checking
        // In production, use a proper NLP library or API
        const issues = [];
        
        // Check for excessive capitalization
        if ((text.match(/[A-Z]{5,}/g) || []).length > 0) {
            issues.push('Excessive capitalization');
        }
        
        // Check for multiple exclamation marks
        if ((text.match(/!{2,}/g) || []).length > 0) {
            issues.push('Multiple exclamation marks');
        }
        
        // Check for common typos
        const commonTypos = ['recieved', 'seperate', 'definately', 'accomodate'];
        commonTypos.forEach(typo => {
            if (text.includes(typo)) {
                issues.push(`Possible typo: "${typo}"`);
            }
        });
        
        return issues;
    }

    async predict(emailData) {
        if (!this.modelLoaded) {
            await this.loadModel();
        }

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        return this.analyzeEmailContent(emailData);
    }
}

export default new MLModelService();